import { Request, Response, Router } from "express";
import { authDataModel, bloggerModel, codeConfirmModel, commentsModel, emailSendModel, postsModel, refreshTokenModel, registrationDataModel, usersModel } from "../repositories/db";

export const testingRouter = Router({})


testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await postsModel.deleteMany({})
    await bloggerModel.deleteMany({})
    await usersModel.deleteMany({})
    await commentsModel.deleteMany({})
    await registrationDataModel.deleteMany({})
    await authDataModel.deleteMany({})
    await codeConfirmModel.deleteMany({})
    await emailSendModel.deleteMany({})
    await refreshTokenModel.deleteMany({})
    res.status(204).send()
    }) 


    // Вынеси логику в отдельный сервис