import { RefreshTokenStorageType, UsersType } from "../types/UsersType";
import jwt from "jsonwebtoken";
import { settings } from "../settings";
import { refreshTokenCollection } from "../repositories/db";


export const jwtService = {
    async accessToken(user: UsersType) {
        const accessToken = jwt.sign({ id: user.id }, settings.JWT_SECRET, { expiresIn: '1m' })
        return accessToken
    },
    async refreshToken(user: UsersType): Promise<string> {
        const refreshToken = jwt.sign({ id: user.id }, settings.JWT_REFRESH_SECRET, { expiresIn: '3m' })
        const newRefreshToken: RefreshTokenStorageType = {
            userId: user.id,
            refreshToken: refreshToken
        }
        const foundExistToken = await refreshTokenCollection.findOne({ userId: user.id })
        if (foundExistToken == null) {
            await refreshTokenCollection.insertOne(newRefreshToken)
            return refreshToken
        }
        else {
            await refreshTokenCollection.updateOne({userId: user.id}, {$set: {refreshToken: newRefreshToken.refreshToken}})
            return refreshToken
        }
    },
    async getUserByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.id
        } catch (error) {
            return null
        }
    },
    async getNewAccessToken(rToken: string): Promise<object | null> {
        const checkToken = await refreshTokenCollection.findOne({ refreshToken: rToken })
        if (checkToken !== null) {
            try {
                const result: any = jwt.verify(rToken, settings.JWT_REFRESH_SECRET)
                return { newAccessToken: await this.accessToken(result), newRefreshToken: await this.refreshToken(result) }
            } catch (error) {
                return null
            }
        }
        else {
            return null
        }

    },
}