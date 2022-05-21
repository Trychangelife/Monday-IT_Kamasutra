import { ObjectId } from "mongodb"
import { usersRepository, UsersType } from "../repositories/users-repository"
import { v4 as uuidv4 } from "uuid"


export const usersService = {

    async allUsers(pageSize: number, pageNumber: number): Promise<object> {
        let skip = 0
        if (pageNumber && pageSize) {
            skip = (pageNumber - 1) * pageSize
        }
        return await usersRepository.allUsers(skip, pageSize, pageNumber)
    },
    async createUser(login: string, password: string): Promise<UsersType | null | boolean> {
        const newUser: UsersType = {
            _id: new ObjectId(),
            id: uuidv4(),
            login,
            password
        }
        return await usersRepository.createUser(newUser)
    },
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    }
} 