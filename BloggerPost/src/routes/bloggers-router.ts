import { Request, Response, Router } from "express";
import { bloggerRepository } from "../repositories/bloggers-repositories";


export const bloggersRouter = Router()

let bloggers = [
  { id: 1, name: 'Alex', youtubeUrl: 'Alex_TV' },
  { id: 2, name: 'Bob', youtubeUrl: 'Bob_TV' },
  { id: 3, name: 'Jon', youtubeUrl: 'Jon_TV' },
  { id: 4, name: 'Trevis', youtubeUrl: 'Trevis_TV' },
  { id: 5, name: 'Michael', youtubeUrl: 'Michael_TV' },
]


  bloggersRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(bloggers)
  })
  bloggersRouter.get('/:id', (req: Request, res: Response) => {
    const findBlogger = bloggerRepository.targetBloggers(+req.params.id)
    if (findBlogger !== undefined) {
      res.status(200).send(findBlogger)
    }
    else {
      res.send(404)
    }
  })
  
  bloggersRouter.post('/', (req: Request, res: Response) => {
    const createrPerson = bloggerRepository.createBlogger(req.body.name, req.body.youtubeUrl)
    const setErrors = ({ errorsMessages: [{ message: "string", field: "youtubeUrl" }, { message: "string", field: "name" }], resultCode: 1 })
    if (createrPerson === 'invalide format' ) {
      res.status(400).send(setErrors)
      return;
    }
    if (createrPerson === 2) {
      res.status(400).send({ errorsMessages: [{ message: "string", field: "youtubeUrl" }, { message: "string", field: "name" }], resultCode: 1 })
    }
    if (createrPerson === 3) {
      return res.status(400).send(setErrors) 
    }
    else {
      res.status(201).send(createrPerson)
    }
  })
  
  bloggersRouter.put('/:id', (req: Request, res: Response) => {
    const blogger = bloggers.find((i) => {
      const id = +req.params.id;
      if (i.id === id) return true
      else return false
    })
    // const checkName = (blogger == undefined || blogger.name == undefined)
    // const regex = new RegExp(`^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$`)
    const setErrors = ({ errorsMessages: [{ message: "string", field: "youtubeUrl" }, { message: "string", field: "name" }], resultCode: 1 })
    const str: any = blogger?.youtubeUrl;
    function isURL(str: any) {
      var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
      return pattern.test(str);
    }
  
    if (isURL(str) !== true) {
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
  
  bloggersRouter.delete('/:id', (req: Request, res: Response) => {
    const beforeFilter = [...bloggers].length
    bloggers = bloggers.filter((v) => v.id !== +req.params.id)
    if (beforeFilter === bloggers.length) {
      res.send(404)
    }
    else {
      res.send(204)
    }
  })