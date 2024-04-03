
import jwt from 'jsonwebtoken'

let JWT_SECRET = "my_temp_secret_derived_from_env";

let TEMP_JWT_SECRET = "my_temp_secret_for_unverified_customer"

type jwt_token_data = {
    id : number
    type: "ADMIN" | "USER"

}

export function decodeToken(token: string, temp:boolean=false): jwt_token_data{
    let MY_JWT_SECRET = temp? TEMP_JWT_SECRET : JWT_SECRET
    return jwt.verify(token, MY_JWT_SECRET) as jwt_token_data;
}

export function encodeToken(jwt_data : jwt_token_data, temp:boolean=false): string{
    let expiry = (Number(process.env.JWT_EXPIRATION_TIME_MINUTES)*60) || '24h'
    let MY_JWT_SECRET = temp? TEMP_JWT_SECRET : JWT_SECRET
    return jwt.sign(jwt_data, MY_JWT_SECRET, { expiresIn : expiry})
}