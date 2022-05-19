import { bloggerRepository } from "../repositories/bloggers-repositories"
import { bloggersCollection } from "../repositories/db"

export type BloggersType = {
    id: number,
    name: string,
    youtubeUrl: string
}

export const bloggerService = {
    async allBloggers(pageSize:number, pageNumber: number,  searchNameTerm?: string | null): Promise<object> {
        let skip = 0
        if (pageNumber && pageSize) {
            skip = (pageNumber - 1) * pageSize
        }
        const bloggers = await bloggerRepository.allBloggers(skip, pageSize, searchNameTerm, pageNumber)
        return bloggers
    },

    async targetBloggers(id: number): Promise<object | undefined> {

        return bloggerRepository.targetBloggers(id)
    },

    async createBlogger(name: any, youtubeUrl: string): Promise<BloggersType | null> {
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