import { CommentsType } from "../types/Types";
import { bloggerModel, commentsModel, postsModel } from "./db";
import { PostsType } from "../types/Types";


export const postViewModel = {
        _id: 0,
        id: 1,
        title: 1,
        shortDescription: 1,
        content: 1,
        bloggerId: 1,
        bloggerName: 1
}

export const commentsVievModel = {
        _id: 0,
        postId: 0,
        __v: 0
}

export class PostRepository {
    async allPosts(skip: number, limit: number, page?: number): Promise<object> {
        const totalCount = await postsModel.count({})
        const pagesCount = Math.ceil(totalCount / limit)
        const cursor = await postsModel.find({}, postViewModel).skip(skip).limit(limit)
        return { pagesCount: pagesCount, page: page, pageSize: limit, totalCount: totalCount, items: cursor }
    }
    async targetPosts(postId: string): Promise<object | undefined> {
        const targetPost: PostsType | null = await postsModel.findOne({ id: postId }, postViewModel)
        if (targetPost == null) {
            return undefined
        }
        else {
            return targetPost; 
        }
    }
    async allPostsSpecificBlogger(bloggerId: string, skip: number, pageSize?: number, page?: number): Promise<object | undefined> {


        const totalCount = await postsModel.count({ bloggerId: bloggerId })
        const checkBloggerExist = await bloggerModel.count({ id: bloggerId })
        if (checkBloggerExist < 1) { return undefined }
        if (page !== undefined && pageSize !== undefined) {
            const postsBloggerWithPaginator = await postsModel.find({ bloggerId: bloggerId }, postViewModel).skip(skip).limit(pageSize)
            const pagesCount = Math.ceil(totalCount / pageSize)
            if (page > 0 || pageSize > 0) {
                return { pagesCount, page: page, pageSize: pageSize, totalCount, items: postsBloggerWithPaginator }
            }
            else {
                const postsBloggerWithOutPaginator = await postsModel.find({ bloggerId: bloggerId })
                return { pagesCount: 0, page: page, pageSize: pageSize, totalCount, items: postsBloggerWithOutPaginator }
            }

        }
    }
    async releasePost(newPosts: PostsType, bloggerId: string, bloggerIdUrl?: string): Promise<object | string> {
        const findBlogger = await bloggerModel.count({ id: bloggerId })
        if (findBlogger < 1) { return "400" }
        await postsModel.create(newPosts)
        const result: PostsType | null = await postsModel.findOne({ id: newPosts.id }, postViewModel)
        if (result !== null) { return result }
        else { return "400" }
    }
    async changePost(postId: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<string | object> {

        const foundPost = await postsModel.findOne({ id: postId }, postViewModel)
        const foundBlogger = await bloggerModel.findOne({ id: bloggerId })
        if (foundPost !== null && foundBlogger !== null) {
            await postsModel.updateOne({ id: postId }, { $set: { title: title, shortDescription: shortDescription, content: content, } })
            return foundPost
        }
        else if (foundBlogger == null) {
            return '400'
        }
        else {
            return "404"
        }
    }
    async deletePost(deleteId: string): Promise<boolean> {
        const result = await postsModel.deleteOne({ id: deleteId })
        return result.deletedCount === 1
    }
    async createCommentForSpecificPost(createdComment: CommentsType): Promise<CommentsType | boolean> {

        await commentsModel.create(createdComment)
        const foundNewPost = await commentsModel.findOne({commentId: createdComment.commentId}, commentsVievModel)
        if (foundNewPost !== null) {
        return foundNewPost}
        else {return false}
    }
    async takeCommentByIdPost (postId: string, skip: number, limit: number, page: number): Promise<object | boolean> {
        const findPosts = await postsModel.findOne({id: postId})
        const totalCount = await commentsModel.count({postId: postId})
        const pagesCount = Math.ceil(totalCount / limit)
        if (findPosts !== null) {
        const findComments = await commentsModel.find({postId: postId}, commentsVievModel).skip(skip).limit(limit)
        return { pagesCount: pagesCount, page: page, pageSize: limit, totalCount: totalCount, items: findComments }}
        else { return false}
    }
}

export const postsRepository = new PostRepository()
