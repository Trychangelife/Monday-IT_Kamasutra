import dotenv from "dotenv"
dotenv.config()
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { bloggersRouter } from './routes/bloggers-router';
import { postRouter } from './routes/posts-router';
import { runDb } from './repositories/db';
import { usersRouter } from "./routes/users-router"
import { authRouter } from "./routes/auth-router"
import { commentsRouter } from "./routes/comments-router"
import { emailRouter } from "./routes/email-router"

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(bodyParser.json())
app.use('/bloggers', bloggersRouter)
app.use('/posts', postRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/email', emailRouter)


// app.listen(port, () => {
//   console.log(`why did you call me to the port ${port} ?`)
// })

const startApp = async () => {
  await runDb()
  app.listen(port, () => {
    console.log(`Server listening on post: ${port}`)
  })
}

startApp()