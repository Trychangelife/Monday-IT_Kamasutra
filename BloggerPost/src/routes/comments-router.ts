import { NextFunction, Request, Response, Router } from "express";
import { commentsService } from "../domain/comments-service";
import { authMiddleware } from "../middlewares/authorization-middlewear";


export const commentsRouter = Router() 



commentsRouter.get('/:id', authMiddleware,async (req: Request, res: Response) => {
    const result = await commentsService.getCommentsById(req.params.id)

    res.send(result)
})  