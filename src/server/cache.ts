import type { User, UserInterests } from "@prisma/client";
import { cacheKeys } from "./keys";

class TestCache<T extends string, K extends User|UserInterests|number> extends Map<T,K>{
    private myMap = new Map<T, K>()
    constructor(){
        super()
    }
    getVal(key:string){
        if(key.startsWith(cacheKeys.authUser)){
            // const user: User|undefined = this.myMap.get(key)
            // return user
        }
    }
    setx(k:T, v:K, ttlSeconds:number){
        this.myMap.set(k,v);
        setTimeout(()=>{
            this.myMap.delete(k)
        }, ttlSeconds*1000)
    }

    // set some cache eviction strategy and VROOM, VROOM
}

export const testCache = new TestCache<string,any>()
// export const testCache = new Map<any, any>()