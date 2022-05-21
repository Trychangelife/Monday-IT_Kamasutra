import { NextFunction, Request, Response, Router } from "express";
import { usersService } from "../domain/users-service";
import { authMiddleware } from "../middlewares/authorization-middlewear";
import { inputValidationMiddleware, inputValidationMiddlewareForUser, userInputModel } from "../middlewares/input-validation-middleware";
import { usersCollection } from "../repositories/db";
import { UsersType } from "../repositories/users-repository";
import { constructorPagination } from "./bloggers-router";



export const usersRouter = Router()

usersRouter.delete('/del', async (req: Request, res: Response) => {
    const afterDelete = await usersCollection.deleteMany({})
    res.send(afterDelete)
})
usersRouter.get('/', async (req: Request, res: Response) => {
    const paginationData = constructorPagination(req.query.PageSize as string, req.query.PageNumber as string)
    const resultUsers = await usersService.allUsers(paginationData.pageSize, paginationData.pageNumber)
    res.status(200).send(resultUsers)
})

usersRouter.post('/', authMiddleware, userInputModel, inputValidationMiddleware, async (req: Request, res: Response) => {
    const result: UsersType | null | boolean = await usersService.createUser(req.body.login, req.body.password)
    if (result == false) {
        res.status(400).send("Login already use")
    }
    else {
        res.status(201).send(result)
    }

})
usersRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const afterDelete = await usersService.deleteUser(req.params.id as string)
    if (afterDelete == true) {
        res.send(204)
    }
    else {
        res.send(404)
    }

})