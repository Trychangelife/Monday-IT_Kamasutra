import { Request, Response, Router } from "express";
import { bloggers } from "../repositories/bloggers-repositories";
import { postsRepository } from "../repositories/posts-repositories";
import { inputValidationMiddleware, schemaPosts } from "../validation/input-validation-middleware";

export const postRouter = Router()




postRouter.get('/', (req: Request, res: Response) => {
    const getAllPosts = postsRepository.allPosts()
    res.status(200).send(getAllPosts)
})
postRouter.get('/:id', (req: Request, res: Response) => {
    const takePost = postsRepository.targetPosts(+req.params.id)
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
postRouter.post('/', schemaPosts, inputValidationMiddleware, (req: Request, res: Response) => {

    const giveMePost = postsRepository.releasePost(req.body.title, req.body.content, req.body.shortDescription, +req.body.bloggerId)

    if (giveMePost !== undefined) {
    res.status(201).send(giveMePost)}
    else {
        res.status(400)
    }
})
postRouter.put('/:id', schemaPosts, inputValidationMiddleware, (req: Request, res: Response) => {
    console.log(req.params, req.body)
    const afterChanged = postsRepository.changePost(+req.params.id, req.body.title, req.body.shortDescription, req.body.content, +req.body.bloggerId)
    if (afterChanged !== undefined) {
    res.status(204).send(afterChanged)  }
    else {
        res.send(404)
    }

})

postRouter.delete('/:id', (req: Request, res: Response) => {
    const deleteObj = postsRepository.deletePost(+req.params.id)
    // const beforeFilter = [...posts].length
    // posts = posts.filter((v) => v.id !== +req.params.id)
    if (deleteObj === true) {
        res.send(404)
    }
    else {
        res.send(204)
    }
})
