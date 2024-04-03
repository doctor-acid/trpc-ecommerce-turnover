import { User } from "@prisma/client";

import { createTRPCContext } from "../trpc";
import * as bcrypt from 'bcrypt'
import { randDigits, sanitizedUser } from "~/server/util/utilFunctions";


export class UserService{
    ctx: ReturnType<typeof createTRPCContext>
    constructor(ctx: ReturnType<typeof createTRPCContext>){
        this.ctx = ctx
    }

    async getUserById(id: number): Promise<Partial<User>|null>{
        let user = await this.ctx.db.user.findUnique({
            where: {id}
        })
        return user
    }

    async isAuthUser(email:string, password:string): Promise<Partial<User>|null>{
        let user: User|null
        // check in cache first
        user = await this.ctx.testCache.get('authUser_'+email)

        // cache miss
        if(!user){
            user = await this.ctx.db.user.findUnique({
                where: {email: email}
            })
            if(user){
                await this.ctx.testCache.set('authUser_'+email, user)
            }
        }
    
        if(user && bcrypt.compareSync(password, user?.password))
        return sanitizedUser(user)
        else
        return null

    }

    async getUserFromEmail(email: string):Promise<Partial<User>|null>{
        let user: User|null
        // check in cache first
        user = await this.ctx.testCache.get(email)

        // cache miss
        if(!user){
            user = await this.ctx.db.user.findUnique({where: {email}})
            if(user){
                await this.ctx.testCache.set('authUser_'+email, user)
            }
        }
        return user
    }
}