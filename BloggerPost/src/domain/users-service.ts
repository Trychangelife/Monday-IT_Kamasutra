import { ObjectId } from "mongodb"
import { usersRepository, UsersType } from "../repositories/users-repository"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"


export const usersService = {

    async allUsers(pageSize: number, pageNumber: number): Promise<object> {
        let skip = 0
        if (pageNumber && pageSize) {
            skip = (pageNumber - 1) * pageSize
        }
        return await usersRepository.allUsers(skip, pageSize, pageNumber)
    },
    async createUser(login: string, password: string): Promise<UsersType | null | boolean> {
        
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt) 
        const newUser: UsersType = {
            _id: new ObjectId(),
            id: uuidv4(),
            login,
            passwordHash,
            passwordSalt,
            password
        }
        return await usersRepository.createUser(newUser)
    },
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        console.log('hash ' + hash)
        return hash
    },
    async checkCredentials(login: string, password: string) {
        const user = await usersRepository.findUserByLogin(login)
        if (!user) return false
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash) {
            return false
        }
        return true
    },
    async findUserById (id: string): Promise <UsersType | null> {
        return await usersRepository.findUserById(id)
    }
} 