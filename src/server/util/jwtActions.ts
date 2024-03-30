
import jwt from 'jsonwebtoken'

let JWT_SECRET = "my_temp_secret_derived_from_env"

type jwt_token_data = {
    id : string
    type: "ADMIN" | "USER"

}

export function decodeToken(token: string): jwt_token_data{
    return jwt.verify(token, JWT_SECRET) as jwt_token_data;
}

export function encodeToken(jwt_data : jwt_token_data): string{
    let expiry = (Number(process.env.JWT_EXPIRATION_TIME_MINUTES)*60) || '24h'

    return jwt.sign(jwt_data, JWT_SECRET, { expiresIn : expiry})
}