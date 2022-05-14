import { bloggersCollection, postsCollection } from "./db";


export type PostsType = {
    id: number,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: number,
    bloggerName: string
}

function doSomeString() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
export const postsRepository = {
    async allPosts(): Promise<PostsType[]> {
        return postsCollection.find({}).toArray()
    },

    async targetPosts(postId: number): Promise<object | undefined>{
        const targetPost: PostsType | null = await postsCollection.findOne({id: postId})
        if (targetPost == null) {
            return undefined
        }
        else {
        return targetPost;}
    },

    async releasePost(title: string, content: string, shortDescription: string, bloggerId: number): Promise<object | string> {
        const findBlogger = await bloggersCollection.findOne({id: bloggerId})
        
        if (findBlogger == null) {
            return '400'
        }
        else {
        let newPosts = {
            id: +(new Date()),
            title: title,
            content: content,
            shortDescription: shortDescription,
            bloggerId: findBlogger.id,
            bloggerName: doSomeString()
        }
        await postsCollection.insertOne(newPosts)
        return newPosts}
    },

    async changePost(postId: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<string | object> {

        const post = await postsCollection.findOne({id: postId})
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
        if(result.deletedCount === 1) {
        return true}
        else {
            return false
        }
    }
}