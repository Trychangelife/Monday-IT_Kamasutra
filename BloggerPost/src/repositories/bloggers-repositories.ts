import { BloggersType } from "../types/Types"
import { bloggerModel } from "./db"


const modelViewBloggers = {
    _id: 0,
    id: 1,
    name: 1,
    youtubeUrl: 1
}

export const bloggerRepository = {
    async allBloggers(skip: number, limit?: number, searchNameTerm?: string | null, page?: number): Promise<object> {
        
        
        if (page !== undefined && limit !== undefined) {
            const cursor = await bloggerModel.find({}, modelViewBloggers).skip(skip).limit(limit)
            const totalCount = await bloggerModel.count({}) //Возможно нужно изменить на COUNT (чтобы не вытягивать всю базу данных)
            const pagesCount = Math.ceil(totalCount / limit)
            const fullData = await bloggerModel.find({}, modelViewBloggers)
            
            if (searchNameTerm !== null) {
                const cursorWithRegEx = await bloggerModel.find({name: {$regex: searchNameTerm, $options: 'i'}}, modelViewBloggers).skip(skip).limit(limit)
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
            return await bloggerModel.find({}, modelViewBloggers)
        } 

    },

    async targetBloggers(id: string): Promise<object | undefined> {

        const blogger: BloggersType | null = await bloggerModel.findOne({ id: id }, modelViewBloggers)
        if (blogger !== null) {
            return blogger
        }
        else {
            return
        }
    },

    async createBlogger(newBlogger: BloggersType): Promise<BloggersType | null> {
        await bloggerModel.create(newBlogger)
        return await bloggerModel.findOne({id: newBlogger.id}, modelViewBloggers)
    },

    async changeBlogger(id: string, name: any, youtubeUrl: string): Promise<boolean> {
        const result = await bloggerModel.updateOne({ id: id }, { $set: { name: name, youtubeUrl: youtubeUrl } })
        return result.matchedCount === 1
    },
    async deleteBlogger(id: string): Promise<boolean> {
        const result = await bloggerModel.deleteOne({ id: id })
        return result.deletedCount === 1
    },
    async deleteAllBlogger(): Promise<boolean> {
        const afterDelete = await bloggerModel.deleteMany({})
        return afterDelete.acknowledged
    }

}






    // const totalCount = await (await bloggerModel.find({}).toArray()).length
        // const cursor =  bloggerModel.find({
        // })
        // if(skip) cursor.skip(skip)
        // if(limit) {cursor.limit(limit)
        // // const items:any = cursor.toArray()
        // const pagesCount = Math.ceil(totalCount / limit)
        // return {
        //     items: cursor,
        //     totalCount, pagesCount
        // }}