import { NextFunction, Request, Response, Router } from "express";
import { UsersService } from "../domain/users-service";
import { authMiddleware } from "../middlewares/authorization-middlewear";
import { inputValidationMiddleware, userInputModel } from "../middlewares/input-validation-middleware";
import { usersModel } from "../repositories/db";
import { UsersType } from "../types/Types";
import { constructorPagination } from "./bloggers-router";


export const usersRouter = Router({})


class UsersController {

    constructor (private usersService = new UsersService()) {
    }

    async deleteAllUsers (req: Request, res: Response) {
        const afterDelete = await usersModel.deleteMany({})
        res.send(afterDelete)
    }
    async getAllUsers (req: Request, res: Response) {
        const paginationData = constructorPagination(req.query.PageSize as string, req.query.PageNumber as string)
        const resultUsers = await this.usersService.allUsers(paginationData.pageSize, paginationData.pageNumber)
        res.status(200).send(resultUsers)
    }
    async createUser (req: Request, res: Response) {
        const result: UsersType | null | boolean = await this.usersService.createUser(req.body.login, req.body.password, req.body.email, req.ip)
        if (result == false) {
            res.status(400).send("Login or email already use")
        }
        else {
            res.status(204).send()
        }
    }
    async deleteUserById (req: Request, res: Response) {
        const afterDelete = await this.usersService.deleteUser(req.params.id as string)
        if (afterDelete == true) {
            res.send(204)
        }
        else {
            res.send(404)
        }
    
    }
    async getUserById (req: Request, res: Response) {
        const resultSearch = await this.usersService.findUserById(req.params.id)
        if (resultSearch !== null) {
            res.status(200).send(resultSearch)
        }
        else {
            res.status(404).send('User not found')
        }
    }
}

const usersController = new UsersController()

usersRouter.delete('/del', usersController.deleteAllUsers.bind(usersController))
usersRouter.get('/', usersController.getAllUsers.bind(usersController))
usersRouter.post('/', authMiddleware, userInputModel, inputValidationMiddleware, usersController.createUser.bind(usersController))
usersRouter.delete('/:id', authMiddleware, usersController.deleteUserById.bind(usersController))
usersRouter.get('/:id', usersController.getUserById.bind(usersController))
