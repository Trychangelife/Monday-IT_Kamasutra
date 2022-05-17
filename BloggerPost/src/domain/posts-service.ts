import { postsRepository } from "../repositories/posts-repositories"


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
export const postsService = {
    async allPosts(): Promise<PostsType[]> {
        return postsRepository.allPosts()
    },

    async targetPosts(postId: number): Promise<object | undefined>{
        return await postsRepository.targetPosts(postId)
    },
    
    async allPostsSpecificBlogger(bloggerId: number, page?:number, pageSize?:number): Promise<object | undefined>{
        let skip = 0
        if (page && pageSize){
            skip = (page - 1) * pageSize
        }

        return await postsRepository.allPostsSpecificBlogger(bloggerId, skip, pageSize)
    },

    async releasePost(title: string, content: string, shortDescription: string, bloggerId: number, bloggerIdUrl?: number): Promise<object | string | object> {
        let newPosts: PostsType = {
            id: +(new Date()),
            title: title,
            content: content,
            shortDescription: shortDescription,
            bloggerId: bloggerId,
            bloggerName: doSomeString()
        }
        const createPost = await postsRepository.releasePost(newPosts, bloggerId)
        if (createPost == "400") {
            return "400"
        }
        else {
            return createPost
        }

        
    },

    async changePost(postId: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<string | object> {

        return await postsRepository.changePost(postId, title, shortDescription, content, bloggerId)
    },
    async deletePost(deleteId: number): Promise<boolean> {
        return await postsRepository.deletePost(deleteId)

    }
}