import { bloggersCollection } from "./db"

export type BloggersType = {
    id: number,
    name: string,
    youtubeUrl: string
}

export const bloggerRepository = {
    async allBloggers(): Promise<BloggersType[]> {
        return bloggersCollection.find({}).toArray()
    },

    async targetBloggers(id: number): Promise<object | undefined> {

        const blogger: BloggersType | null = await bloggersCollection.findOne({id: id})
        if (blogger !== null) {
            return blogger
        }
        else {
            return
        }
    },

    async createBlogger(name: any, youtubeUrl: string): Promise<BloggersType> {
        const newBlogger = {
            id: +(new Date()),
            name: name,
            youtubeUrl: youtubeUrl
        }
            await bloggersCollection.insertOne(newBlogger)
            return newBlogger
    },

    async changeBlogger(id: number, name: any, youtubeUrl: string): Promise<string> {
        const result = await bloggersCollection.updateOne({id: id}, {$set: {name: name, youtubeUrl: youtubeUrl}})
        result.matchedCount === 1
        if (result !== undefined) {
            return "update";
        }
        else {
            return "404"
        }
    },
    async deleteBlogger(id: number): Promise<string> {
        const result = await bloggersCollection.deleteOne({id: id})
        if (result.deletedCount !== 1) {
            return "404"
        }
        else {
            return "204"
        }
    }

}