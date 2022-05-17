import { NextFunction, Request, Response, Router } from "express";
import { bloggerService, BloggersType } from "../domain/bloggers-service";
import { postsService } from "../domain/posts-service";
import { bloggersCollection, db } from "../repositories/db";
import { authMiddleware } from "../validation/authorization-middlewear";
import { inputValidationMiddleware, schemaPostBlogger, schemaPosts } from "../validation/input-validation-middleware";



export const bloggersRouter = Router()
  bloggersRouter.delete('/del', async (req: Request, res: Response) => {
  const afterDelete = await bloggersCollection.deleteMany({})
  res.send(afterDelete)
  })  

export type ConstructorPaginationType = { pageNumber: number, pageSize: number};

function constructorPagination( pageNumber: string | undefined, pageSize: string | undefined): ConstructorPaginationType {
   let result: ConstructorPaginationType = { pageNumber: 1, pageSize: 10}
   if (pageNumber) result.pageNumber = +pageNumber
   if (pageSize) result.pageSize = +pageSize
   return result }


  bloggersRouter.get('/', async (req: Request, res: Response) => {
    const searchNameTerm = typeof req.query.searchNameTerm === 'string'? req.query.searchNameTerm:null
    const page = Number(req.query.pageNumber) || 1
    const pageSize = Number(req.query.pageSize) || 10
    const paginationData = constructorPagination(req.query.pageNumber as string, req.query.pageSize as string) // Доработать с конструктором!
    const full: object = await bloggerService.allBloggers({page, pageSize}, searchNameTerm)
 
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
  bloggersRouter.get('/:bloggerId/posts', async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 0
    const pageSize = Number(req.query.pageSize) || 0
    const findBlogger: object | undefined =  await postsService.allPostsSpecificBlogger(+req.params.bloggerId, page, pageSize)
    if (findBlogger !== undefined) {
      res.status(200).send(findBlogger)
    }
    else {
      res.send(404)
    }
  })
  
  bloggersRouter.post('/', authMiddleware, schemaPostBlogger ,inputValidationMiddleware, async (req: Request, res: Response) => {

    const createrPerson: BloggersType | null = await bloggerService.createBlogger(req.body.name, req.body.youtubeUrl)
      res.status(201).send(createrPerson)

  })

  bloggersRouter.post('/:bloggerId/posts', authMiddleware, schemaPosts ,inputValidationMiddleware, async (req: Request, res: Response) => {
    const blogger = await bloggersCollection.count({ id: +req.params.bloggerId})
    console.log(req.body, req.params)
    if (blogger < 1) {return res.send(404)}

    const createPostForSpecificBlogger: string | object = await postsService.releasePost(req.body.title, req.body.content, req.body.shortDescription, +req.body.bloggerId, +req.params.bloggerId)
      res.status(201).send(createPostForSpecificBlogger)

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