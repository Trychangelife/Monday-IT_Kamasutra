import { Request, Response, Router } from "express";

let bloggers = [
    { id: 1, name: 'Alex', youtubeUrl: 'Alex_TV' },
    { id: 2, name: 'Bob', youtubeUrl: 'Bob_TV' },
    { id: 3, name: 'Jon', youtubeUrl: 'Jon_TV' },
    { id: 4, name: 'Trevis', youtubeUrl: 'Trevis_TV' },
    { id: 5, name: 'Michael', youtubeUrl: 'Michael_TV' },
  ]
export const bloggersRouter = Router()




  bloggersRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(bloggers)
  })
  bloggersRouter.get('/:id', (req: Request, res: Response) => {
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
  bloggersRouter.post('/', (req: Request, res: Response) => {
  
    const newBlogger = {
      id: +(new Date()),
      name: req.body.name,
      youtubeUrl: req.body.youtubeUrl
    }
  
  
    const setErrors = ({ errorsMessages: [{ message: "string", field: "youtubeUrl" }, { message: "string", field: "name" }], resultCode: 1 })
    const str: any = newBlogger.youtubeUrl;
    function isURL(str: any) {
      var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
      return pattern.test(str);
    }
  
    if (isURL(str) !== true || newBlogger.name == undefined) {
      res.status(400).send(setErrors)
      return;
    }
  
    const checkName = newBlogger.name.replaceAll(' ', '').length
  //  /^[a-z0-9A-Z]+$/.test(newBlogger.name) === false
  // Возможно в этом выражении трабла - нужно смотреть
    if (req.body.name == undefined || checkName === 0) {
      res.status(400).send({ errorsMessages: [{ message: "string", field: "youtubeUrl" }, { message: "string", field: "name" }], resultCode: 1 })
    }
  
    if (newBlogger.name.length > 15 || newBlogger.youtubeUrl.length > 100) {
      return res.status(400).send({ errorsMessages: [{ message: "string", field: `${newBlogger.name.length > 15 ? "name" : "youtubeUrl"}` }], resultCode: 1 }) 
    }
    else {
      bloggers.push(newBlogger)
      res.status(201).send(newBlogger)
    }
  })
  
  // PUT Bloggers (Нужно посмотреть в чем дело, тест не проходит)
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
  
  // DELETE
  
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