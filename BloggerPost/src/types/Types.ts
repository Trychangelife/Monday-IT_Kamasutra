import { ObjectId } from "mongodb";

export type BloggersType = {
    id: string;
    name: string;
    youtubeUrl: string;
}

export type CommentsType = {
    commentId: string;
    content: string;
    userId: string;
    userLogin: string;
    addedAt: string;
    postId: string;
};


export type PostsType = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    bloggerId: string;
    bloggerName: string;
};

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


