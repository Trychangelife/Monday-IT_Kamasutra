import { NextFunction, Request, Response, Router } from "express";
import { jwtService } from "../application/jwt-service";
import { usersService } from "../domain/users-service";
import { inputValidationMiddleware, LoginInputModel, userInputModel } from "../middlewares/input-validation-middleware";
import { usersCollection } from "../repositories/db";


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

authRouter.post('/registration-confirmation',LoginInputModel,inputValidationMiddleware, async (req: Request, res: Response) => {
    const user = await usersService.checkCredentials(req.body.login, req.body.password)

})


authRouter.post('/registration',LoginInputModel,inputValidationMiddleware, async (req: Request, res: Response) => {
    const resultRegistration = await usersService.checkCredentials(req.body.login, req.body.password)

})

authRouter.post('/registration-email-resending',LoginInputModel,inputValidationMiddleware, async (req: Request, res: Response) => {
    const user = await usersService.checkCredentials(req.body.login, req.body.password)

})