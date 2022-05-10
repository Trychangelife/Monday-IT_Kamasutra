import { Request, Response, Router } from "express";
import { bloggerRepository } from "../repositories/bloggers-repositories";
import { authMiddleware } from "../validation/authorization-middlewear";
import { inputValidationMiddleware, schemaPostBlogger } from "../validation/input-validation-middleware";



export const bloggersRouter = Router()

  bloggersRouter.get('/', (req: Request, res: Response) => {
    const full = bloggerRepository.allBloggers()
    res.status(200).send(full)
  })
  bloggersRouter.get('/:id', (req: Request, res: Response) => {
    const findBlogger = bloggerRepository.targetBloggers(+req.params.id)
    if (findBlogger !== undefined) {
      res.status(200).send(findBlogger)
    }
    else {
      res.send(404)
    }
  })
  
  bloggersRouter.post('/',authMiddleware, schemaPostBlogger ,inputValidationMiddleware, (req: Request, res: Response) => {

    const createrPerson = bloggerRepository.createBlogger(req.body.name, req.body.youtubeUrl)
      res.status(201).send(createrPerson)

  })
  
  bloggersRouter.put('/:id',authMiddleware, schemaPostBlogger ,inputValidationMiddleware, (req: Request, res: Response) => {

    const alreadyChanges = bloggerRepository.changeBlogger(+req.params.id, req.body.name, req.body.youtubeUrl)
  
    if (alreadyChanges === 'update') {
      res.status(204).send(alreadyChanges)
      return;
    }
    else if (alreadyChanges === "404") {
      res.send(404)
    }
  })
  
  bloggersRouter.delete('/:id',authMiddleware, (req: Request, res: Response) => {
    const afterDelete = bloggerRepository.deleteBlogger(+req.params.id)
    if (afterDelete === "404") {
      res.send(404)
    }
    else {
      res.send(204)
    }
  })