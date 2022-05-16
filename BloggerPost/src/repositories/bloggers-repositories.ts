import { bloggersCollection } from "./db"

export type BloggersType = {
    id: number,
    name: string,
    youtubeUrl: string
}

export const bloggerRepository = {
    async allBloggers(skip?: number, limit?: number): Promise<BloggersType[]> {
        const cursor =  bloggersCollection.find({
        })
        if(skip) cursor.skip(skip)
        if(limit) cursor.limit(limit)
        
        return cursor.toArray()

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

    async createBlogger(newBlogger: BloggersType): Promise<BloggersType> {
            await bloggersCollection.insertOne(newBlogger)
            return newBlogger
    },

    async changeBlogger(id: number, name: any, youtubeUrl: string): Promise<boolean> {
        const result = await bloggersCollection.updateOne({id: id}, {$set: {name: name, youtubeUrl: youtubeUrl}})
        return result.matchedCount === 1
    },
    async deleteBlogger(id: number): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }

}