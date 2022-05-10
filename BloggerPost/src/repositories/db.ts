import { MongoClient } from "mongodb";

const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";

export const client = new MongoClient(mongoUri);

export async function runDb() {
    try {
        //Connect the client to the server
        await client.connect();
        // Establish (Создавать) and verify connection
        await client.db("bloggers").command({ ping: 1});
        console.log("Connected successfully to mongo server");
    }
    catch {
        console.log("can't connect to DB")
        //Ensures that the client will close when you finish/error
        await client.close()
    }
}