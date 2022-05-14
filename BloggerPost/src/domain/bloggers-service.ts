import { bloggerRepository } from "../repositories/bloggers-repositories"

export type BloggersType = {
    id: number,
    name: string,
    youtubeUrl: string
}

export const bloggerService = {
    async allBloggers(): Promise<BloggersType[]> {
        return bloggerRepository.allBloggers()
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