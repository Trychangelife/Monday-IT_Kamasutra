import { Request, Response } from "express";
import { injectable } from "inversify";
import { PostsService } from "../domain/posts-service";
import { postsModel } from "../repositories/db";
import { constructorPagination } from "./bloggers-router";


@injectable()
export class PostController {

    constructor(protected postsService: PostsService) {
    }


    async deleteAllPosts(req: Request, res: Response) {
        const afterDelete = await postsModel.deleteMany({});
        res.send(afterDelete);
    }
    async getAllPosts(req: Request, res: Response) {
        const paginationData = constructorPagination(req.query.PageSize as string, req.query.PageNumber as string);
        const getAllPosts: object = await this.postsService.allPosts(paginationData.pageSize, paginationData.pageNumber);
        res.status(200).send(getAllPosts);
    }
    async getPostByID(req: Request, res: Response) {
        const takePost: object | undefined = await this.postsService.targetPosts(req.params.id);
        if (takePost !== undefined) {
            res.status(200).send(takePost);
        }
        else {
            res.send(404);
        }
    }
    async createPost(req: Request, res: Response) {

        const giveMePost: string | object | null = await this.postsService.releasePost(req.body.title, req.body.content, req.body.shortDescription, req.body.bloggerId);
        if (giveMePost == null) {
            res.status(400).json({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 });
        }
        else {
            res.status(201).send(giveMePost);
        }
    }
    async updatePost(req: Request, res: Response) {
        const afterChanged: object | string = await this.postsService.changePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId);
        if (afterChanged !== "404" && afterChanged !== '400') {
            res.status(204).send(afterChanged);
        }
        else if (afterChanged === "400") {
            res.status(400).json({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 });
        }
        else {
            res.send(404);
        }

    }
    async deletePostById(req: Request, res: Response) {
        const deleteObj: boolean = await this.postsService.deletePost(req.params.id);
        if (deleteObj === true) {
            res.send(204);
        }
        else {
            res.send(404);
        }
    }
    async createCommentForPost(req: Request, res: Response) {
        const newComment = await this.postsService.createCommentForSpecificPost(req.params.postId, req.body.content, req.user!.id, req.user!.accountData.login);
        if (newComment) {
            res.status(201).send(newComment);
        }
        else {
            res.status(404).send("Post doesn't exists");
        }

    }
    async getCommentsByPostId(req: Request, res: Response) {
        const paginationData = constructorPagination(req.query.PageSize as string, req.query.PageNumber as string);
        const newComment = await this.postsService.takeCommentByIdPost(req.params.postId, paginationData.pageNumber, paginationData.pageSize);
        if (newComment) {
            res.status(200).send(newComment);
        }
        else {
            res.status(404).send("Post doesn't exists");
        }

    }
}
