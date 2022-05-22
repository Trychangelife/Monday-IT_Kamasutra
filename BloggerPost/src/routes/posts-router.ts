import { Request, Response, Router } from "express";
import { check, param, validationResult } from "express-validator";
import { postsService } from "../domain/posts-service";
import { postsCollection } from "../repositories/db";
import { postsRepository, PostsType } from "../repositories/posts-repositories";
import { authMiddleware } from "../middlewares/authorization-middlewear";
import { commentInputModel, errorFormatter, inputValidationMiddleware, schemaPosts } from "../middlewares/input-validation-middleware";
import { constructorPagination, ConstructorPaginationType } from "./bloggers-router";
import { authMiddlewareWithJWT, IGetUserAuthInfoRequest } from "../middlewares/auth-middleware";

export const postRouter = Router()



postRouter.delete('/del', async (req: Request, res: Response) => {
    const afterDelete = await postsCollection.deleteMany({})
    res.send(afterDelete)
    })  
postRouter.get('/', async (req: Request, res: Response) => {
    const paginationData = constructorPagination(req.query.PageSize as string, req.query.PageNumber as string)
    const getAllPosts: object = await postsService.allPosts(paginationData.pageSize, paginationData.pageNumber)
    res.status(200).send(getAllPosts)
})
postRouter.get('/:id', async (req: Request, res: Response) => {
    const takePost: object | undefined = await postsService.targetPosts(req.params.id)
    if (takePost !== undefined) {
        res.status(200).send(takePost)
    }
    else {
        res.send(404)
    }
})
postRouter.post('/', authMiddleware, schemaPosts, inputValidationMiddleware, async (req: Request, res: Response) => {

    const giveMePost: string | object | null = await postsService.releasePost(req.body.title, req.body.content, req.body.shortDescription, req.body.bloggerId)
    if (giveMePost == null) {
        res.status(400).json({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 })
    }
    else {
        res.status(201).send(giveMePost)
    }
})
postRouter.put('/:id', authMiddleware, schemaPosts, inputValidationMiddleware, async (req: Request, res: Response) => {
    const afterChanged: object | string = await postsService.changePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)
    if (afterChanged !== "404" && afterChanged !== '400') {
        res.status(204).send(afterChanged)
    }
    else if (afterChanged === "400") {
        res.status(400).json({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 })
    }
    else {
        res.send(404)
    }

})

postRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const deleteObj: boolean = await postsService.deletePost(req.params.id)
    if (deleteObj === true) {
        res.send(204)
    }
    else {
        res.send(404)
    }
})

postRouter.post('/:postId/comments',authMiddlewareWithJWT, commentInputModel, inputValidationMiddleware, async (req: Request , res: Response) => {
    const newComment = await postsService.createCommentForSpecificPost(req.params.postId, req.body.content, req.user!.id, req.user!.login)
    if (newComment){
    res.status(201).send(newComment)}
    else {
        res.status(401).send("Post doesn't exists")
    }

}) 
postRouter.get('/:postId/comments', async (req: Request , res: Response) => {
    const paginationData = constructorPagination(req.query.PageSize as string, req.query.PageNumber as string)
    const newComment = await postsService.takeCommentByIdPost(req.params.postId, paginationData.pageNumber, paginationData.pageSize)
    if (newComment){
    res.status(200).send(newComment)}
    else {
    res.status(404).send("Post doesn't exists")
    }

}) 