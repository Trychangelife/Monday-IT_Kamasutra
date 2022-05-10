import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { bloggersRouter } from './routes/bloggers-router';
import { postRouter } from './routes/posts-router';
import { booksRouter } from './routes/books-routes';
import { runDb } from './repositories/db';

const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(bodyParser.json())

app.use('/bloggers', bloggersRouter)
app.use('/posts', postRouter)
app.use('/books', booksRouter)

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

const startApp = async () => {
  await runDb()
  app.listen(port, () => {
    console.log(`Server listening on post: ${port}`)
  })
}

startApp()