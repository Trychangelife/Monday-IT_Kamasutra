import { UsersType } from "../repositories/users-repository";
import jwt from "jsonwebtoken";
import { settings } from "../settings";


export const jwtService  = {
    async createJWT(user: UsersType) {
        const token = jwt.sign({id: user.id}, settings.JWT_SECRET, {expiresIn: '12h'})
        return token
    },
    async getUserByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.id
        }catch (error) {
            return null
        }
    }
}