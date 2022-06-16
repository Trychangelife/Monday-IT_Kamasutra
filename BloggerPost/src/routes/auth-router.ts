import { Request, Response, Router } from "express";
import { jwtService } from "../application/jwt-service";
import { authService } from "../domain/auth-service";
import { emailService } from "../domain/email-service";
import { usersService } from "../domain/users-service";
import { checkAvailabilityEmail, checkUniqueData, inputValidationMiddleware, LoginInputModel, userInputModel } from "../middlewares/input-validation-middleware";
import { usersRepository } from "../repositories/users-repository";
import { UsersType } from "../types/Types";


export const authRouter = Router({})

authRouter.post('/login', LoginInputModel, inputValidationMiddleware, async (req: Request, res: Response) => {
    await authService.informationAboutAuth(req.ip, req.body.login)
    const checkIP = await authService.counterAttemptAuth(req.ip, req.body.login)
    if (checkIP) {
        const user = await usersService.checkCredentials(req.body.login, req.body.password)
        const foundUser = await usersRepository.findUserByLogin(req.body.login)
        if (!user) {
            res.send(401)
        }
        else if (foundUser && user) {
            const accessToken = await jwtService.accessToken(foundUser)
            const refreshToken = await jwtService.refreshToken(foundUser)
            res.status(200).send({ accessToken, refreshToken })
        }
        else {
            res.sendStatus(400)
        }
    }
    else {
        res.sendStatus(429)
    }
})
authRouter.post('/update-access-token', LoginInputModel, inputValidationMiddleware, async (req: Request, res: Response) => {
    const refreshToken = req.header("x-auth-token")
    if (!refreshToken) {
        res.status(401).send('Refresh token not found, where you header?')
    }
    else if (refreshToken) {
        const newAccessToken = await jwtService.getNewAccessToken(refreshToken)
        if (newAccessToken !== null) {
        res.status(200).send( newAccessToken )}
        else {
            res.status(401).send('Refresh Token already not valid, repeat authorization')
        }
    }
    else {
        res.sendStatus(400)
    }
})

authRouter.post('/registration', checkUniqueData, userInputModel, inputValidationMiddleware, async (req: Request, res: Response) => {
    const result: UsersType | null | boolean = await usersService.createUser(req.body.login, req.body.password, req.body.email, req.ip)
    if (result == false) {
        res.status(400).send("Oops something wrong")
    }
    else if (result == null) {
        res.sendStatus(429)
    }
    else {
        res.status(204).send()
    }
})

authRouter.post('/registration-confirmation', async (req: Request, res: Response) => {
    await authService.informationAboutConfirmed(req.ip, req.body.code)
    const checkInputCode = await authService.counterAttemptConfirm(req.ip, req.body.code)
    if (checkInputCode) {
        const activationResult = await usersService.confirmationEmail(req.body.code)
        if (activationResult) {
            res.sendStatus(204)
        }
        else {
            res.status(400).send({ errorsMessages: [{ message: "invalid code", field: "code" }] })
        }
    }
    else {
        res.sendStatus(429)
    }
})

authRouter.post('/registration-email-resending', userInputModel[2], checkAvailabilityEmail, inputValidationMiddleware, async (req: Request, res: Response) => {
    await authService.informationAboutEmailSend(req.ip, req.body.email)
    const checkAttemptEmail = await authService.counterAttemptEmail(req.ip, req.body.email)
    if (checkAttemptEmail) {
        await authService.refreshActivationCode(req.body.email)
        const emailResending = await emailService.emailConfirmation(req.body.email)
        if (emailResending) {
            res.sendStatus(204)
        }
        else {
            res.status(400).send({ errorsMessages: [{ message: "account already activated", field: "email" }] })
        }
    }
    else {
        res.sendStatus(429)
    }
})


// Роуты обращаются напрямую в репозиторий, потому что прослойка исключительно для разработки, чтобы визуализировать логи
authRouter.get('/get-registration-date', async (req: Request, res: Response) => {
    const registrationData = await usersRepository.getRegistrationDate()
    res.send(registrationData)
})

authRouter.get('/get-auth-date', async (req: Request, res: Response) => {
    const authData = await usersRepository.getAuthDate()
    res.send(authData)
})
authRouter.get('/get-confirm-date', async (req: Request, res: Response) => {
    const confrimData = await usersRepository.getConfirmAttemptDate()
    res.send(confrimData)
})
authRouter.get('/get-email-date', async (req: Request, res: Response) => {
    const emailSendData = await usersRepository.getEmailSendDate()
    res.send(emailSendData)
})
authRouter.get('/get-token-date', async (req: Request, res: Response) => {
    const TokenData = await usersRepository.getTokenDate()
    res.send(TokenData)
})