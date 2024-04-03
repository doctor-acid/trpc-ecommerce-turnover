
class TestCache<T,K> extends Map<T,K>{
    private myMap = new Map<T, K>()
    constructor(){
        super()
    }
    setx(k:T, v:K, ttlSeconds:number){
        this.myMap.set(k,v);
        setTimeout(()=>{
            this.myMap.delete(k)
        }, ttlSeconds*1000)
    }

    // set some cache eviction strategy and VROOM, VROOM
}

export const testCache = new TestCache<any,any>()
// export const testCache = new Map<any, any>()