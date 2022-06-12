import { Request, Response, Router } from "express";
import { authDataCollection, bloggersCollection, codeConfirmCollection, commentsCollection, emailSendCollection, postsCollection, registrationDataCollection, usersCollection } from "../repositories/db";

export const testingRouter = Router({})


testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await postsCollection.deleteMany({})
    await bloggersCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    await registrationDataCollection.deleteMany({})
    await authDataCollection.deleteMany({})
    await codeConfirmCollection.deleteMany({})
    await emailSendCollection.deleteMany({})
    res.status(204).send()
    }) 


    // Вынеси логику в отдельный сервис