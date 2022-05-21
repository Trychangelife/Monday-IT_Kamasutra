import { ObjectId } from "mongodb"
import { usersCollection } from "./db"
export type UsersType = {
    _id: ObjectId
    id: string
    login: string
    password: string
}

const userViewModel = {
    projection: {
        _id: 0,
        password: 0
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
        const checkUniqueLogin = await usersCollection.count({ login: newUser.login })
        if (checkUniqueLogin > 1) {
            return false
        }
        else {
            return await usersCollection.findOne({ id: newUser.id }, userViewModel)
        }

    },
    async deleteUser (id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}

