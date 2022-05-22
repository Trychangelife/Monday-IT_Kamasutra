import { commentsRepository, CommentsType } from "../repositories/comments-repository";
import { UsersType } from "../repositories/users-repository";








export const commentsService = {
    async getCommentsById(id: string): Promise<CommentsType | null> {
        return await commentsRepository.allCommentsByUserId(id)
    }, 

    async updateCommentByCommentId(commentId: string, content: string, userId: string): Promise<boolean | null> {
        return await commentsRepository.updateCommentByCommentId(commentId, content, userId)
    },
    async deleteCommentByCommentId(commentId: string, userId: string): Promise<boolean | null> {
        return await commentsRepository.deleteCommentByCommentId(commentId, userId)
    }
}