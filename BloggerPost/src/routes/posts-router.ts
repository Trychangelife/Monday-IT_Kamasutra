import { Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { posts, postsRepository, PostsType } from "../repositories/posts-repositories";
import { authMiddleware } from "../validation/authorization-middlewear";
import { errorFormatter, inputValidationMiddleware, schemaPosts } from "../validation/input-validation-middleware";

export const postRouter = Router()




postRouter.get('/', async (req: Request, res: Response) => {
    const getAllPosts: PostsType[] = await postsRepository.allPosts()
    res.status(200).send(getAllPosts)
})
postRouter.get('/:id', async (req: Request, res: Response) => {
    const takePost: object | undefined = await postsRepository.targetPosts(+req.params.id)
    // const id = +req.params.id
    // const targetPost = posts.find((b) => {
    //     if (b.id === id) return true;
    //     else return false;
    // })

    if (takePost !== undefined) {
        res.status(200).send(takePost)
    }
    else {
        res.send(404)
    }
})
postRouter.post('/',authMiddleware,schemaPosts, inputValidationMiddleware, async (req: Request, res: Response) => {
    const giveMePost: string | object = await postsRepository.releasePost(req.body.title, req.body.content, req.body.shortDescription, +req.body.bloggerId)
    const errors = validationResult(req.body.bloggerId).formatWith(errorFormatter)
    if (giveMePost === '400') {
        res.status(400).json({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 } )
    }
    else {
     res.status(201).send(giveMePost)}
})
postRouter.put('/:id',authMiddleware,schemaPosts, inputValidationMiddleware, async (req: Request, res: Response) => {
    // Уточнить, как сделать проверку на несуществующий пост, в рамках валидатора (сейчас выдает 404 костылями)
    const findTargetPost = posts.find(b => b.id === +req.params.id)
    if (findTargetPost == undefined) {
        res.send(404)
        return
    }
    const afterChanged: object | string = await postsRepository.changePost(+req.params.id, req.body.title, req.body.shortDescription, req.body.content, +req.body.bloggerId)
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
    const deleteObj: boolean = await postsRepository.deletePost(+req.params.id)
    // const beforeFilter = [...posts].length
    // posts = posts.filter((v) => v.id !== +req.params.id)
    if (deleteObj === true) {
        res.send(404)
    }
    else {
        res.send(204)
    }
})
