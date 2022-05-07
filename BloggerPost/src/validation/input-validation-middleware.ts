import e, { NextFunction, Request, Response } from "express";
import { body, param, validationResult, ValidationError } from "express-validator";


export const schemaPostBlogger = [
    body('youtubeUrl').isLength({max:100}).matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$').withMessage('Its not URL, check again'),
    body('name').trim().isLength({min:3, max:15}).withMessage('You have bad name')
    
]

const errorFormatter = ({ location, msg, param, value, nestedErrors }: ValidationError) => {
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