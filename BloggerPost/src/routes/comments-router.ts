import { Router } from "express";
import { container } from "../composition-root";
import { authMiddlewareWithJWT } from "../middlewares/auth-middleware";
import { checkLaw, commentInputModel, inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { CommentsController } from "./CommentsController";

const commentsController = container.resolve(CommentsController)
export const commentsRouter = Router({}) 

commentsRouter.get('/:id', commentsController.getCommentById.bind(commentsController))  
commentsRouter.put('/:commentId', authMiddlewareWithJWT, checkLaw, commentInputModel, inputValidationMiddleware, commentsController.updateCommentByCommentId.bind(commentsController)) 
commentsRouter.delete('/:commentId', authMiddlewareWithJWT, commentsController.deleteCommentById.bind(commentsController)) 
