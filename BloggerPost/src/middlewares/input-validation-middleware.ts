import { NextFunction, request, Request, Response } from "express";
import { body, param, validationResult, ValidationError } from "express-validator";



export const schemaPostBlogger = [
    body('youtubeUrl').isLength({ max: 100 }).matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$').withMessage('Its not URL, check again'),
    body('name').trim().isLength({ min: 3, max: 15 }).withMessage('You have bad name')

]
export const schemaPosts = [
    body('title').isLength({ min: 1, max: 30 }).trim().not().isEmpty(),
    body('content').isLength({ min: 1, max: 1000 }).trim().not().isEmpty(),
    body('shortDescription').isLength({ min: 3, max: 100 }),
]

export const userInputModel = [
    body('login').exists().withMessage('login is required').isLength({min: 3, max: 10}).trim().withMessage('wrong login length'),
    body('password').exists().withMessage('password is required').isLength({min: 6, max: 20}).trim().withMessage('wrong password length')
]
export const errorFormatter = ({ location, msg, param, value, nestedErrors }: ValidationError) => {
    return {
        message: msg,
        field: param
    }
}
export const LoginInputModel = [
    body('login').isString().trim().exists(),
    body('password').isString().trim().exists(),
]
export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {


    const errors = validationResult(req).formatWith(errorFormatter)
    if (!errors.isEmpty()) {
        res.status(400).json({ errorsMessages: errors.array(), resultCode: 1 })
    }
    else {
        next()
    }
}

export const inputValidationMiddlewareForUser = (req: Request, res: Response, next: NextFunction) => {


    const errors = validationResult(req).formatWith(errorFormatter)
    if (!errors.isEmpty()) {
        res.status(400).json({ errorsMessages: errors.array(), resultCode: 0 })
    }
    else {
        next()
    }
}
