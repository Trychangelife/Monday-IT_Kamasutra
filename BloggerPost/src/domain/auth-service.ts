import { usersRepository } from "../repositories/users-repository"
import { AuthDataType, ConfirmedAttemptDataType, EmailSendDataType, UsersType } from "../types/Types"
import { ModifyResult } from "mongodb"
import { uuid } from "uuidv4"


export const authService = { 

    async ipAddressIsScam (ip: string, login: string): Promise <boolean> {
        return await usersRepository.ipAddressIsScam(ip, login)
    },
    async refreshActivationCode (email: string): Promise <UsersType | null> {
        const refreshCode = uuid()
        return await usersRepository.refreshActivationCode(email, refreshCode)
    },
    async counterAttemptAuth (ip: string, login: string): Promise <boolean> {
        return await usersRepository.counterAttemptAuth(ip, login)
    },
    async counterAttemptConfirm (ip: string, code: string): Promise <boolean> {
        return await usersRepository.counterAttemptConfirm(ip, code)
    },
    async counterAttemptEmail (ip: string, email: string): Promise <boolean> {
        return await usersRepository.counterAttemptEmail(ip, email)
    },
    async informationAboutAuth (ip: string, login: string): Promise <boolean> {
        const authData: AuthDataType = {
            ip,
            tryAuthDate: new Date(),
            login
        }
        return await usersRepository.informationAboutAuth(authData)
    },
    async informationAboutConfirmed (ip: string, code: string): Promise <boolean> {
        const confirmationData: ConfirmedAttemptDataType = {
            ip,
            tryConfirmDate: new Date(),
            code
        }
        return await usersRepository.informationAboutConfirmed(confirmationData)
    },
    async informationAboutEmailSend (ip: string, email: string): Promise <boolean> {
        const emailSendData: EmailSendDataType = {
            ip,
            emailSendDate: new Date(),
            email
        }
        return await usersRepository.informationAboutEmailSend(emailSendData)
    },
}

function uuidv4() {
    throw new Error("Function not implemented.")
}
