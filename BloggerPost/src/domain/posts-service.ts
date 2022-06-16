import { bloggerModel, postsModel } from "../repositories/db";
import { postsRepository } from "../repositories/posts-repositories"
import { v4 as uuidv4 } from "uuid"
import { CommentsType } from "../types/CommentsType";
import { PostsType } from "../types/PostsType";

export const postsService = {
    async allPosts(pageSize: number, pageNumber: number,): Promise<object> {
        let skip = 0
        if (pageNumber && pageSize) {
            skip = (pageNumber - 1) * pageSize
        }
        return postsRepository.allPosts(skip, pageSize, pageNumber)
    },

    async targetPosts(postId: string): Promise<object | undefined> {
        return await postsRepository.targetPosts(postId)
    },

    async allPostsSpecificBlogger(bloggerId: string, page?: number, pageSize?: number): Promise<object | undefined> {
        let skip = 0
        if (page && pageSize) {
            skip = (page - 1) * pageSize
        }

        return await postsRepository.allPostsSpecificBlogger(bloggerId, skip, pageSize, page)
    },

    async releasePost(title: string, content: string, shortDescription: string, bloggerId?: string, bloggerIdUrl?: string): Promise<object | string | null> {
        const foundBlogger = await bloggerModel.findOne({ id: bloggerId })
        const foundBloggerW = await bloggerModel.findOne({ id: bloggerIdUrl })
        if (bloggerIdUrl && foundBloggerW !== null) {
            let newPosts: PostsType = {
                id: uuidv4(),
                title: title,
                content: content,
                shortDescription: shortDescription,
                bloggerId: bloggerIdUrl,
                bloggerName: foundBloggerW.name
            }
            return await postsRepository.releasePost(newPosts, bloggerIdUrl)
        }
        else if (foundBlogger !== null && bloggerId) {
            let newPosts: PostsType = {
                id: uuidv4(),
                title: title,
                content: content,
                shortDescription: shortDescription,
                bloggerId: bloggerId,
                bloggerName: foundBlogger.name
            }
            return await postsRepository.releasePost(newPosts, bloggerId, bloggerIdUrl)
        }
        else { return null }
    },

    async changePost(postId: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<string | object> {

        return await postsRepository.changePost(postId, title, shortDescription, content, bloggerId)
    },
    async deletePost(deleteId: string): Promise<boolean> {
        return await postsRepository.deletePost(deleteId)

    },
    async createCommentForSpecificPost(postId: string, content: string, userId: string, userLogin: string): Promise<CommentsType | boolean> {
        const foundPost = await postsModel.findOne({ id: postId })
        if(foundPost) {
        let createdComment: CommentsType = {
            commentId: uuidv4(),
            content: content,
            userId: userId,
            userLogin: userLogin,
            addedAt: (new Date()).toString(),
            postId: postId
        }
        return postsRepository.createCommentForSpecificPost(createdComment)
    }
        if (foundPost == null) {
            return false}
            else {
                return false
            }
    },
    async takeCommentByIdPost (postId: string, page: number, pageSize: number): Promise<object | boolean> {
        let skip = 0
        if (page && pageSize) {
            skip = (page - 1) * pageSize
        }
        return await postsRepository.takeCommentByIdPost(postId, skip, pageSize, page,)
    }
}