import { NextFunction, Request, Response, Router } from "express";
import { jwtService } from "../application/jwt-service";
import { usersService } from "../domain/users-service";
import { authMiddleware } from "../middlewares/authorization-middlewear";
import { inputValidationMiddleware, LoginInputModel, userInputModel } from "../middlewares/input-validation-middleware";
import { usersCollection } from "../repositories/db";
import { UsersType } from "../types/UsersType";


export const authRouter = Router({})



authRouter.post('/login',LoginInputModel,inputValidationMiddleware, async (req: Request, res: Response) => {
    const user = await usersService.checkCredentials(req.body.login, req.body.password)
    const foundUser = await usersCollection.findOne({login: req.body.login})
    if (!user) {
        res.send(401)
    }
    else if(foundUser && user) {
        const token = await jwtService.createJWT(foundUser)
        res.status(200).send({token})
    }
    else {
        res.sendStatus(400)
    }
})

authRouter.post('/registration-confirmation', async (req: Request, res: Response) => {
    const activationResult = await usersService.confirmationEmail(req.body.code)
    if (activationResult) {
        res.sendStatus(204)
    }
    else {
        res.status(400).send('Oops, Something wrong')
    }
    // Сюда еще 429 статус прикрутить 5+ авторизаций с одного IP

})


authRouter.post('/registration', userInputModel, inputValidationMiddleware, async (req: Request, res: Response) => {
    const result: UsersType | null | boolean = await usersService.createUser(req.body.login, req.body.password, req.body.email)
    if (result == false) {
        res.status(400).send("Login or email already use")
    }
    else {
        res.status(204).send()
    }
})

authRouter.post('/registration-email-resending',LoginInputModel,inputValidationMiddleware, async (req: Request, res: Response) => {
    const user = await usersService.checkCredentials(req.body.login, req.body.password)

})