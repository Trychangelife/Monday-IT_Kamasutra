import { NextFunction, Request, Response, Router } from "express";
import { commentsService } from "../domain/comments-service";
import { authMiddlewareWithJWT } from "../middlewares/auth-middleware";
import { authMiddleware } from "../middlewares/authorization-middlewear";
import { commentInputModel, inputValidationMiddleware } from "../middlewares/input-validation-middleware";


export const commentsRouter = Router({}) 



commentsRouter.get('/:id',async (req: Request, res: Response) => {
    const result = await commentsService.getCommentsById(req.params.id)
    if (result !== null) {
    res.status(200).send(result)}
    else {
    res.send(404)
    }
})  

commentsRouter.put('/:commentId', authMiddlewareWithJWT, commentInputModel, inputValidationMiddleware ,async (req: Request, res: Response) => {
    const result = await commentsService.updateCommentByCommentId(req.params.commentId, req.body.content, req.user!.id)
    if (result) {
        res.send(204)
    }
    else if (result == null){
        res.send(404)
    }
    else {
        res.send(403)
    }
}) 
commentsRouter.delete('/:commentId', authMiddlewareWithJWT, commentInputModel, inputValidationMiddleware ,async (req: Request, res: Response) => {
    const resultDelete = await commentsService.deleteCommentByCommentId(req.params.commentId, req.user!.id)
    if (resultDelete) {
        res.send(204)
    }
    else if (resultDelete == null){
        res.send(404)
    }
    else {
        res.send(403)
    }
}) 
