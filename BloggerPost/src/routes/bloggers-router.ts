import { Request, Response, Router } from "express";
import { bloggerRepository, BloggersType } from "../repositories/bloggers-repositories";
import { authMiddleware } from "../validation/authorization-middlewear";
import { inputValidationMiddleware, schemaPostBlogger } from "../validation/input-validation-middleware";



export const bloggersRouter = Router()

  bloggersRouter.get('/', async (req: Request, res: Response) => {
    const full: BloggersType[] = await bloggerRepository.allBloggers()
    res.status(200).send(full)
  })
  bloggersRouter.get('/:id', async (req: Request, res: Response) => {
    const findBlogger: object | undefined =  await bloggerRepository.targetBloggers(+req.params.id)
    if (findBlogger !== undefined) {
      res.status(200).send(findBlogger)
    }
    else {
      res.send(404)
    }
  })
  
  bloggersRouter.post('/',authMiddleware, schemaPostBlogger ,inputValidationMiddleware, async (req: Request, res: Response) => {

    const createrPerson: BloggersType = await bloggerRepository.createBlogger(req.body.name, req.body.youtubeUrl)
      res.status(201).send(createrPerson)

  })
  
  bloggersRouter.put('/:id',authMiddleware, schemaPostBlogger ,inputValidationMiddleware, async (req: Request, res: Response) => {

    const alreadyChanges: string = await bloggerRepository.changeBlogger(+req.params.id, req.body.name, req.body.youtubeUrl)
  
    if (alreadyChanges === 'update') {
      res.status(204).send(alreadyChanges)
      return;
    }
    else if (alreadyChanges === "404") {
      res.send(404)
    }
  })
  
  bloggersRouter.delete('/:id',authMiddleware, async (req: Request, res: Response) => {
    const afterDelete: string = await bloggerRepository.deleteBlogger(+req.params.id)
    if (afterDelete === "404") {
      res.send(404)
    }
    else {
      res.send(204)
    }
  })