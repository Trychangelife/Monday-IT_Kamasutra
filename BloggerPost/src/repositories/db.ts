import dotenv from "dotenv"
dotenv.config()
import { ObjectId, ServerApiVersion } from "mongodb";
import { BloggersType } from "../types/Types";
import { CommentsType } from "../types/Types";
import { PostsType } from "../types/Types";
import { AuthDataType, ConfirmedAttemptDataType, EmailSendDataType, RefreshTokenStorageType, RegistrationDataType, UsersType } from "../types/Types";
import mongoose from "mongoose";



const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
};
const uri:any = process.env.mongoURI


const bloggerSchema = new mongoose.Schema<BloggersType>({
    id: {type:String, required:true},
    name: {type:String, required:true},
    youtubeUrl: {type:String, required:true}
})
const postSchema = new mongoose.Schema<PostsType>({
    id: {type:String, required:true},
    title: {type:String},
    shortDescription: {type:String},
    content: {type:String},
    bloggerId: {type:String, required:true},
    bloggerName: {type:String, required:true}
})
const commentsSchema = new mongoose.Schema<CommentsType>({
    commentId: {type:String, required:true},
    content: {type:String, required:true},
    userId: {type:String, required:true},
    userLogin: {type:String, required:true},
    addedAt: {type:String, required:true},
    postId: {type:String, required:true}
})

const usersSchema = new mongoose.Schema<UsersType>({
    _id: {type: ObjectId, required: true},
    id: {type: String, required: true},
    login: {type: String, required: true},
    email: {type: String, required: true},
    accountData: {
        passwordHash: {type: String, required: true},
        passwordSalt: {type: String, required: true},
        
    },
    emailConfirmation: {
        codeForActivated: {type: String, required: true},
        activatedStatus: {type: String, required: true}
    }
})
const registrationDataSchema = new mongoose.Schema<RegistrationDataType>({
    ip: {type: String, required: true},
    dateRegistation: {type: Date, required: true},
    email: {type: String, required: true}
})
const authDataSchema = new mongoose.Schema<AuthDataType>({
    ip: {type: String, required: true},
    tryAuthDate: {type: Date, required: true},
    login: {type: String, required: true}
})
const emailSendSchema = new mongoose.Schema<EmailSendDataType>({
    ip: {type: String, required: true},
    emailSendDate: {type: Date, required: true},
    email: {type: String, required: true}
})
const codeConfirmSchema = new mongoose.Schema<ConfirmedAttemptDataType>({
    ip: {type: String, required: true},
    tryConfirmDate: {type: Date, required: true},
    code: {type: String, required: true}
})
const refreshTokenSchema = new mongoose.Schema<RefreshTokenStorageType>({
    userId: {type: String, required: true},
    refreshToken: {type: String, required: true},
})


export const bloggerModel = mongoose.model('bloggers', bloggerSchema)
export const postsModel = mongoose.model('posts', postSchema)
export const usersModel = mongoose.model('users', usersSchema)
export const commentsModel = mongoose.model('comments', commentsSchema)
export const registrationDataModel = mongoose.model('registrationData', registrationDataSchema)
export const authDataModel = mongoose.model('authData', authDataSchema)
export const emailSendModel = mongoose.model('emailSend', emailSendSchema)
export const codeConfirmModel = mongoose.model('confirmAttemptLog', codeConfirmSchema)
export const refreshTokenModel = mongoose.model('refreshToken', refreshTokenSchema)


export async function runDb () {
try {
    await mongoose.connect(uri, options)
    console.log("Connected successfully to mongo server")
} catch (e) {
    console.error(e);
    await mongoose.disconnect()
}}

