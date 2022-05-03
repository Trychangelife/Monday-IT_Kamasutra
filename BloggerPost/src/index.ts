import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
const port = 5000
app.use(cors())
app.use(bodyParser.json())

let bloggers = [
  { id: 1, name: 'Alex', youtubeUrl: 'Alex_TV' },
  { id: 2, name: 'Bob', youtubeUrl: 'Bob_TV' },
  { id: 3, name: 'Jon', youtubeUrl: 'Jon_TV' },
  { id: 4, name: 'Trevis', youtubeUrl: 'Trevis_TV' },
  { id: 5, name: 'Michael', youtubeUrl: 'Michael_TV' },
]

app.get('/', (req: Request, res: Response ) => {
    res.send('Hello: World!')
})

app.get('/bloggers', (req: Request, res: Response) => {
  res.status(200).send(bloggers)
})
app.get('/bloggers/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const blogger = bloggers.find((b) => {
    if (b.id === id) return true;
    else return false;
  })

  if (blogger !== undefined) {
    res.send(blogger)
  }
  else {
    res.send(404)
  }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})