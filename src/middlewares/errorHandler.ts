import { NextFunction, Request, Response } from 'express'
import APIError from '../errors/APIError'
import {promises as fspromises} from 'fs'

const errorHandler = (err: typeof APIError, req: Request, res: Response, next:NextFunction) => {
    const filePath = './src/logs/errors.txt'
    const currentDate = new Date()
    const date = currentDate.toLocaleDateString()
    const time = currentDate.toLocaleTimeString()
    let errorMessage

    if(err instanceof APIError) {
        errorMessage = `Date: ${date}, Time: ${time}, Method: ${req.method}, Path: ${req.path}, ErrorCode: ${err.code}, ErrorMessage: ${err.message} \n`
        fspromises.appendFile(filePath, errorMessage).then(() => next()).catch((err) => {
            if(err) {
                next(new Error("Something went wrong"))
                return
            }
        })
        res.status(err.code).json({
            errorMessage: err.message
        })
        return
    }

    errorMessage =  `Date: ${date}, Time: ${time}, Method: ${req.method}, Path: ${req.path}, ErrorCode: 500, ErrorMessage: Internal Server Error \n`
    fspromises.appendFile(filePath,errorMessage).then(() => next()).catch((err) => {
        next(new Error("Something went wrong"))
        return
    })
    res.status(500).json({
        errorMessage: "Something went wrong"
    })
}

export default errorHandler