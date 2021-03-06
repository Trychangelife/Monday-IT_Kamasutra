import { RefreshTokenStorageType, UsersType } from "../types/Types";
import jwt from "jsonwebtoken";
import { settings } from "../settings";
import { refreshTokenModel } from "../repositories/db";


export const jwtService = {
    async accessToken(user: UsersType) {
        const accessToken = jwt.sign({ id: user.id }, settings.JWT_SECRET, { expiresIn: '10 sec' })
        return accessToken
    },
    async refreshToken(user: UsersType): Promise<string> {
        const refreshToken = jwt.sign({ id: user.id }, settings.JWT_REFRESH_SECRET, { expiresIn: '20 sec' })
        const newRefreshToken: RefreshTokenStorageType = {
            userId: user.id,
            refreshToken: refreshToken
        }
        const foundExistToken = await refreshTokenModel.findOne({ userId: user.id })
        if (foundExistToken == null) {
            await refreshTokenModel.create(newRefreshToken)
            return refreshToken
        }
        else {
            await refreshTokenModel.updateOne({ userId: user.id }, { $set: { refreshToken: newRefreshToken.refreshToken } })
            //await refreshTokenModel.findOneAndDelete({refreshToken: refreshToken})
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
        const checkToken = await refreshTokenModel.findOne({ refreshToken: rToken })
        if (checkToken !== null) {
            try {
                const result: any = jwt.verify(rToken, settings.JWT_REFRESH_SECRET)
                const newAccessToken = await this.accessToken(result)
                const newRefreshToken =  await this.refreshToken(result)
                return { newAccessToken, newRefreshToken }
            } catch (error) {
                return null
            }
        }
        else {
            return null
        }

    },
    async checkRefreshToken(refreshToken: string): Promise<boolean | object> {
        try {
            const result = jwt.verify(refreshToken, settings.JWT_REFRESH_SECRET)
            return {token: result}
        } catch (error) {
            return false
        }
    }
}