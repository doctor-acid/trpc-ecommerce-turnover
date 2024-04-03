import { User } from "@prisma/client";

export function sanitizedUser(user:Partial<User>): Partial<User>{
    delete user.password;
    delete user.authCode
    delete user.ver_code
    return user
}

export const randDigits = (n: number)=>{
    let ansString = '';
    let ansNum = 0;
    for(let i=0; i<n; i++){
      const n = Math.floor(Math.random()*10);
      ansString+=n;
      ansNum+=(n*Math.pow(10, i))
    }
    return {ansString, ansNum}
  }