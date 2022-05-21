import { commentsCollection } from "./db"



export type CommentsType = {
    id: string
    content: string
    userId: string
    userLogin: string
    addedAt: string
}



export const commentsRepository = {
    
    async allCommentsByUserId(id: string): Promise<CommentsType[]> {
        const result = await commentsCollection.find({id: id}).toArray()
        return result
    }
}