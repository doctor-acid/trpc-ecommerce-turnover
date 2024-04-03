"use client;"
import type { User, UserInterests } from "@prisma/client"

export function getToken(){
    if(typeof window !== undefined){
        return localStorage.getItem('token')
    }
}

export function setToken(token: string|undefined): void{
    if(typeof window !== undefined){
        if(token)
        localStorage.setItem('token',token)
        else{
            localStorage.removeItem('token')
            setAuthUser(undefined)
        }
    }
}

export function getUserInterests(): UserInterests[]{
    if(typeof window !== undefined){
        const interests = localStorage.getItem('user_interests')
        return interests? JSON.parse(interests):[]
    }else{
        return []
    }
}

export function setUserInterests(interests: UserInterests[],){
    if(typeof window !== undefined){
        localStorage.setItem('user_interests', JSON.stringify(interests))
    }
}

export function addUserInterest(interest: UserInterests,){
    if(typeof window !== undefined){
        const interests = getUserInterests();
        interests.push(interest)
        setUserInterests(interests)
    }
}

export function removeUserInterest(interest: UserInterests|null, interestId?: number){

    let interests = getUserInterests();
    if(!interest)
        interests = interests.filter((item)=>item.id!==interestId)
    else 
        interests = interests.filter((item)=>item.id!==interest.id)
    setUserInterests(interests)
}

export function getAuthUser(): Partial<User>|undefined{
    const user = localStorage.getItem('user_')
    return user? JSON.parse(user):undefined
}

export function setAuthUser(user:Partial<User>|undefined){
    if(user)
    localStorage.setItem('user_', JSON.stringify(user))
    else{
        localStorage.removeItem('user_')
        setUserInterests([])
    }
}