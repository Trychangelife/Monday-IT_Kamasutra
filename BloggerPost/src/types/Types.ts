import { ObjectId } from "mongodb";
import { uuid } from "uuidv4";

export class Blogger {
    constructor(public id: string, public name: string, public youtubeUrl: string ) {
    }
}
export type BloggersType = {
    id: string;
    name: string;
    youtubeUrl: string;
}


export class Comments {
    constructor(public commentId: string, public content: string, public userId: string, public userLogin: string, public addedAt: string,public postId: string ) {
    }
}

export type CommentsType = {
    commentId: string;
    content: string;
    userId: string;
    userLogin: string;
    addedAt: string;
    postId: string;
};


export class Post {
    constructor(public id: string, public title: string, public shortDescription: string, public content: string, public bloggerId: string,public bloggerName: string ) {
    }
}
export type PostsType = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    bloggerId: string;
    bloggerName: string;
};


export class User { 
    constructor(
        public _id: ObjectId, 
        public id: string, 
        public accountData: {login: string, passwordHash: string, passwordSalt: string, email:string},
        public emailConfirmation: {codeForActivated: string, activatedStatus: boolean}) {}
}
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
    }
};



export type RegistrationDataType = {
    ip: string
    dateRegistation: Date
    email: string
}

export type AuthDataType = {
    ip: string
    tryAuthDate: Date
    login: string
}

export type EmailSendDataType = {
    ip: string
    emailSendDate: Date
    email: string
}

export type ConfirmedAttemptDataType = {
    ip: string
    tryConfirmDate: Date
    code: string
}

export type RefreshTokenStorageType = {
    userId: string
    refreshToken: string
}


