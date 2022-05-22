import { UsersType } from "../repositories/users-repository";

declare global {
    namespace Express {
        export interface Request {
            user: UsersType | null
        }
    }
}