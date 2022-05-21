import { NextFunction, Request, Response, Router } from "express";
import { usersService } from "../domain/users-service";
import { authMiddleware } from "../middlewares/authorization-middlewear";
import { inputValidationMiddleware, userInputModel } from "../middlewares/input-validation-middleware";
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

usersRouter.get('/:id', async (req: Request, res: Response) => {
    const resultSearch = await usersService.findUserById(req.params.id)
    if (resultSearch !== null) {
        res.status(200).send(resultSearch)
    }
    else {
        res.status(404).send('User not found')
    }
})

// usersRouter.get('/login', async (req: Request, res: Response) => {
//     const user = await usersService.checkCredentials(req.body.login, req.body.password)
//     const foundUser = await usersCollection.findOne({login: req.body.login})
//     if(foundUser && user) {
//         const token = await jwtService.createJWT(foundUser)
//         res.status(201).send(token)
//     }
//     else {
//         res.sendStatus(401)
//     }
// })