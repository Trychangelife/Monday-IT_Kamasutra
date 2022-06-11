import { usersCollection } from "./db"
import { UsersType } from "../types/UsersType"

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
        const checkUniqueLogin = await usersCollection.count({ login: newUser.accountData.login })
        const checkUniqueEmail = await usersCollection.count({ email: newUser.accountData.email })
        if (checkUniqueLogin > 1 || checkUniqueEmail > 1) {
            return false
        }
        else {
            return await usersCollection.findOne({ id: newUser.id }, userViewModel)
        }

    },
    async deleteUser (id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async findUserById (id: string): Promise<UsersType | null> {
        const result = await usersCollection.findOne({id: id})
        return result
    },
    async findUserByLogin (login: string): Promise<UsersType | null> {
        const foundUser = await usersCollection.findOne({"accountData.login": login})
        return foundUser
    },
    async findUserByConfirmationCode (code: string): Promise<UsersType | null> {
        const foundUser = await usersCollection.findOne({"emailConfirmation.codeForActivated": code})
        return foundUser
    },

    async confirmationEmail (user: UsersType): Promise <boolean> {
        const activatedUser = await usersCollection.updateOne({ id: user.id }, { $set: { "emailConfirmation.activatedStatus": true } })
        if (activatedUser.modifiedCount > 0) {
            return true
        }
        else {
            return false
        }
    },
    // async findUserByEmail (email: string): Promise<UsersType | null> {
    //     const foundUser = await usersCollection.findOne({"accountData.email": email})
    //     return foundUser
    // },
}

