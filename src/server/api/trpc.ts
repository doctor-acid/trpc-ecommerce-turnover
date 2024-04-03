/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { TRPCError, initTRPC } from "@trpc/server";
import { type NextApiRequest, type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "~/server/db";
import Logger from "../logger";
import { testCache } from "../cache";
import { decodeToken } from "../util/jwtActions";

// type CreateContextOptions = Record<string, never>;
type CreateContextOptionsUsable = Record<string, NextApiRequest>;

const createInnerTRPCContext = (_opts: CreateContextOptionsUsable) => {

  return {
    db,
    testCache,
    req : _opts.req,
    Logger
  };
};

export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  const { req } = _opts;
  return createInnerTRPCContext({
    req
  });
};


/**
 * CUSTOM LOGGING FOR ERRORS
 * USING ERROR FORMATTER
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error, ctx }) {

    // CUSTOM LOGGING ENABLED.
    // COULD BE WRITTEN TO FILE OR A MESSAGE QUEUE and to ANOTHER SERVICE


    if(ctx){
      const logger = new ctx.Logger('console');
      logger.log(error.message)
    }

    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});




export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

const authenticator = t.middleware(async ({ctx, next})=>{
  const { req, db } = ctx;

  const token = req && req.headers.authorization && req.headers.authorization.replace('Bearer ', '');

  if(!token) throw new TRPCError({message: "Please login or signup to proceed", code: "UNAUTHORIZED"})

  try {
    const { id } = decodeToken(token);

    const user = await db.user.findUnique({where: {id}});
    if(!user) throw new TRPCError({message: "Please login or signup to proceed", code: "UNAUTHORIZED"})
    return next({
      ctx: {
        userId: id,
        user,
        ...ctx
      }
    })
  } catch (error) {
    throw new TRPCError({message: 'Malformed Token', code: 'UNAUTHORIZED'})
  }
})






export const privateProcedure = t.procedure.use(authenticator)
export const publicProcedure = t.procedure;

// import { getDataAndMorph } from "../dev/devFunctions";
// getDataAndMorph()