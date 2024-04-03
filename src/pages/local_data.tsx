"use client;"
import { User, UserInterests } from "@prisma/client"

export function getToken(){
    return localStorage.getItem('token')
}

export function setToken(token: string|undefined): void{
    if(token)
    localStorage.setItem('token',token)
    else{
        localStorage.removeItem('token')
        setAuthUser(undefined)
    }
}

export function getUserInterests(id?:number): UserInterests[]{
    let interests = localStorage.getItem('user_interests')
    return interests? JSON.parse(interests):[]
}

export function setUserInterests(interests: UserInterests[],id?:number){
    localStorage.setItem('user_interests', JSON.stringify(interests))
}

export function getAuthUser(): Partial<User>|undefined{
    let user = localStorage.getItem('user_')
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