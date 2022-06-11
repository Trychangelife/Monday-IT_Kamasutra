import { ObjectId } from "mongodb";

export type UsersType = {
    _id: ObjectId;
    id: string;
    accountData: {
        login: string;
        passwordHash: string;
        passwordSalt: string;
        email: string
    }
    emailConfirmation: {
        codeForActivated: string
        activatedStatus: boolean
        expirationDate: object
    }
};

export type RegistrationDataType = {
    ip: string
    dateRegistation: Date
    email: string
}



// export type UsersType = {
//     _id: ObjectId;
//     id: string;
//     login: string;
//     passwordHash: string;
//     passwordSalt: string;
//     email: string
//     codeForActivated: string
//     activatedStatus: boolean
// };


