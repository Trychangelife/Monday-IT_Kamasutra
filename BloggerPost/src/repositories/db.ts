import dotenv from "dotenv"
dotenv.config()
import { MongoClient, ServerApiVersion } from "mongodb";
import { BloggersType } from "../types/BloggersType";
import { CommentsType } from "../types/CommentsType";
import { PostsType } from "../types/PostsType";
import { UsersType } from "../types/UsersType";



const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
};

const uri:any = process.env.mongoURI

const client = new MongoClient(uri, options)
export const db = client.db("social_network")
export const bloggersCollection = db.collection<BloggersType>("bloggers")
export const postsCollection = db.collection<PostsType>("posts") 
export const usersCollection = db.collection<UsersType>("users")
export const commentsCollection = db.collection<CommentsType>("comments")
export async function runDb () {
try {
    await client.connect() 
    console.log("Connected successfully to mongo server")
    // await listDatabases(client)
} catch (e) {
    console.error(e);
}}

