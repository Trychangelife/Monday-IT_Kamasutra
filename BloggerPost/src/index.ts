import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(bodyParser.json())

let bloggers = [
  { id: 1, name: 'Alex', youtubeUrl: 'Alex_TV' },
  { id: 2, name: 'Bob', youtubeUrl: 'Bob_TV' },
  { id: 3, name: 'Jon', youtubeUrl: 'Jon_TV' },
  { id: 4, name: 'Trevis', youtubeUrl: 'Trevis_TV' },
  { id: 5, name: 'Michael', youtubeUrl: 'Michael_TV' },
]

let posts = [
  { id: 1, title: "string1", shortDescription: "str1", content: "JS", bloggerId: 1, bloggerName: "JS-learn"},
  { id: 2, title: "string2", shortDescription: "str2", content: "Python", bloggerId: 2, bloggerName: "Python-learn"},
  { id: 3, title: "string3", shortDescription: "str3", content: "Nest", bloggerId: 3, bloggerName: "Nest-learn"},
  { id: 4, title: "string4", shortDescription: "str4", content: "Express", bloggerId: 4, bloggerName: "Express-learn"},
  { id: 5, title: "string5", shortDescription: "str5", content: "NodeJS", bloggerId: 5, bloggerName: "NodeJS-learn"}
]


// GET Bloggers
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
    res.status(200).send(blogger)
  }
  else {
    res.send(404)
  }
})

//POST Bloggers
app.post('/bloggers', (req: Request, res:Response) => {
  const newBlogger = {
    id: +(new Date()),
    name: req.body.name,
    youtubeUrl: req.body.youtubeUrl
  }
  if ((typeof newBlogger.id) !== "number" || (typeof newBlogger.name) !== "string" || (typeof newBlogger.youtubeUrl) !== "string" ) {
    return res.send(400)
  }
  else {
  bloggers.push(newBlogger)
  res.status(201).send(newBlogger)
}
})

// PUT Bloggers (Нужно посмотреть в чем дело, тест не проходит)
app.put('/bloggers/:id', (req: Request, res: Response) => {
  const blogger = bloggers.find((i) => {
    const id = +req.params.id;
    if (i.id === id) return true
    else return false
  })
  const regex = new RegExp("^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$")
  const setErrors = ([
    {
      field: "youtubeUrl",
      message: `The field must match the regular expression ${regex}.`
    }
  ])
  const str:any = blogger?.youtubeUrl;

  if (regex.test(str) === true) {
    res.status(400).send(setErrors)
    return;
  }
  else if (blogger !== undefined) {
    blogger.name = req.body.name
    blogger.youtubeUrl = req.body.youtubeUrl
    res.status(204).send(blogger)
    return;
  }
  else {
    res.send(404)
  }
})

// DELETE

app.delete('/bloggers/:id', (req: Request, res: Response) => {
  const beforeFilter = [...bloggers].length
  bloggers = bloggers.filter((v) => v.id !== +req.params.id)
  if (beforeFilter === bloggers.length) {
    res.send(404)
  }
  else {
    res.send(204)
  }
})

//=========================================================================================== POST
// GET

app.get('/posts', (req: Request, res: Response) => {
  res.status(200).send(posts)
})
app.get('/posts/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const targetPost = posts.find((b) => {
    if (b.id === id) return true;
    else return false;
  })

  if (targetPost !== undefined) {
    res.status(200).send(targetPost)
  }
  else {
    res.send(404)
  }
})

//POST Bloggers
app.post('/posts', (req: Request, res:Response) => {
  const newPosts = {
    id: +(new Date()),
    title: req.body.title,
    content: req.body.content,
    shortDescription: req.body.shortDescription,
    bloggerId: req.body.bloggerId
  }
  if ((typeof newPosts.bloggerId) !== "number" || (typeof newPosts.title) !== "string" || (typeof newPosts.shortDescription) !== "string" || (typeof newPosts.content) !== "string") {
    return res.send(400)
  }
  else {
  posts.push(newPosts)
  res.status(201).send(newPosts)
}
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})