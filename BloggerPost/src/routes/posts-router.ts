import { Request, Response, Router } from "express";

let posts = [
    { id: 1, title: "string1", shortDescription: "str1", content: "JS", bloggerId: 1, bloggerName: "JS-learn" },
    { id: 2, title: "string2", shortDescription: "str2", content: "Python", bloggerId: 2, bloggerName: "Python-learn" },
    { id: 3, title: "string3", shortDescription: "str3", content: "Nest", bloggerId: 3, bloggerName: "Nest-learn" },
    { id: 4, title: "string4", shortDescription: "str4", content: "Express", bloggerId: 4, bloggerName: "Express-learn" },
    { id: 5, title: "string5", shortDescription: "str5", content: "NodeJS", bloggerId: 5, bloggerName: "NodeJS-learn" }
]
function doSomeString() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export const postRouter = Router()




postRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(posts)
})
postRouter.get('/:id', (req: Request, res: Response) => {
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

//POST Posts (Здесь обработчик ошибок под вопросом)
postRouter.post('/', (req: Request, res: Response) => {
    let newPosts = {
        id: +(new Date()),
        title: req.body.title,
        content: req.body.content,
        shortDescription: req.body.shortDescription,
        bloggerId: +req.body.bloggerId,
        bloggerName: doSomeString()
    }
    if (newPosts.title.length > 30 && newPosts.content.length > 1000) {
        return res.status(400).send({ errorsMessages: [{ message: "string", field: "title" }, { message: "string", field: "content" }], resultCode: 1 })
    }
    else if (newPosts.title.length > 30 || newPosts.shortDescription.length > 100 || newPosts.content.length > 1000) {
        return res.status(400).send({ errorsMessages: [{ message: "string", field: "shortDescription" }, { message: "string", field: "title" }], resultCode: 1 })
    }
    else {
        posts.push(newPosts)
        res.status(201).send(newPosts)
    }
})
// PUT Posts
postRouter.put('/:id', (req: Request, res: Response) => {
    const post = posts.find((i) => {
        const id = +req.params.id;
        if (i.id === id) return true
        else return false
    })
    const setErrors = ({
        errorsMessages: [
            {
                message: "string",
                field: "string"
            }
        ],
        resultCode: 0
    })

    if ((post !== undefined && post.title.length <= 30) || (post !== undefined && post.shortDescription.length <= 100) || (post !== undefined && post.content.length <= 1000)) {
        post.title = req.body.title
        post.shortDescription = req.body.shortDescription
        post.content = req.body.content
        post.bloggerId = +req.body.bloggerId
        res.status(204).send(post)
    }
    else if (post !== undefined) {
        res.status(400).send(setErrors)
    }
    else {
        res.send(404)
    }
})

// DELETE
postRouter.delete('/posts/:id', (req: Request, res: Response) => {
    const beforeFilter = [...posts].length
    posts = posts.filter((v) => v.id !== +req.params.id)
    if (beforeFilter === posts.length) {
        res.send(404)
    }
    else {
        res.send(204)
    }
})