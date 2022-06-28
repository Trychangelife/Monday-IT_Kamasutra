import { CommentsRepository } from "../repositories/comments-repository";
import { CommentsType } from "../types/Types";


export class CommentsService {

    constructor(private commentsRepository: CommentsRepository) {
    }

    async getCommentsById(id: string): Promise<CommentsType | null> {
        return await this.commentsRepository.allCommentsByUserId(id)
    }
    async updateCommentByCommentId(commentId: string, content: string, userId: string): Promise<boolean | null> {
        return await this.commentsRepository.updateCommentByCommentId(commentId, content, userId)
    }
    async deleteCommentByCommentId(commentId: string, userId: string): Promise<boolean | null> {
        return await this.commentsRepository.deleteCommentByCommentId(commentId, userId)
    }
}

// export const commentsService = new CommentsService()