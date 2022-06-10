import { UsersType } from "./UsersType";

declare global {
    namespace Express {
        export interface Request {
            user: UsersType | null
        }
    }
}