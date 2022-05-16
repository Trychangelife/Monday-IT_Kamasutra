import { NextFunction, Request, Response, Router } from "express";
import { bloggerService, BloggersType } from "../domain/bloggers-service";
import { bloggersCollection, db } from "../repositories/db";
import { authMiddleware } from "../validation/authorization-middlewear";
import { inputValidationMiddleware, schemaPostBlogger } from "../validation/input-validation-middleware";



export const bloggersRouter = Router()
  bloggersRouter.delete('/del', async (req: Request, res: Response) => {
  const afterDelete = await bloggersCollection.deleteMany({})
  res.send(afterDelete)
  })  

  bloggersRouter.get('/', async (req: Request, res: Response) => {
    // const searhNameTerm = req.query.searhNameTerm as string
    // let allBloggers = await bloggersCollection.find({name: {$regex: searhNameTerm}}).toArray()
    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 5
    // const pageCount = Math.ceil(allBloggers.length / pageSize)
    
    // if (searhNameTerm) {
    //   allBloggers = await 
    //   bloggersCollection.find({name: {$regex: searhNameTerm}}).toArray()
    // }
    // else {
    //   allBloggers = await bloggersCollection.find({}).toArray()
    // }
    const full: BloggersType[] = await bloggerService.allBloggers({page, pageSize})
 
    res.status(200).send(full)
  })
  bloggersRouter.get('/:id', async (req: Request, res: Response) => {
    const findBlogger: object | undefined =  await bloggerService.targetBloggers(+req.params.id)
    if (findBlogger !== undefined) {
      res.status(200).send(findBlogger)
    }
    else {
      res.send(404)
    }
  })
  
  bloggersRouter.post('/', authMiddleware, schemaPostBlogger ,inputValidationMiddleware, async (req: Request, res: Response) => {

    const createrPerson: BloggersType = await bloggerService.createBlogger(req.body.name, req.body.youtubeUrl)
      res.status(201).send(createrPerson)

  })
  
  bloggersRouter.put('/:id',authMiddleware, schemaPostBlogger ,inputValidationMiddleware, async (req: Request, res: Response) => {

    const alreadyChanges: string = await bloggerService.changeBlogger(+req.params.id, req.body.name, req.body.youtubeUrl)
  
    if (alreadyChanges === 'update') {
      res.status(204).send(alreadyChanges)
      return;
    }
    else if (alreadyChanges === "404") {
      res.send(404)
    }
  })
  


  bloggersRouter.delete('/:id',authMiddleware, async (req: Request, res: Response) => {
    const afterDelete: string = await bloggerService.deleteBlogger(+req.params.id)
    if (afterDelete === "404") {
      res.send(404)
    }
    else {
      res.send(204)
    }
  })


  // function paginatedResults(model:any) {
  //   return async (req:Request, res:Response, next:NextFunction) => {
  //     const page:any = parseInt(req.query.page)
  //     const limit:any = parseInt(req.query.limit)
  
  //     const startIndex = (page - 1) * limit
  //     const endIndex = page * limit
  
  //     const results = {}
  
  //     if (endIndex < await model.countDocuments().exec()) {
  //       results.next = {
  //         page: page + 1,
  //         limit: limit
  //       }
  //     }
      
  //     if (startIndex > 0) {
  //       results.previous = {
  //         page: page - 1,
  //         limit: limit
  //       }
  //     }
  //     try {
  //       results.results = await model.find().limit(limit).skip(startIndex).exec()
  //       res.paginatedResults = results
  //       next()
  //     } catch (e) {
  //       res.status(500).json({ message: e.message })
  //     }
  //   }
  // }