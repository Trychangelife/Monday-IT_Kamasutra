import { Request, Response } from "express";
import { BloggerService } from "../domain/bloggers-service";
import { bloggerModel } from "../repositories/db";
import { BloggersType } from "../types/Types";
import { PostsService } from "../domain/posts-service";
import { constructorPagination } from "./bloggers-router";



export class BloggerController {
  constructor(protected bloggerService: BloggerService, protected postsService: PostsService) {
  }

  async deleteAllBlogger(req: Request, res: Response) {
    const afterDelete = await this.bloggerService.deleteAllBlogger();
    res.send(afterDelete);
  }
  async getAllBloggers(req: Request, res: Response) {
    const searchNameTerm = typeof req.query.SearchNameTerm === 'string' ? req.query.SearchNameTerm : null;
    const paginationData = constructorPagination(req.query.PageSize as string, req.query.PageNumber as string);
    const full: object = await this.bloggerService.allBloggers(paginationData.pageSize, paginationData.pageNumber, searchNameTerm);

    res.status(200).send(full);
  }
  async getBloggerById(req: Request, res: Response) {
    const findBlogger: object | undefined = await this.bloggerService.targetBloggers(req.params.id);
    if (findBlogger !== undefined) {
      res.status(200).send(findBlogger);
    }
    else {
      res.send(404);
    }
  }
  async getPostByBloggerID(req: Request, res: Response) {
    const paginationData = constructorPagination(req.query.PageSize as string, req.query.PageNumber as string);
    const findBlogger: object | undefined = await this.postsService.allPostsSpecificBlogger(req.params.bloggerId, paginationData.pageNumber, paginationData.pageSize);
    if (findBlogger !== undefined) {
      res.status(200).send(findBlogger);
    }
    else {
      res.send(404);
    }
  }
  async createBlogger(req: Request, res: Response) {

    const createrPerson: BloggersType | null = await this.bloggerService.createBlogger(req.body.name, req.body.youtubeUrl);
    res.status(201).send(createrPerson);

  }
  async createPostByBloggerId(req: Request, res: Response) {
    const blogger = await bloggerModel.count({ id: req.params.bloggerId });
    if (blogger < 1) { return res.send(404); }

    const createPostForSpecificBlogger: string | object | null = await this.postsService.releasePost(req.body.title, req.body.content, req.body.shortDescription, req.body.bloggerId, req.params.bloggerId);
    res.status(201).send(createPostForSpecificBlogger);

  }
  async updateBlogger(req: Request, res: Response) {
    const alreadyChanges: string = await this.bloggerService.changeBlogger(req.params.id, req.body.name, req.body.youtubeUrl);
    if (alreadyChanges === 'update') {
      res.status(204).send(alreadyChanges);
      return;
    }
    else if (alreadyChanges === "404") {
      res.send(404);
    }
  }
  async deleteOneBlogger(req: Request, res: Response) {
    const afterDelete = await this.bloggerService.deleteBlogger(req.params.id);
    res.send(afterDelete);
  }
}
