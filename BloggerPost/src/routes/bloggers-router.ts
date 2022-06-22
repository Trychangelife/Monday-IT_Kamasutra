import { Request, Response, Router } from "express";
import { bloggerService } from "../domain/bloggers-service";
import { postsService } from "../domain/posts-service";
import { bloggerModel } from "../repositories/db";
import { authMiddleware } from "../middlewares/authorization-middlewear";
import { inputValidationMiddleware, schemaPostBlogger, schemaPosts } from "../middlewares/input-validation-middleware";
import { BloggersType } from "../types/Types";

export const bloggersRouter = Router({})
export type ConstructorPaginationType = { pageNumber: number, pageSize: number };

export function constructorPagination(pageSize: string | undefined, pageNumber: string | undefined): ConstructorPaginationType {
  let result: ConstructorPaginationType = { pageSize: 10, pageNumber: 1 }
  if (pageSize) result.pageSize = +pageSize
  if (pageNumber) result.pageNumber = +pageNumber
  return result
}


class BloggerController {
  async deleteAllBlogger(req: Request, res: Response) {
    const afterDelete = await bloggerService.deleteAllBlogger()
    res.send(afterDelete)
  }
  async getAllBloggers(req: Request, res: Response) {
    const searchNameTerm = typeof req.query.SearchNameTerm === 'string' ? req.query.SearchNameTerm : null
    const paginationData = constructorPagination(req.query.PageSize as string, req.query.PageNumber as string)
    const full: object = await bloggerService.allBloggers(paginationData.pageSize, paginationData.pageNumber, searchNameTerm)

    res.status(200).send(full)
  }
  async getBloggerById(req: Request, res: Response) {
    const findBlogger: object | undefined = await bloggerService.targetBloggers(req.params.id)
    if (findBlogger !== undefined) {
      res.status(200).send(findBlogger)
    }
    else {
      res.send(404)
    }
  }
  async getPostByBloggerID(req: Request, res: Response) {
    console.log(req.body, req.params, req.query)
    const paginationData = constructorPagination(req.query.PageSize as string, req.query.PageNumber as string)
    const findBlogger: object | undefined = await postsService.allPostsSpecificBlogger(req.params.bloggerId, paginationData.pageNumber, paginationData.pageSize)
    if (findBlogger !== undefined) {
      res.status(200).send(findBlogger)
    }
    else {
      res.send(404)
    }
  }
  async createBlogger(req: Request, res: Response) {

    const createrPerson: BloggersType | null = await bloggerService.createBlogger(req.body.name, req.body.youtubeUrl)
    res.status(201).send(createrPerson)

  }
  async createPostByBloggerId(req: Request, res: Response) {
    const blogger = await bloggerModel.count({ id: req.params.bloggerId })
    if (blogger < 1) { return res.send(404) }

    const createPostForSpecificBlogger: string | object | null = await postsService.releasePost(req.body.title, req.body.content, req.body.shortDescription, req.body.bloggerId, req.params.bloggerId)
    res.status(201).send(createPostForSpecificBlogger)

  }
  async updateBlogger(req: Request, res: Response) {
    const alreadyChanges: string = await bloggerService.changeBlogger(req.params.id, req.body.name, req.body.youtubeUrl)
    if (alreadyChanges === 'update') {
      res.status(204).send(alreadyChanges)
      return;
    }
    else if (alreadyChanges === "404") {
      res.send(404)
    }
  }
  async deleteOneBlogger(req: Request, res: Response) {
    const afterDelete = await bloggerService.deleteBlogger(req.params.id)
    res.send(afterDelete)
  }
}

const bloggerController = new BloggerController()

bloggersRouter.delete('/del', bloggerController.deleteAllBlogger)
bloggersRouter.get('/', bloggerController.getAllBloggers)
bloggersRouter.get('/:id', bloggerController.getBloggerById)
bloggersRouter.get('/:bloggerId/posts', bloggerController.getPostByBloggerID)
bloggersRouter.post('/', authMiddleware, schemaPostBlogger, inputValidationMiddleware, bloggerController.createBlogger)
bloggersRouter.post('/:bloggerId/posts', authMiddleware, schemaPosts, inputValidationMiddleware, bloggerController.createPostByBloggerId)
bloggersRouter.put('/:id', authMiddleware, schemaPostBlogger, inputValidationMiddleware, bloggerController.updateBlogger)
bloggersRouter.delete('/:id', authMiddleware, inputValidationMiddleware, bloggerController.deleteOneBlogger)
