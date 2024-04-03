import { type Categories, type UserInterests } from "@prisma/client";
import { type createTRPCContext } from "../trpc";
import { assertIsError } from "~/utils/exception";


export class CategoryService{
    ctx: ReturnType<typeof createTRPCContext>
    constructor(ctx: ReturnType<typeof createTRPCContext>){
        this.ctx = ctx
    }

    async getCategoryById(id: number):Promise<Categories|null>{
        return await this.ctx.db.categories.findUnique({where: {id}})
    }

    async getAllCategoriesPaginated(limit:number, page=1, lastId?:number): Promise<Categories[]>{
        const categories = 
                lastId? 
                    await this.ctx.db.categories.findMany({take: limit, where: {id:{gt:lastId}} })
                    :await this.ctx.db.categories.findMany({take: limit, skip: (page-1)*limit })
        return categories
    }

    async addInterest(interestId:number, userId:number): Promise<UserInterests>{

        // frequent operations
        // Offload writes to CACHE and recuperate later using some regular cron for eventual consistency.
        // can Have Master Slave replication for CACHE persistence

        // For ease of operation WRITE_BACK cache for now.

        

        const userInterest = await this.ctx.db.userInterests.create({
            data: {
                userId: userId,
                interestId: interestId
            }
        })

        // update in cache
        const interests = await this.ctx.testCache.get('interest_'+userId)
        const allUserInterests: UserInterests[] = interests ? interests : [];

        allUserInterests.push(userInterest);
        await this.ctx.testCache.set('interest_'+userId, allUserInterests)

        return userInterest

    }

    async removeInterest(interestId:number, userId:number): Promise<UserInterests|null>{

        // frequent operations
        // Offload writes to CACHE and recuperate later using some regular cron for eventual consistency.
        // can Have Master Slave replication for CACHE persistence


        // For ease of operation WRITE_BACK cache for now.

        const userInterest = await this.ctx.db.userInterests.findFirst({
            where: {
                userId: userId,
                interestId: interestId
            }
        })
        if(!userInterest){
            return null
        }
        await this.ctx.db.userInterests.delete({
            where: { id : userInterest?.id}
        })

        // update in cache
        const interests = await this.ctx.testCache.get('interest_'+userId)
        let allUserInterests: UserInterests[] = interests ? interests : [];

        allUserInterests = allUserInterests.length ? 
                                allUserInterests.filter((interest)=>interest.id !== userInterest?.id)
                                :allUserInterests
        await this.ctx.testCache.set('interest_'+userId, allUserInterests)

        return userInterest

    }

    async getUserInterests(userId: number):Promise<UserInterests[]>{
        let interests: UserInterests[]
        // check in CACHE first
        try {
            interests = await this.ctx.testCache.get('interest_'+userId)

            if(interests && interests.length) console.log('USER INTERESTS FROM CACHE')
    
            // CACHE miss
            if(!interests || !interests.length){
                interests = await this.ctx.db.userInterests.findMany({where: {userId}})
                await this.ctx.testCache.set('interest_'+userId, interests)
            }
            return interests;
        } catch (error) {
            console.log(error);
            assertIsError(error)
            throw new Error(error.message)
        }
    }

    async getCategoryCount():Promise<number>{
        let categoryCount: number
        // check in CACHE first
        categoryCount = await this.ctx.testCache.get('categoryCount')

        // CACHE miss
        if(!categoryCount){
            categoryCount = await this.ctx.db.categories.count();

            // eventual consistency for higher availability. Time to life set for 1 hour.
            await this.ctx.testCache.setx('categoryCount', categoryCount, 60*60)
        }
        return await this.ctx.db.categories.count();
    }
}