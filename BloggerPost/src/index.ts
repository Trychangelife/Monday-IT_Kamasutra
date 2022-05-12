import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { bloggersRouter } from './routes/bloggers-router';
import { postRouter } from './routes/posts-router';
import { booksRouter } from './routes/books-routes';
import { runDb } from './repositories/db';
// import { checkContentType } from './validation/input-validation-middleware';

const app = express()
const port = process.env.PORT || 5000;
// app.use(headersCounter)
// app.use(CheckListIp)
app.use(cors())
app.use(bodyParser.json())
app.use('/bloggers', bloggersRouter)
app.use('/posts', postRouter)
app.use('/books', booksRouter)
// app.use(checkContentType('application/json'))

app.listen(port, () => {
  console.log(`why did you call me to the port ${port} ?`)
})

// const startApp = async () => {
//   await runDb()
//   app.listen(port, () => {
//     console.log(`Server listening on post: ${port}`)
//   })
// }

// startApp()