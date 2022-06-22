import { NextFunction, Request, Response, Router } from "express";
import { usersService } from "../domain/users-service";
import { authMiddleware } from "../middlewares/authorization-middlewear";
import { inputValidationMiddleware, userInputModel } from "../middlewares/input-validation-middleware";
import { usersModel } from "../repositories/db";
import { UsersType } from "../types/Types";
import { constructorPagination } from "./bloggers-router";


export const usersRouter = Router({})


class UsersController {
    async deleteAllUsers (req: Request, res: Response) {
        const afterDelete = await usersModel.deleteMany({})
        res.send(afterDelete)
    }
    async getAllUsers (req: Request, res: Response) {
        const paginationData = constructorPagination(req.query.PageSize as string, req.query.PageNumber as string)
        const resultUsers = await usersService.allUsers(paginationData.pageSize, paginationData.pageNumber)
        res.status(200).send(resultUsers)
    }
    async createUser (req: Request, res: Response) {
        const result: UsersType | null | boolean = await usersService.createUser(req.body.login, req.body.password, req.body.email, req.ip)
        if (result == false) {
            res.status(400).send("Login or email already use")
        }
        else {
            res.status(204).send()
        }
    }
    async deleteUserById (req: Request, res: Response) {
        const afterDelete = await usersService.deleteUser(req.params.id as string)
        if (afterDelete == true) {
            res.send(204)
        }
        else {
            res.send(404)
        }
    
    }
    async getUserById (req: Request, res: Response) {
        const resultSearch = await usersService.findUserById(req.params.id)
        if (resultSearch !== null) {
            res.status(200).send(resultSearch)
        }
        else {
            res.status(404).send('User not found')
        }
    }
}

const usersController = new UsersController()

usersRouter.delete('/del', usersController.deleteAllUsers)
usersRouter.get('/', usersController.getAllUsers)
usersRouter.post('/', authMiddleware, userInputModel, inputValidationMiddleware, usersController.createUser)
usersRouter.delete('/:id', authMiddleware, usersController.deleteUserById)
usersRouter.get('/:id', usersController.getUserById)
