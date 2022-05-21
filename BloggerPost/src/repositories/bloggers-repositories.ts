import { bloggersCollection } from "./db"

export type BloggersType = {
    id: string,
    name: string,
    youtubeUrl: string
}
const modelViewBloggers = {
    projection: {
        _id: 0,
        id: 1,
        name: 1,
        youtubeUrl: 1
    }
}

export const bloggerRepository = {
    async allBloggers(skip: number, limit?: number, searchNameTerm?: string | null, page?: number): Promise<object> {
        
        
        if (page !== undefined && limit !== undefined) {
            const cursor = await bloggersCollection.find({}, modelViewBloggers).skip(skip).limit(limit).toArray()
            const totalCount = await bloggersCollection.count({}) //Возможно нужно изменить на COUNT (чтобы не вытягивать всю базу данных)
            const pagesCount = Math.ceil(totalCount / limit)
            const fullData = await bloggersCollection.find({}, modelViewBloggers).toArray()
            
            if (searchNameTerm !== null) {
                const cursorWithRegEx = await bloggersCollection.find({name: {$regex: searchNameTerm, $options: 'i'}}, modelViewBloggers).skip(skip).limit(limit).toArray()
                const totalCountWithRegex = cursorWithRegEx.length
                const pagesCountWithRegex = Math.ceil(totalCountWithRegex / limit)
                return { pagesCount: pagesCountWithRegex, page: page, pageSize: limit, totalCount: totalCountWithRegex, items: cursorWithRegEx }
            }
            if (skip > 0 || limit > 0) {
                return { pagesCount, page: page, pageSize: limit, totalCount, items: cursor }
            }
            else return { pagesCount: 0, page: page, pageSize: limit, totalCount, items: fullData }
        }
        else {
            return await bloggersCollection.find({}, modelViewBloggers).toArray()
        } 

    },

    async targetBloggers(id: string): Promise<object | undefined> {

        const blogger: BloggersType | null = await bloggersCollection.findOne({ id: id }, modelViewBloggers)
        if (blogger !== null) {
            return blogger
        }
        else {
            return
        }
    },

    async createBlogger(newBlogger: BloggersType): Promise<BloggersType | null> {
        await bloggersCollection.insertOne(newBlogger)
        return await bloggersCollection.findOne({id: newBlogger.id}, modelViewBloggers)
    },

    async changeBlogger(id: string, name: any, youtubeUrl: string): Promise<boolean> {
        const result = await bloggersCollection.updateOne({ id: id }, { $set: { name: name, youtubeUrl: youtubeUrl } })
        return result.matchedCount === 1
    },
    async deleteBlogger(id: string): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({ id: id })
        return result.deletedCount === 1
    }

}






    // const totalCount = await (await bloggersCollection.find({}).toArray()).length
        // const cursor =  bloggersCollection.find({
        // })
        // if(skip) cursor.skip(skip)
        // if(limit) {cursor.limit(limit)
        // // const items:any = cursor.toArray()
        // const pagesCount = Math.ceil(totalCount / limit)
        // return {
        //     items: cursor,
        //     totalCount, pagesCount
        // }}