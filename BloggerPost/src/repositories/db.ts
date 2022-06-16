import dotenv from "dotenv"
dotenv.config()
import { MongoClient, ServerApiVersion } from "mongodb";
import { BloggersType } from "../types/BloggersType";
import { CommentsType } from "../types/CommentsType";
import { PostsType } from "../types/PostsType";
import { AuthDataType, ConfirmedAttemptDataType, EmailSendDataType, RefreshTokenStorageType, RegistrationDataType, UsersType } from "../types/UsersType";
import mongoose from "mongoose";



const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
};
const uri:any = process.env.mongoURI
const client = new MongoClient(uri, options)


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



export const db = client.db("social_network")
export const bloggerModel = mongoose.model('bloggers', bloggerSchema)
export const postsModel = mongoose.model('posts', postSchema)
export const usersCollection = db.collection<UsersType>("users")
export const commentsModel = mongoose.model('comments', commentsSchema)
export const registrationDataCollection = db.collection<RegistrationDataType>("registrationData")
export const authDataCollection = db.collection<AuthDataType>("authData")
export const emailSendCollection = db.collection<EmailSendDataType>("emailSend")
export const codeConfirmCollection = db.collection<ConfirmedAttemptDataType>("confirmAttemptLog")
export const refreshTokenCollection = db.collection<RefreshTokenStorageType>("refreshToken")
export async function runDb () {
try {
    await client.connect() 
    await mongoose.connect(uri)
    console.log("Connected successfully to mongo server")
    // await listDatabases(client)
} catch (e) {
    console.error(e);
    await mongoose.disconnect()
}}

