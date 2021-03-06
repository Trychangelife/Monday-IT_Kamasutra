import { bloggerModel, postsModel } from "../repositories/db";
import { PostRepository } from "../repositories/posts-repositories"
import { v4 as uuidv4 } from "uuid"
import { Comments, CommentsType, Post } from "../types/Types";
import { injectable } from "inversify";

@injectable()
export class PostsService {

    constructor (protected postsRepository: PostRepository) {}

    async allPosts(pageSize: number, pageNumber: number,): Promise<object> {
        let skip = 0
        if (pageNumber && pageSize) {
            skip = (pageNumber - 1) * pageSize
        }
        return this.postsRepository.allPosts(skip, pageSize, pageNumber)
    }
    async targetPosts(postId: string): Promise<object | undefined> {
        return await this.postsRepository.targetPosts(postId)
    }
    async allPostsSpecificBlogger(bloggerId: string, page?: number, pageSize?: number): Promise<object | undefined> {
        let skip = 0
        if (page && pageSize) {
            skip = (page - 1) * pageSize
        }

        return await this.postsRepository.allPostsSpecificBlogger(bloggerId, skip, pageSize, page)
    }
    async releasePost(title: string, content: string, shortDescription: string, bloggerId?: string, bloggerIdUrl?: string): Promise<object | string | null> {
        const foundBlogger = await bloggerModel.findOne({ id: bloggerId })
        const foundBloggerW = await bloggerModel.findOne({ id: bloggerIdUrl })
        if (bloggerIdUrl && foundBloggerW !== null) {
            // Построено на классе
            const newPost = new Post(uuidv4(), title, content, shortDescription, bloggerIdUrl, foundBloggerW.name)
            return await this.postsRepository.releasePost(newPost, bloggerIdUrl)
        }
        else if (foundBlogger !== null && bloggerId) {
            // Построено на классе
            const newPost = new Post(uuidv4(), title, content, shortDescription, bloggerId, foundBlogger.name)
            return await this.postsRepository.releasePost(newPost, bloggerId, bloggerIdUrl)
        }
        else { return null }
    }
    async changePost(postId: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<string | object> {

        return await this.postsRepository.changePost(postId, title, shortDescription, content, bloggerId)
    }
    async deletePost(deleteId: string): Promise<boolean> {
        return await this.postsRepository.deletePost(deleteId)

    }
    async createCommentForSpecificPost(postId: string, content: string, userId: string, userLogin: string): Promise<CommentsType | boolean> {
        const foundPost = await postsModel.findOne({ id: postId })
        if(foundPost) {
        // Построено на классе
        const createdComment = new Comments(uuidv4(), content, userId, userLogin, (new Date()).toString(), postId)
        return this.postsRepository.createCommentForSpecificPost(createdComment)
    }
        if (foundPost == null) {
            return false}
            else {
                return false
            }
    }
    async takeCommentByIdPost (postId: string, page: number, pageSize: number): Promise<object | boolean> {
        let skip = 0
        if (page && pageSize) {
            skip = (page - 1) * pageSize
        }
        return await this.postsRepository.takeCommentByIdPost(postId, skip, pageSize, page,)
    }
}

// export const postsService = new PostsService()