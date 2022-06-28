import { Router } from "express";
import { authMiddleware } from "../middlewares/authorization-middlewear";
import { inputValidationMiddleware, schemaPostBlogger, schemaPosts } from "../middlewares/input-validation-middleware";
import { container } from "../composition-root";
import { BloggerController } from "./BloggerController";

const bloggerController = container.resolve(BloggerController)

export const bloggersRouter = Router({})

export type ConstructorPaginationType = { pageNumber: number, pageSize: number };
export function constructorPagination(pageSize: string | undefined, pageNumber: string | undefined): ConstructorPaginationType {
  let result: ConstructorPaginationType = { pageSize: 10, pageNumber: 1 }
  if (pageSize) result.pageSize = +pageSize
  if (pageNumber) result.pageNumber = +pageNumber
  return result
}


bloggersRouter.delete('/del', bloggerController.deleteAllBlogger.bind(bloggerController))
bloggersRouter.get('/', bloggerController.getAllBloggers.bind(bloggerController))
bloggersRouter.get('/:id', bloggerController.getBloggerById.bind(bloggerController))
bloggersRouter.get('/:bloggerId/posts', bloggerController.getPostByBloggerID.bind(bloggerController))
bloggersRouter.post('/', authMiddleware, schemaPostBlogger, inputValidationMiddleware, bloggerController.createBlogger.bind(bloggerController))
bloggersRouter.post('/:bloggerId/posts', authMiddleware, schemaPosts, inputValidationMiddleware, bloggerController.createPostByBloggerId.bind(bloggerController))
bloggersRouter.put('/:id', authMiddleware, schemaPostBlogger, inputValidationMiddleware, bloggerController.updateBlogger.bind(bloggerController))
bloggersRouter.delete('/:id', authMiddleware, inputValidationMiddleware, bloggerController.deleteOneBlogger.bind(bloggerController))
