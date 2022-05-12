import { count } from "console";
import { NextFunction, request, Request, Response } from "express";
import { body, param, validationResult, ValidationError } from "express-validator";
import { type } from "os";
import { bloggers } from "../repositories/bloggers-repositories";
import { posts } from "../repositories/posts-repositories";

// const blackListIp = ["172.120.200.200", "172.84.214.2"]
// let counter: number = 0;
// export const CheckListIp = (req: Request, res: Response, next: NextFunction) => {
//     var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
//     const checkIp = blackListIp.find((a) => ip === a)
//     if (checkIp) {
//         res.status(403).send('Ip address added in black list')
//         return
//     }
//         next()
   
// }

// export const headersCounter = (req: Request, res: Response, next: NextFunction) => {
//     counter++
//     res.header('counter', counter.toString())
//     next()
   
// }
// export const checkContentType = (typeContent: string) => (req: Request, res: Response, next: NextFunction) => {
//     const checkContent = req.headers["content-type"]
//     if (checkContent === typeContent) {
//         next()
//     }
//     else {
//         res.status(400).send('bad request')
//     }
   
// }



export const schemaPostBlogger = [
    body('youtubeUrl').isLength({max:100}).matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$').withMessage('Its not URL, check again'),
    body('name').trim().isLength({min:3, max:15}).withMessage('You have bad name')
    
]


export const schemaPosts = [
    body('title').isLength({min:1, max:30}).trim().not().isEmpty(),
    body('content').isLength({min: 1, max: 1000}).trim().not().isEmpty(),
    body('shortDescription').isLength({min: 3, max: 100}),
    // param('bloggerId').exists().custom(a => check(a))
]



export const errorFormatter = ({ location, msg, param, value, nestedErrors }: ValidationError) => {
    return {
        message: msg,
        field: param
    }
  }

  export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    
    const errors = validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()) {
        res.status(400).json({errorsMessages: errors.array(), resultCode: 1} )
    }
    else {
        next()
    }
}