
import { CommentsType } from "../types/CommentsType";
import { bloggersCollection, commentsCollection, postsCollection } from "./db";
import { PostsType } from "../types/PostsType";


export const postViewModel = {
    projection: {
        _id: 0,
        id: 1,
        title: 1,
        shortDescription: 1,
        content: 1,
        bloggerId: 1,
        bloggerName: 1
    }
}

export const commentsVievModel = {
    projection: {
        _id: 0,
        postId: 0
    }
}

export const postsRepository = {
    async allPosts(skip: number, limit: number, page?: number): Promise<object> {
        const totalCount = await postsCollection.count({})
        const pagesCount = Math.ceil(totalCount / limit)
        const cursor = await postsCollection.find({}, postViewModel).skip(skip).limit(limit).toArray()
        return { pagesCount: pagesCount, page: page, pageSize: limit, totalCount: totalCount, items: cursor }
    },
 
    async targetPosts(postId: string): Promise<object | undefined> {
        const targetPost: PostsType | null = await postsCollection.findOne({ id: postId }, postViewModel)
        if (targetPost == null) {
            return undefined
        }
        else {
            return targetPost;
        }
    },
    async allPostsSpecificBlogger(bloggerId: string, skip: number, pageSize?: number, page?: number): Promise<object | undefined> {


        const totalCount = await postsCollection.count({ bloggerId: bloggerId })
        const checkBloggerExist = await bloggersCollection.count({ id: bloggerId })
        if (checkBloggerExist < 1) { return undefined }
        if (page !== undefined && pageSize !== undefined) {
            const postsBloggerWithPaginator = await postsCollection.find({ bloggerId: bloggerId }, postViewModel).skip(skip).limit(pageSize).toArray()
            const pagesCount = Math.ceil(totalCount / pageSize)
            if (page > 0 || pageSize > 0) {
                return { pagesCount, page: page, pageSize: pageSize, totalCount, items: postsBloggerWithPaginator }
            }
            else {
                // Вникай в условие, нужно добить этот алгоритм
                const postsBloggerWithOutPaginator = await postsCollection.find({ bloggerId: bloggerId }).toArray()
                return { pagesCount: 0, page: page, pageSize: pageSize, totalCount, items: postsBloggerWithOutPaginator }
            }

        }
    },


    async releasePost(newPosts: PostsType, bloggerId: string, bloggerIdUrl?: string): Promise<object | string> {
        const findBlogger = await bloggersCollection.count({ id: bloggerId })
        if (findBlogger < 1) { return "400" }
        await postsCollection.insertOne(newPosts)
        const result: PostsType | null = await postsCollection.findOne({ id: newPosts.id }, postViewModel)
        if (result !== null) { return result }
        else { return "400" }
    },

    async changePost(postId: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<string | object> {

        const foundPost = await postsCollection.findOne({ id: postId }, postViewModel)
        const foundBlogger = await bloggersCollection.findOne({ id: bloggerId })
        if (foundPost !== null && foundBlogger !== null) {
            await postsCollection.updateOne({ id: postId }, { $set: { title: title, shortDescription: shortDescription, content: content, } })
            return foundPost
        }
        else if (foundBlogger == null) {
            return '400'
        }
        else {
            return "404"
        }
    },
    async deletePost(deleteId: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({ id: deleteId })
        return result.deletedCount === 1
    },
    async createCommentForSpecificPost(createdComment: CommentsType): Promise<CommentsType | boolean> {

        await commentsCollection.insertOne(createdComment)
        const foundNewPost = await commentsCollection.findOne({id: createdComment.id}, commentsVievModel)
        if (foundNewPost !== null) {
        return foundNewPost}
        else {return false}
    },
    async takeCommentByIdPost (postId: string, skip: number, limit: number, page: number): Promise<object | boolean> {
        const findPosts = await postsCollection.findOne({id: postId})
        const totalCount = await commentsCollection.count({postId: postId})
        const pagesCount = Math.ceil(totalCount / limit)
        if (findPosts !== null) {
        const findComments = await commentsCollection.find({postId: postId}, commentsVievModel).skip(skip).limit(limit).toArray()
        return { pagesCount: pagesCount, page: page, pageSize: limit, totalCount: totalCount, items: findComments }}
        else { return false}
    }
}

// const totalCount = await postsCollection.count({})
//         const pagesCount = Math.ceil(totalCount / limit)
//         const cursor = await postsCollection.find({}, postViewModel).skip(skip).limit(limit).toArray()
//         return { pagesCount: pagesCount, page: page, pageSize: limit, totalCount: totalCount, items: cursor }