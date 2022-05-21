import { commentsRepository, CommentsType } from "../repositories/comments-repository";
import { UsersType } from "../repositories/users-repository";








export const commentsService = {
    async getCommentsById(id: string): Promise<CommentsType[]> {
        return await commentsRepository.allCommentsByUserId(id)
    }
}