import { NextFunction, Request, Response, Router } from "express";
import { CommentsService } from "../domain/comments-service";
import { authMiddlewareWithJWT } from "../middlewares/auth-middleware";
import { checkLaw, commentInputModel, inputValidationMiddleware } from "../middlewares/input-validation-middleware";


export const commentsRouter = Router({}) 



class CommentsController {

    constructor (private commentsService = new CommentsService()) {

    }

    async getCommentById (req: Request, res: Response) {
        const result = await this.commentsService.getCommentsById(req.params.id)
        if (result !== null) {
        res.status(200).send(result)}
        else {
        res.send(404)
        }
    }
    async updateCommentByCommentId (req: Request, res: Response) {
        const result = await this.commentsService.updateCommentByCommentId(req.params.commentId, req.body.content, req.user!.id)
        if (result) {
            res.send(204)
        }
        else if (result == null){
            res.send(404)
        }
        else {
            res.send(403)
        }
    }
    async deleteCommentById(req: Request, res: Response) {
        const resultDelete = await this.commentsService.deleteCommentByCommentId(req.params.commentId, req.user!.id)
        if (resultDelete) {
            res.send(204)
        }
        else if (resultDelete == null){
            res.send(404)
        }
        else {
            res.send(403)
        }
    }
}

const commentsController = new CommentsController()

commentsRouter.get('/:id', commentsController.getCommentById.bind(commentsController))  
commentsRouter.put('/:commentId', authMiddlewareWithJWT, checkLaw, commentInputModel, inputValidationMiddleware, commentsController.updateCommentByCommentId.bind(commentsController)) 
commentsRouter.delete('/:commentId', authMiddlewareWithJWT, commentsController.deleteCommentById.bind(commentsController)) 
