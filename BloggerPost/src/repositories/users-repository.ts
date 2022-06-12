import { authDataCollection, codeConfirmCollection, emailSendCollection, registrationDataCollection, usersCollection } from "./db"
import { AuthDataType, ConfirmedAttemptDataType, EmailSendDataType, RegistrationDataType, UsersType } from "../types/UsersType"
import { add, addSeconds, sub } from "date-fns"
import { ModifyResult } from "mongodb"

const userViewModel = {
    projection: {
        _id: 0,
        accountData: {
            passwordHash: 0,
            passwordSalt: 0
        }
    }
}

export const usersRepository = {

    async allUsers(skip: number, limit: number, page?: number): Promise<object> {
        const fullData = await usersCollection.find({}, userViewModel).skip(skip).limit(limit).toArray()
        const totalCount = await usersCollection.count({})
        const pagesCount = Math.ceil(totalCount / limit)


        return { pagesCount: pagesCount, page: page, pageSize: limit, totalCount: totalCount, items: fullData }
    },
    async createUser(newUser: UsersType): Promise<UsersType | null | boolean> {
        await usersCollection.insertOne(newUser)
        const checkUniqueLogin = await usersCollection.count({ "accountData.login": newUser.accountData.login })
        const checkUniqueEmail = await usersCollection.count({ "accountData.email": newUser.accountData.email })
        if (checkUniqueLogin > 1 || checkUniqueEmail > 1) {
            return false
        }
        else {
            return await usersCollection.findOne({ id: newUser.id }, userViewModel)
        }

    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({ id: id })
        return result.deletedCount === 1
    },





    // Основная часть закончена, вспомогательные эндпоинты

    async confirmationEmail(user: UsersType): Promise<boolean> {
        const activatedUser = await usersCollection.updateOne({ id: user.id }, { $set: { "emailConfirmation.activatedStatus": true } })
        if (activatedUser.modifiedCount > 0) {
            return true
        }
        else {
            return false
        }
    },

    async ipAddressIsScam(ip: string, login?: string): Promise<boolean> {
        const dateResult = sub(new Date(), {
            seconds: 10 // Задержка которую мы отнимаем от текущего времени
        })
        const checkResultByIp = await registrationDataCollection.countDocuments({ $and: [{ ip: ip }, { dateRegistation: { $gt: dateResult } }] })
        if (checkResultByIp > 5) { // Проверяем длинну массива, если больше 5 регистраций, то отдаем false - он дальше отдает 429 ошибку
            return false
        }
        else { return true }
    },
    // Считаем количество авторизаций с учетом IP и Login за последние 10 секунд
    async counterAttemptAuth(ip: string, login?: string): Promise<boolean> {
        const dateResult = sub(new Date(), {
            seconds: 10
        })
        const checkResultByIp = await authDataCollection.countDocuments({ $and: [{ ip: ip }, { tryAuthDate: { $gt: dateResult } }] })
        const checkResultByLogin = await authDataCollection.countDocuments({ $and: [{ login: login }, { tryAuthDate: { $gt: dateResult } }] })
        if (checkResultByIp > 5 || checkResultByLogin > 5) {
            return false
        }
        else { return true }
    },
    async counterAttemptConfirm(ip: string, code?: string): Promise<boolean> {
        const dateResult = sub(new Date(), {
            seconds: 10
        })
        const checkResultByIp = await codeConfirmCollection.countDocuments({ $and: [{ ip: ip }, { tryConfirmDate: { $gt: dateResult } }] })
        if (checkResultByIp > 5) {
            return false
        }
        else { 
            return true 
        }
    },
    async counterAttemptEmail(ip: string, email?: string): Promise<boolean> {
        const dateResult = sub(new Date(), {
            seconds: 10
        })
        const checkResultByIp = await emailSendCollection.countDocuments({ $and: [{ ip: ip }, { emailSendDate: { $gt: dateResult } }] })
        if (checkResultByIp > 5) {
            return false
        }
        else { return true }
    },


    // Эндпоинты для поиска по определенным условиям
    async findUserByEmail(email: string): Promise<UsersType | null> {
        const foundUser = await usersCollection.findOne({ "accountData.email": email })
        return foundUser
    },
    async findUserById(id: string): Promise<UsersType | null> {
        const result = await usersCollection.findOne({ id: id })
        return result
    },
    async findUserByLogin(login: string): Promise<UsersType | null> {
        const foundUser = await usersCollection.findOne({ "accountData.login": login })
        return foundUser
    },
    async findUserByConfirmationCode(code: string): Promise<UsersType | null> {
        const foundUser = await usersCollection.findOne({ "emailConfirmation.codeForActivated": code })
        return foundUser
    },
    async refreshActivationCode(email: string, code: string): Promise<ModifyResult<UsersType>> {
        const updateCode = await usersCollection.findOneAndUpdate({ "accountData.email": email }, { $set: { "emailConfirmation.codeForActivated": code } }, { returnDocument: "after" })
        return updateCode
    },

    // Эндпоинты для выгрузки информации из вспомогательных лог-баз
    async getRegistrationDate(): Promise<RegistrationDataType[]> {
        return await registrationDataCollection.find({}).toArray()
    },
    async getAuthDate(): Promise<AuthDataType[]> {
        return await authDataCollection.find({}).toArray()
    },
    async getEmailSendDate(): Promise<EmailSendDataType[]> {
        return await emailSendCollection.find({}).toArray()
    },
    async getConfirmAttemptDate(): Promise<ConfirmedAttemptDataType[]> {
        return await codeConfirmCollection.find({}).toArray()
    },


    // Эндпоинты для наполнения информацией вспомогательных лог-баз

    async informationAboutRegistration(registrationData: RegistrationDataType): Promise<boolean> {
        await registrationDataCollection.insertOne(registrationData)
        return true
    },
    async informationAboutAuth(authData: AuthDataType): Promise<boolean> {
        await authDataCollection.insertOne(authData)
        return true
    },

    async informationAboutEmailSend(emailSendData: EmailSendDataType): Promise<boolean> {
        await emailSendCollection.insertOne(emailSendData)
        return true
    },
    async informationAboutConfirmed(confirmedData: ConfirmedAttemptDataType): Promise<boolean> {
        await codeConfirmCollection.insertOne(confirmedData)
        return true
    },

}

