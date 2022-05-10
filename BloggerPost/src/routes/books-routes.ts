import { Request, Response, Router } from "express";
import { booksRepository } from "../repositories/books-repository";



export const booksRouter = Router()


booksRouter.get('/', (req: Request, res: Response) => {
    const includeFields = req.query.includeFields as string
    // const paramsArray = includeFields.split(',')
    // let books = booksRepository.getBooks();
    // let books2 = books.map(b => {
    //     for(let i = 0; paramsArray.length < i; i++) {
    //         return {[paramsArray[i]]: }
    //     }
    // })
    res.status(200).send(includeFields)
})

booksRouter.get('/search/:contentFragment', (req: Request, res: Response) => {
    const contentFragment = req.params.contentFragment;
    const books = booksRepository.find(contentFragment);
    res.status(200).send(books)
})

booksRouter.get('/search', (req: Request, res: Response) => {
    const  contentFragment = req.query.contentFragment as string;
    const books = booksRepository.find(contentFragment);
    res.status(200).send(books)
})
