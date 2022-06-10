import { ObjectId } from "mongodb";

export type UsersType = {
    _id: ObjectId;
    id: string;
    login: string;
    passwordHash: string;
    passwordSalt: string;
    password: string;
};
