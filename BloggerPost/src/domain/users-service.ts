import { ObjectId } from "mongodb"
import { usersRepository } from "../repositories/users-repository"
import { RegistrationDataType, UsersType } from "../types/UsersType"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"
import { add } from "date-fns"
import { emailService } from "./email-service"

export const usersService = {

    async allUsers(pageSize: number, pageNumber: number): Promise<object> {
        let skip = 0
        if (pageNumber && pageSize) {
            skip = (pageNumber - 1) * pageSize
        }
        return await usersRepository.allUsers(skip, pageSize, pageNumber)
    },
    async createUser(login: string, password: string, email: string, ip: string): Promise<UsersType | null | boolean> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const newUser: UsersType = {
            _id: new ObjectId(),
            id: uuidv4(),
            accountData: {
                login,
                passwordHash,
                passwordSalt,
                email,
            },
            emailConfirmation: {
                codeForActivated: uuidv4(),
                activatedStatus: false,
            }
        }
        const registrationData: RegistrationDataType = {
            ip,
            dateRegistation: new Date(),
            email
        }
        await usersRepository.informationAboutRegistration(registrationData)
        const checkScam = await usersRepository.ipAddressIsScam(ip)
        if (checkScam == true) {
            if (await usersRepository.findUserByLogin(login) !== null || await usersRepository.findUserByEmail(email) !== null ) {
                return false
            }
            else {
                await usersRepository.createUser(newUser)
                // emailService.emailConfirmation(newUser.accountData.email)
                return newUser
            }
        }
        return null
    },
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
    async checkCredentials(login: string, password: string,) {
        const user = await usersRepository.findUserByLogin(login)
        if (!user) return false
        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
        if (user.accountData.passwordHash !== passwordHash) {
            return false
        }
        return true
    },
    async findUserById(id: string): Promise<UsersType | null> {
        return await usersRepository.findUserById(id)
    },
    async confirmationEmail(code: string): Promise<boolean> {
        let user = await usersRepository.findUserByConfirmationCode(code)
        if (user) {
            return await usersRepository.confirmationEmail(user)
        }
        else {
            return false
        }

    },
} 