import { Router } from "express";
import { authController } from "../composition-root";
import { checkAvailabilityEmail, checkUniqueData, inputValidationMiddleware, LoginInputModel, userInputModel } from "../middlewares/input-validation-middleware";


export const authRouter = Router({})

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