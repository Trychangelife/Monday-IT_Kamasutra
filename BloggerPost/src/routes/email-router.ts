import { Request, Response, Router } from "express";
import { emailAdapter } from "../adapters/email-adapter";

export const emailRouter = Router({})

// emailRouter.post('/send', async (req: Request, res: Response) => {
//     const sendler = await emailService.emailConfirmation(req.body.email,req.body.message, req.body.subject)
//     if (sendler !== false) {
//     res.send(sendler)}
//     else {
//         res.status(400).send("user not found, you have entered the wrong email ")
//     }
// })