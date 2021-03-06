import { Router } from "express";
import { authMiddleware } from "../middlewares/authorization-middlewear";
import { commentInputModel, inputValidationMiddleware, schemaPosts } from "../middlewares/input-validation-middleware";
import { authMiddlewareWithJWT } from "../middlewares/auth-middleware";
import { container } from "../composition-root";
import { PostController } from "./PostController";

const postsController = container.resolve(PostController)

export const postRouter = Router({})

postRouter.delete('/del', postsController.deleteAllPosts.bind(postsController))
postRouter.get('/', postsController.getAllPosts.bind(postsController))
postRouter.get('/:id', postsController.getPostByID.bind(postsController))
postRouter.post('/', authMiddleware, schemaPosts, inputValidationMiddleware, postsController.createPost.bind(postsController))
postRouter.put('/:id', authMiddleware, schemaPosts, inputValidationMiddleware, postsController.updatePost.bind(postsController))
postRouter.delete('/:id', authMiddleware, postsController.deletePostById.bind(postsController))
postRouter.post('/:postId/comments',authMiddlewareWithJWT, commentInputModel, inputValidationMiddleware, postsController.createCommentForPost.bind(postsController)) 
postRouter.get('/:postId/comments', postsController.getCommentsByPostId.bind(postsController)) 