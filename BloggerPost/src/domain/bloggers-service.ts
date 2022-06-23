import { BloggerRepository } from "../repositories/bloggers-repositories"
import { v4 as uuidv4 } from "uuid"
import { Blogger, BloggersType } from "../types/Types"


export class BloggerService { 

    bloggerRepository: BloggerRepository
    constructor () {
        this.bloggerRepository = new BloggerRepository()
    }

    async allBloggers(pageSize: number, pageNumber: number, searchNameTerm?: string | null): Promise<object> {
        let skip = 0
        if (pageNumber && pageSize) {
            skip = (pageNumber - 1) * pageSize
        }
        const bloggers = await this.bloggerRepository.allBloggers(skip, pageSize, searchNameTerm, pageNumber)
        return bloggers
    }
    async targetBloggers(id: string): Promise<object | undefined> {

        return this.bloggerRepository.targetBloggers(id)
    }
    async createBlogger(name: any, youtubeUrl: string): Promise<BloggersType | null> {
        // Построено на классе
        const newBlogger = new Blogger(uuidv4(), name, youtubeUrl)
        const createdBlogger = await this.bloggerRepository.createBlogger(newBlogger)
        return createdBlogger
    }
    async changeBlogger(id: string, name: any, youtubeUrl: string): Promise<string> {
        const afterUpdate = await this.bloggerRepository.changeBlogger(id, name, youtubeUrl)
        if (afterUpdate == true) {
            return "update";
        }
        else {
            return "404"
        }
    }
    async deleteBlogger(id: string): Promise<string> {
        const result = await this.bloggerRepository.deleteBlogger(id)
        if (result == true) {
            return "204"
        }
        else {
            return "404"
        }
    }
    async deleteAllBlogger(): Promise<boolean> {
        return await this.bloggerRepository.deleteAllBlogger()
    }
}

// export const bloggerService = new BloggerService()