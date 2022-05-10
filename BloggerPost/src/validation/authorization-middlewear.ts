import { NextFunction, request, Request, Response } from "express";
var base64 = require('base-64')
var utf8 = require('utf8')


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const headerAuth = req.headers.authorization
    var userNamePassword = 'admin:qwerty'
    var bytes = utf8.encode(userNamePassword)
    var encoded = 'Basic ' + base64.encode(bytes)
    if (!headerAuth || headerAuth.indexOf('Basic ') === - 1) {
        res.status(401).json({Message: 'Missing Authorization Header'})
    }
    else if (encoded !== headerAuth) {
        res.status(401).json({Message: 'Incorrect password/login'})
    }
    else {
        next()
    }
}