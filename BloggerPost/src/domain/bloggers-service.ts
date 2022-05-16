import { bloggerRepository } from "../repositories/bloggers-repositories"
import { bloggersCollection } from "../repositories/db"

export type BloggersType = {
    id: number,
    name: string,
    youtubeUrl: string
}

export const bloggerService = {
    async allBloggers(params?: {pageSize: number, page: number}): Promise<BloggersType[]> {
        let skip = 0
        if(params) {
        skip = (params.page - 1) * params.pageSize
        // const totalCount = await bloggersCollection.find({}).toArray()
        // const pagesCount = Math.ceil(totalCount.length / params?.pageSize)  
    }
    const bloggers = await bloggerRepository.allBloggers(skip, params?.pageSize)
    // const totalCount = await bloggersCollection.find({}).toArray()
    // const pagesCount = Math.ceil(totalCount.length / params?.pageSize)
    // return {
    //     items: bloggers,
    //     totalCount, pagesCount
    // }
    return bloggers
    },
   
    async targetBloggers(id: number): Promise<object | undefined> {

       return bloggerRepository.targetBloggers(id)
    },

    async createBlogger(name: any, youtubeUrl: string): Promise<BloggersType> {
        const newBlogger = {
            id: +(new Date()),
            name: name,
            youtubeUrl: youtubeUrl
        }
            const createdBlogger = await bloggerRepository.createBlogger(newBlogger)
            return createdBlogger
    },

    async changeBlogger(id: number, name: any, youtubeUrl: string): Promise<string> {
        const afterUpdate = await bloggerRepository.changeBlogger(id, name, youtubeUrl)
        if (afterUpdate == true) {
            return "update";
        }
        else {
            return "404"
        }
    },
    async deleteBlogger(id: number): Promise<string> {
        const result = await bloggerRepository.deleteBlogger(id)
        if (result == true) {
            return "204"
        }
        else {
            return "404"
        }
    }

}