import { Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { postsService } from "../domain/posts-service";
import { postsCollection } from "../repositories/db";
import { postsRepository, PostsType } from "../repositories/posts-repositories";
import { authMiddleware } from "../validation/authorization-middlewear";
import { errorFormatter, inputValidationMiddleware, schemaPosts } from "../validation/input-validation-middleware";

export const postRouter = Router()



postRouter.delete('/del', async (req: Request, res: Response) => {
    const afterDelete = await postsCollection.deleteMany({})
    res.send(afterDelete)
    })  
postRouter.get('/', async (req: Request, res: Response) => {
    const getAllPosts: PostsType[] = await postsService.allPosts()
    res.status(200).send(getAllPosts)
})
postRouter.get('/:id', async (req: Request, res: Response) => {
    const takePost: object | undefined = await postsService.targetPosts(+req.params.id)
    if (takePost !== undefined) {
        res.status(200).send(takePost)
    }
    else {
        res.send(404)
    }
})
postRouter.post('/',authMiddleware,schemaPosts, inputValidationMiddleware, async (req: Request, res: Response) => {
    const giveMePost: string | object = await postsService.releasePost(req.body.title, req.body.content, req.body.shortDescription, +req.body.bloggerId)
    const errors = validationResult(req.body.bloggerId).formatWith(errorFormatter)
    if (giveMePost === '400') {
        res.status(400).json({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 } )
    }
    else {
     res.status(201).send(giveMePost)}
})
postRouter.put('/:id',authMiddleware,schemaPosts, inputValidationMiddleware, async (req: Request, res: Response) => {
    const afterChanged: object | string = await postsService.changePost(+req.params.id, req.body.title, req.body.shortDescription, req.body.content, +req.body.bloggerId)
    if (afterChanged !== undefined && afterChanged !== '400') {
    res.status(204).send(afterChanged)  }
    else if (afterChanged === "400") {
        res.status(400).json({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 } )
    }
    else {
        res.send(404)
    }

})

postRouter.delete('/:id',authMiddleware, async (req: Request, res: Response) => {
    const deleteObj: boolean = await postsService.deletePost(+req.params.id)
    if (deleteObj === true) {
        res.send(204)
    }
    else {
        res.send(404)
    }
})
