import { Request, Response, Router } from "express";
import { jwtService } from "../application/jwt-service";
import { AuthService } from "../domain/auth-service";
import { EmailService } from "../domain/email-service";
import { UsersService } from "../domain/users-service";
import { checkAvailabilityEmail, checkUniqueData, inputValidationMiddleware, LoginInputModel, userInputModel } from "../middlewares/input-validation-middleware";
import { UsersRepository } from "../repositories/users-repository";
import { UsersType } from "../types/Types";


export const authRouter = Router({})

export class AuthController {

    constructor (public usersRepository = new UsersRepository(), private usersService = new UsersService(), private authService = new AuthService(), public emailService = new EmailService()) {
    }
    async authrozation (req: Request, res: Response) {
        await this.authService.informationAboutAuth(req.ip, req.body.login)
        const checkIP = await this.authService.counterAttemptAuth(req.ip, req.body.login)
        if (checkIP) {
            const user = await this.usersService.checkCredentials(req.body.login, req.body.password)
            const foundUser = await this.usersRepository.findUserByLogin(req.body.login)
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
    }
    async updateAccessToken (req: Request, res: Response) {
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
    }
    async registration (req: Request, res: Response) {
        const result: UsersType | null | boolean = await this.usersService.createUser(req.body.login, req.body.password, req.body.email, req.ip)
        if (result == false) {
            res.status(400).send("Oops something wrong")
        }
        else if (result == null) {
            res.sendStatus(429)
        }
        else {
            res.status(204).send()
        }
    }
    async registrationConfirmation (req: Request, res: Response) {
        await this.authService.informationAboutConfirmed(req.ip, req.body.code)
        const checkInputCode = await this.authService.counterAttemptConfirm(req.ip, req.body.code)
        if (checkInputCode) {
            const activationResult = await this.usersService.confirmationEmail(req.body.code)
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
    }
    async registrationEmailResending (req: Request, res: Response) {
        await this.authService.informationAboutEmailSend(req.ip, req.body.email)
        const checkAttemptEmail = await this.authService.counterAttemptEmail(req.ip, req.body.email)
        if (checkAttemptEmail) {
            await this.authService.refreshActivationCode(req.body.email)
            const emailResending = await this.emailService.emailConfirmation(req.body.email)
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
    }
    async getRegistrationDate (req: Request, res: Response) {
        const registrationData = await this.usersRepository.getRegistrationDate()
        res.send(registrationData)
    }
    async getAuthDate (req: Request, res: Response) {
        const authData = await this.usersRepository.getAuthDate()
        res.send(authData)
    }
    async getConfirmDate (req: Request, res: Response) {
        const confrimData = await this.usersRepository.getConfirmAttemptDate()
        res.send(confrimData)
    }
    async getEmailDate (req: Request, res: Response) {
        const emailSendData = await this.usersRepository.getEmailSendDate()
        res.send(emailSendData)
    }
    async getTokenDate (req: Request, res: Response) {
        const TokenData = await this.usersRepository.getTokenDate()
        res.send(TokenData)
    }
}

const authController = new AuthController()

authRouter.post('/login', LoginInputModel, inputValidationMiddleware, authController.authrozation.bind(authController))
authRouter.post('/update-access-token', LoginInputModel, inputValidationMiddleware, authController.updateAccessToken.bind(authController))
authRouter.post('/registration', checkUniqueData, userInputModel, inputValidationMiddleware, authController.registration.bind(authController))
authRouter.post('/registration-confirmation', authController.registrationConfirmation.bind(authController))
authRouter.post('/registration-email-resending', userInputModel[2], checkAvailabilityEmail, inputValidationMiddleware, authController.registrationEmailResending.bind(authController))

// Роуты обращаются напрямую в репозиторий, потому что прослойка исключительно для разработки, чтобы визуализировать логи
authRouter.get('/get-registration-date', authController.getRegistrationDate.bind(authController))
authRouter.get('/get-auth-date', authController.getAuthDate.bind(authController))
authRouter.get('/get-confirm-date', authController.getConfirmDate.bind(authController))
authRouter.get('/get-email-date', authController.getEmailDate.bind(authController))
authRouter.get('/get-token-date', authController.getTokenDate.bind(authController))