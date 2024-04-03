import { z } from "zod";
import * as bcrypt from 'bcrypt'

import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { decodeToken, encodeToken } from "~/server/util/jwtActions";
import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";

let fakeSalt = bcrypt.genSaltSync(3);

import { fakeEmailService } from "../services/emailService";
import { randDigits, sanitizedUser } from "~/server/util/utilFunctions";
import { UserService } from "../services/user.service";


export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(8) }))

    .mutation(async ({ ctx, input }) => {
      try {
        const userService = new UserService(ctx)
        let authUser = await userService.isAuthUser(input.email, input.password)
  
  
        if(authUser){
          let token =  encodeToken({id: authUser.id!, type: 'USER'})
          return {user: authUser, redirect: authUser.verified? '/' : '/verify', token }
        }else{
          throw new TRPCError({
            message: 'User not found. Please signup or try checking your details.',
            code: 'UNAUTHORIZED',
            cause: {redirect: 'login'}
          })
        }
      } catch (error) {
        console.log(error)
        if(error instanceof TRPCError){
          throw error
        }
        throw new TRPCError({
          message: 'Some problem occurred',
          code: 'INTERNAL_SERVER_ERROR',
          cause: {redirect: 'login'}
        })
      }

    }),

  signUp: publicProcedure
    .input(z.object({ name: z.string().min(3), email: z.string().email(), password: z.string().min(8) }))
    // better password check
    .mutation(async ({ ctx, input }) => {
      try {
        const userService = new UserService(ctx)
        let user = await ctx.db.user.findUnique({where: {email: input.email}})
        if(!user){
          let {ansString: verificationCode} = randDigits(8);
          // faking 
          verificationCode = '12345678'

          // store only hashed password
          let hashedPassword = bcrypt.hashSync(input.password, fakeSalt);
          user = await ctx.db.user.create({
            data: {
              name: input.name,
              email: input.email,
              password: hashedPassword,
              ver_code: verificationCode
            },
          });
  
  
          // send email to user : Mock email service
          let text = `Your verification code for Ecommerce trpc app is ${verificationCode}. Happy shopping!`
          fakeEmailService(input.email, text, [])

          let token = encodeToken({id: user.id, type: 'USER'})
  
          return {msg: 'Please check verification code sent in your email.', token}
        }else{
          throw new TRPCError({
            message: "This email is already registered with a different user. Please login to continue",
            code: "CONFLICT",
            cause: {redirect: '/login'}
          })
        }
  
      } catch (error) {
        // console.log(error)
        if(error instanceof TRPCError){
          throw error
        }
        throw new TRPCError({
          message: 'Something went wrong.',
          code: 'INTERNAL_SERVER_ERROR',
          cause: {error: process.env.NODE_ENV === "production" ?'' : error,redirect: 'signup'}
        })
      }
    }),

    verify: privateProcedure
    .input(z.object({ code: z.string().min(8).max(8)}))
    .mutation(async ({ ctx, input }) => {
      let user = ctx.user;
      
      if(input.code===user.ver_code){
        user = await ctx.db.user.update({
          where: {id:user.id},
          data: {verified: true}
        }) 

        return {user: sanitizedUser(user)}
      }else{
        throw new TRPCError({
          message: 'Wrong Code',
          code: 'BAD_REQUEST'
        })
      }

    }),

  authenticateToken: privateProcedure.query(async ({ ctx }) => {
    let user = ctx.user;
    let token = user?.authCode;
    return {user: sanitizedUser(user), redirect: user.verified? '/' : '/verify', token }
  }),
});
