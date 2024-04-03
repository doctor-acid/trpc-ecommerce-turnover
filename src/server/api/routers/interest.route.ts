import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { Categories } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { CategoryService } from "../services/interest.service";


export const interestRouter = createTRPCRouter({
  addInterest: privateProcedure
    .input(z.object({ id:z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
        let categoryService = new CategoryService(ctx)
        let category = await categoryService.getCategoryById(input.id)
        if(!category){
            throw new TRPCError({
                message: "Invalid Category Id",
                code: 'BAD_REQUEST'
            })
        }
        let userInterest = await categoryService.addInterest(input.id, ctx.userId)
        return {data: userInterest}
    }),

  getCategoriesPaginated: privateProcedure
    .input(z.object({ page: z.number().min(1).default(1), limit: z.number().min(3).max(50).default(10), lastId: z.number().min(1).optional()}))
    // better password check
    .mutation(async ({ ctx, input }) => {
      try {
        let categories : Categories[] = []
        input.lastId? 
            categories = await ctx.db.categories.findMany({take: input.limit, where: {id:{gt:input.lastId}} })
            :categories = await ctx.db.categories.findMany({take: input.limit, skip: (input.page-1)*input.limit })

            return categories;
      } catch (error) {
        throw new TRPCError({
          message: 'Something went wrong.',
          code: 'INTERNAL_SERVER_ERROR',
          cause: {error: process.env.NODE_ENV === "production" ?'' : error}
        })
      }
    }),

  getUserPreferences: privateProcedure
  .query(async ({ ctx }) => {
    try {
        let categoryService = new CategoryService(ctx)
        let userPreferences = await categoryService.getUserInterests(ctx.userId)

        return userPreferences;
    } catch (error) {
        throw new TRPCError({
            message: 'Something went wrong.',
            code: 'INTERNAL_SERVER_ERROR',
            cause: {error: process.env.NODE_ENV === "production" ?'' : error}
        })
    }
  }),
  removeInterest: privateProcedure
  .input(z.object({ id:z.number().min(1) }))
  .mutation(async ({ ctx, input }) => {
      let categoryService = new CategoryService(ctx)
      let category = await categoryService.getCategoryById(input.id)
      if(!category){
          throw new TRPCError({
              message: "Invalid Category Id",
              code: 'BAD_REQUEST'
          })
      }
      let userInterest = await categoryService.removeInterest(input.id, ctx.userId)
      return {data: userInterest}
  }),
  countOfTotalCategories: privateProcedure
  .query(async ({ ctx }) => {
      let categoryService = new CategoryService(ctx)
      let categoryCount = await categoryService.getCategoryCount()
      return {data: categoryCount}
  }),
});
