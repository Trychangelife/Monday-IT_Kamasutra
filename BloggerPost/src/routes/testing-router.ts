import { Request, Response, Router } from "express";
import { authDataCollection, bloggerModel, codeConfirmCollection, commentsModel, emailSendCollection, postsModel, refreshTokenCollection, registrationDataCollection, usersCollection } from "../repositories/db";

export const testingRouter = Router({})


testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await postsModel.deleteMany({})
    await bloggerModel.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsModel.deleteMany({})
    await registrationDataCollection.deleteMany({})
    await authDataCollection.deleteMany({})
    await codeConfirmCollection.deleteMany({})
    await emailSendCollection.deleteMany({})
    await refreshTokenCollection.deleteMany({})
    res.status(204).send()
    }) 


    // Вынеси логику в отдельный сервис