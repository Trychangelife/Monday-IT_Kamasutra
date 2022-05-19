import { bloggersCollection, postsCollection } from "./db";


export type PostsType = {
    id: number,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: number,
    bloggerName: string
}

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

export const postsRepository = {
    async allPosts(skip: number, limit: number, page?:number): Promise<object> {
        const totalCount = await postsCollection.count({})
        const pagesCount = Math.ceil(totalCount / limit)
        const cursor =  await postsCollection.find({}, postViewModel).skip(skip).limit(limit).toArray()
        return {pagesCount: pagesCount, page: page, pageSize: limit, totalCount: totalCount, items: cursor}
    },

    async targetPosts(postId: number): Promise<object | undefined>{
        const targetPost: PostsType | null = await postsCollection.findOne({id: postId}, postViewModel)
        if (targetPost == null) {
            return undefined
        }
        else {
        return targetPost;}
    },
    async allPostsSpecificBlogger(bloggerId: number, skip:number, pageSize?:number, page?:number): Promise<object | undefined >{
        
        
        const totalCount = await postsCollection.count({bloggerId: bloggerId})
        const checkBloggerExist = await bloggersCollection.count({id: bloggerId})
        if (checkBloggerExist <  1) {return undefined}
        if (page !== undefined && pageSize !== undefined) {
            const postsBloggerWithPaginator = await postsCollection.find({bloggerId: bloggerId}, postViewModel).skip(skip).limit(pageSize).toArray()
            const pagesCount = Math.ceil(totalCount / pageSize)
            if(page > 0 || pageSize > 0) {
                return {pagesCount, page: page, pageSize: pageSize, totalCount, items: postsBloggerWithPaginator}
            }
            else {
            // Вникай в условие, нужно добить этот алгоритм
            const postsBloggerWithOutPaginator = await postsCollection.find({bloggerId: bloggerId}).toArray()
            return {pagesCount: 0, page: page, pageSize: pageSize, totalCount, items: postsBloggerWithOutPaginator}
            }   

        }
    },


    async releasePost(newPosts: PostsType, bloggerId: number): Promise<object | string> {
        const findBlogger = await bloggersCollection.findOne({id: bloggerId}, postViewModel)
        if (findBlogger == null) {return "400"}
        await postsCollection.insertOne(newPosts)
        const result: PostsType | null = await postsCollection.findOne({id: newPosts.id}, postViewModel)
        if (result !== null) {return result}
        else {return "400"}
    },

    async changePost(postId: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<string | object> {

        const post = await postsCollection.findOne({id: postId}, postViewModel)
        const findBlogger = await bloggersCollection.findOne({id: bloggerId})
        if (post !== null && findBlogger !== null) {
            await postsCollection.updateOne({id: postId}, {$set: {title: title, shortDescription: shortDescription, content: content, }})
            
            return post
        }
        else if (findBlogger !== null) {
            return '400'
        }
        else {
            return "404"
        }
    },
    async deletePost(deleteId: number): Promise<boolean> {
        const result = await postsCollection.deleteOne({id: deleteId})
        return result.deletedCount === 1
    }
}