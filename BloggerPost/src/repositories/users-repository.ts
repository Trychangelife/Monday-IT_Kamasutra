import { authDataModel, codeConfirmModel, emailSendModel, refreshTokenModel, registrationDataModel, usersModel } from "./db"
import { AuthDataType, ConfirmedAttemptDataType, EmailSendDataType, RefreshTokenStorageType, RegistrationDataType, UsersType } from "../types/Types"
import { sub } from "date-fns"

const userViewModel = {
        _id: 0,
        id: 1,
        accountData: {
            login: 1,
            email: 1
        },
        emailConfirmation: {
            activatedStatus: 1
        }
}

export class UsersRepository {
    async allUsers(skip: number, limit: number, page?: number): Promise<object> {
        const fullData = await usersModel.find({}, userViewModel).skip(skip).limit(limit)
        const totalCount = await usersModel.count({})
        const pagesCount = Math.ceil(totalCount / limit)
        return { pagesCount: pagesCount, page: page, pageSize: limit, totalCount: totalCount, items: fullData }
    }
    async createUser(newUser: UsersType): Promise<UsersType | null | boolean> {
        await usersModel.create(newUser)
        const checkUniqueLogin = await usersModel.count({ "accountData.login": newUser.accountData.login })
        const checkUniqueEmail = await usersModel.count({ "accountData.email": newUser.accountData.email })
        if (checkUniqueLogin > 1 || checkUniqueEmail > 1) {
            return false
        }
        else {
            return await usersModel.findOne({ id: newUser.id }, userViewModel)
        }

    }
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersModel.deleteOne({ id: id })
        return result.deletedCount === 1
    }

    // Основная часть закончена, вспомогательные эндпоинты
    async confirmationEmail(user: UsersType): Promise<boolean> {
        const activatedUser = await usersModel.updateOne({ id: user.id }, { $set: { "emailConfirmation.activatedStatus": true } })
        if (activatedUser.modifiedCount > 0) {
            return true
        }
        else {
            return false
        }
    }
    async ipAddressIsScam(ip: string, login?: string): Promise<boolean> {
        const dateResult = sub(new Date(), {
            seconds: 10 // Задержка которую мы отнимаем от текущего времени
        })
        const checkResultByIp = await registrationDataModel.countDocuments({ $and: [{ ip: ip }, { dateRegistation: { $gt: dateResult } }] })
        if (checkResultByIp > 5) { // Проверяем длинну массива, если больше 5 регистраций, то отдаем false - он дальше отдает 429 ошибку
            return false
        }
        else { return true }
    }

    // Считаем количество авторизаций с учетом IP и Login за последние 10 секунд
    async counterAttemptAuth(ip: string, login?: string): Promise<boolean> {
        const dateResult = sub(new Date(), {
            seconds: 10
        })
        const checkResultByIp = await authDataModel.countDocuments({ $and: [{ ip: ip }, { tryAuthDate: { $gt: dateResult } }] })
        const checkResultByLogin = await authDataModel.countDocuments({ $and: [{ login: login }, { tryAuthDate: { $gt: dateResult } }] })
        if (checkResultByIp > 5 || checkResultByLogin > 5) {
            return false
        }
        else { return true }
    }
    async counterAttemptConfirm(ip: string, code?: string): Promise<boolean> {
        const dateResult = sub(new Date(), {
            seconds: 10
        })
        const checkResultByIp = await codeConfirmModel.countDocuments({ $and: [{ ip: ip }, { tryConfirmDate: { $gt: dateResult } }] })
        if (checkResultByIp > 5) {
            return false
        }
        else { 
            return true 
        }
    }
    async counterAttemptEmail(ip: string, email?: string): Promise<boolean> {
        const dateResult = sub(new Date(), {
            seconds: 10
        })
        const checkResultByIp = await emailSendModel.countDocuments({ $and: [{ ip: ip }, { emailSendDate: { $gt: dateResult } }] })
        if (checkResultByIp > 5) {
            return false
        }
        else { return true }
    }

    // Эндпоинты для поиска по определенным условиям
    async findUserByEmail(email: string): Promise<UsersType | null> {
        const foundUser = await usersModel.findOne({ "accountData.email": email })
        return foundUser
    }
    async findUserById(id: string): Promise<UsersType | null> {
        const result = await usersModel.findOne({ id: id })
        return result
    }
    async findUserByLogin(login: string): Promise<UsersType | null> {
        const foundUser = await usersModel.findOne({ "accountData.login": login })
        return foundUser
    }
    async findUserByConfirmationCode(code: string): Promise<UsersType | null> {
        const foundUser = await usersModel.findOne({ "emailConfirmation.codeForActivated": code })
        return foundUser
    }
    async refreshActivationCode(email: string, code: string): Promise <UsersType | null> {
        const updateCode = await usersModel.findOneAndUpdate({ "accountData.email": email }, { $set: { "emailConfirmation.codeForActivated": code } }, { new: true })
        return updateCode
    }

    // Эндпоинты для выгрузки информации из вспомогательных лог-баз
    async getRegistrationDate(): Promise<RegistrationDataType[]> {
        return await registrationDataModel.find({})
    }
    async getAuthDate(): Promise<AuthDataType[]> {
        return await authDataModel.find({})
    }
    async getEmailSendDate(): Promise<EmailSendDataType[]> {
        return await emailSendModel.find({})
    }
    async getConfirmAttemptDate(): Promise<ConfirmedAttemptDataType[]> {
        return await codeConfirmModel.find({})
    }
    async getTokenDate(): Promise<RefreshTokenStorageType[]> {
        return await refreshTokenModel.find({})
    }

    // Эндпоинты для наполнения информацией вспомогательных лог-баз
    async informationAboutRegistration(registrationData: RegistrationDataType): Promise<boolean> {
        await registrationDataModel.create(registrationData)
        return true
    }
    async informationAboutAuth(authData: AuthDataType): Promise<boolean> {
        await authDataModel.create(authData)
        return true
    }
    async informationAboutEmailSend(emailSendData: EmailSendDataType): Promise<boolean> {
        await emailSendModel.create(emailSendData)
        return true
    }
    async informationAboutConfirmed(confirmedData: ConfirmedAttemptDataType): Promise<boolean> {
        await codeConfirmModel.create(confirmedData)
        return true
    }
}

// export const usersRepository = new UsersRepository()
