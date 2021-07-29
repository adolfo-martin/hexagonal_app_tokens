// https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs
// @ts-ignore: Unreachable code error
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'

export class TokenSessionUtility {

    private static SERVER_PRIVATE_KEY = '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611'


    public static generateToken(
        login: string,
        remoteAddress: string,
        type?: string
    ): string {
        const data = { login, remoteAddress, type }
        return jwt.sign(
            data,
            TokenSessionUtility.SERVER_PRIVATE_KEY,
            { expiresIn: 84000 }
        )
    }


    public static isValidToken(
        token: string,
        remoteAddress: string,
    ): boolean {
        if (!token) {
            return false
        }

        try {
            const data: { remoteAddress: string } = jwt.verify(token, TokenSessionUtility.SERVER_PRIVATE_KEY)
            if (!data.remoteAddress || data.remoteAddress !== remoteAddress) {
                return false
            }

            return true
        } catch (error: TokenExpiredError) {
            if (error instanceof JsonWebTokenError) {
                return false
            }

            if (error instanceof TokenExpiredError) {
                return false
            }

            console.log(error)
            throw error
        }
    }

    public static decodeToken(token: string): Object | undefined {
        if (!token) {
            return undefined
        }

        try {
            const data: Object = jwt.verify(token, TokenSessionUtility.SERVER_PRIVATE_KEY)
            return data
        } catch (error: TokenExpiredError) {
            if (error instanceof JsonWebTokenError) {
                return undefined
            }

            if (error instanceof TokenExpiredError) {
                return undefined
            }

            console.log(error)
            throw error
        }
    }
}