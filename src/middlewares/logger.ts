import { NextFunction, Request, Response } from 'express'
import fs from 'fs'

const myLogger = (req: Request, _: Response, next: NextFunction) => {
    const filePath = './src/logs/requests.txt'
    const currentDate = new Date()
    const date = currentDate.toLocaleDateString()
    const time = currentDate.toLocaleTimeString()
    const requestData = `Date: ${date}, Time: ${time}, Method: ${req.method}, Path: ${req.path} \n`

    fs.appendFile(filePath,requestData,(err) => {
        if(err) {
            next(new Error('Something went wrong'))
            return
        }
        next()
    })
}

export default myLogger