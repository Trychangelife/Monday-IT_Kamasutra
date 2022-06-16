import { CommentsType } from "../types/CommentsType"
import { commentsModel } from "./db"
import { commentsVievModel } from "./posts-repositories"



export const commentsRepository = {

    async allCommentsByUserId(id: string): Promise<CommentsType | null> {
        const result = await commentsModel.findOne({ id: id }, commentsVievModel )
        if (result !== null) {
            return result
        }
        else {
            return null
        }
        
    },
    async updateCommentByCommentId(commentId: string, content: string, userId: string): Promise<boolean | null> {
        const findTargetComment = await commentsModel.findOne({ commentId: commentId }, commentsVievModel)
        if (findTargetComment !== null && findTargetComment.userId === userId) {
            await commentsModel.updateOne({ commentId: commentId }, { $set: { content: content } })
            return true
        }
        if (findTargetComment == null) {
            return null
        }
        else {
            return false
        }
    },
    async deleteCommentByCommentId(commentId: string, userId: string): Promise<boolean | null> {
        const findTargetComment = await commentsModel.findOne({ id: commentId })
        if (findTargetComment !== null && findTargetComment.userId === userId) {
            await commentsModel.deleteOne({id: commentId})
            return true
        }
        if (findTargetComment == null) {
            return null
        }
        else {
            return false
        }
    }
}   