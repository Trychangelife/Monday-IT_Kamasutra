import { Router } from "express";
import { container } from "../composition-root";
import { authMiddlewareWithJWT } from "../middlewares/auth-middleware";
import { checkAvailabilityEmail, checkUniqueData, inputValidationMiddleware, LoginInputModel, userInputModel } from "../middlewares/input-validation-middleware";
import { AuthController } from "./AuthController";


const authController = container.resolve(AuthController)
export const authRouter = Router({})

authRouter.post('/login', LoginInputModel, inputValidationMiddleware, authController.authorization.bind(authController))
authRouter.post('/refresh-token', authController.updateAccessToken.bind(authController))
authRouter.post('/registration', checkUniqueData, userInputModel, inputValidationMiddleware, authController.registration.bind(authController))
authRouter.post('/registration-confirmation', authController.registrationConfirmation.bind(authController))
authRouter.post('/registration-email-resending', userInputModel[2], checkAvailabilityEmail, inputValidationMiddleware, authController.registrationEmailResending.bind(authController))
authRouter.post('/logout', authController.logout.bind(authController))
authRouter.get('/me', authMiddlewareWithJWT, authController.aboutMe.bind(authController))

// Роуты обращаются напрямую в репозиторий, потому что прослойка исключительно для разработки, чтобы визуализировать логи
authRouter.get('/get-registration-date', authController.getRegistrationDate.bind(authController))
authRouter.get('/get-auth-date', authController.getAuthDate.bind(authController))
authRouter.get('/get-confirm-date', authController.getConfirmDate.bind(authController))
authRouter.get('/get-email-date', authController.getEmailDate.bind(authController))
authRouter.get('/get-token-date', authController.getTokenDate.bind(authController))