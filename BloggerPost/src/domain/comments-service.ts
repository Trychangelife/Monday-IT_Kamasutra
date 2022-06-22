import { commentsRepository } from "../repositories/comments-repository";
import { CommentsType } from "../types/Types";


export class CommentsService {
    async getCommentsById(id: string): Promise<CommentsType | null> {
        return await commentsRepository.allCommentsByUserId(id)
    }
    async updateCommentByCommentId(commentId: string, content: string, userId: string): Promise<boolean | null> {
        return await commentsRepository.updateCommentByCommentId(commentId, content, userId)
    }
    async deleteCommentByCommentId(commentId: string, userId: string): Promise<boolean | null> {
        return await commentsRepository.deleteCommentByCommentId(commentId, userId)
    }
}

export const commentsService = new CommentsService()