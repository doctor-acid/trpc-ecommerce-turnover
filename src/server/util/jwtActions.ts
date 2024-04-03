
import jwt from 'jsonwebtoken'
import { env } from '~/env';

const JWT_SECRET = env.JWT_SECRET

const TEMP_JWT_SECRET = env.TEMP_JWT_SECRET

type jwt_token_data = {
    id : number
    type: "ADMIN" | "USER"

}

export function decodeToken(token: string, temp=false): jwt_token_data{
    const MY_JWT_SECRET = temp? TEMP_JWT_SECRET : JWT_SECRET
    return jwt.verify(token, MY_JWT_SECRET) as jwt_token_data;
}

export function encodeToken(jwt_data : jwt_token_data, temp=false): string{
    const expiry = (Number(process.env.JWT_EXPIRATION_TIME_MINUTES)*60) || '24h'
    const MY_JWT_SECRET = temp? TEMP_JWT_SECRET : JWT_SECRET
    return jwt.sign(jwt_data, MY_JWT_SECRET, { expiresIn : expiry})
}