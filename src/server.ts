import {config} from "dotenv"
import express from 'express'
import errorHandler from './middlewares/errorHandler'
import myLogger from './middlewares/logger'
import rateLimiter from './middlewares/rateLimiter'
import taskRouter from './routers/tasks'
import userRouter from "./routers/users"
import mongoose from 'mongoose'

config()

const app = express()
const port = 5005
const URL = process.env.ATLAS_URL as string

//middlewares
app.use(myLogger)
app.use(rateLimiter)
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//routers
app.use("/api/users/", userRouter)
app.use("/api/tasks/", taskRouter)

//ErrorHandler
app.use(errorHandler)

mongoose.connect(URL).then(() => {
    console.log('Database connected')
}).catch((err) => {
    if(err) {
        console.log('error in mongoose', err)
    }
})

app.listen(port,() => {
    console.log(`The application is running at port ${port}`)
})