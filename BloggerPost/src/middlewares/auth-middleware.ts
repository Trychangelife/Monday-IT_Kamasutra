import { NextFunction, Request, Response } from "express";
import { usersService } from "../domain/users-service";
import { jwtService } from "../application/jwt-service";
import { UsersType } from "../types/UsersType";

export interface IGetUserAuthInfoRequest extends Request {
    user: UsersType | null
}


export const authMiddlewareWithJWT = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserByToken(token)

    if (userId) {
        const user =  await usersService.findUserById(userId)
        if(user !== null) {
        req.user = user
        next() }
    }
    else {
        res.send(401)
    }
    
} 