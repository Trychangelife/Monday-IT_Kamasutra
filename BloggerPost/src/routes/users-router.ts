import { NextFunction, Router } from "express";
import { container } from "../composition-root";
import { authMiddleware } from "../middlewares/authorization-middlewear";
import { inputValidationMiddleware, userInputModel } from "../middlewares/input-validation-middleware";
import { UsersController } from "./UsersController";

const usersController = container.resolve(UsersController)
export const usersRouter = Router({})

usersRouter.delete('/del', usersController.deleteAllUsers.bind(usersController))
usersRouter.get('/', usersController.getAllUsers.bind(usersController))
usersRouter.post('/', authMiddleware, userInputModel, inputValidationMiddleware, usersController.createUser.bind(usersController))
usersRouter.delete('/:id', authMiddleware, usersController.deleteUserById.bind(usersController))
usersRouter.get('/:id', usersController.getUserById.bind(usersController))
