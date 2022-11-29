import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import APIError from '../errors/APIError'
import Task from '../models/tasks'
import User from '../models/users'

const router = express.Router()

router.param("taskId", async(req: Request, res: Response, next: NextFunction, id) => {
    const isRecordFound = await Task.findById(id).exec()
    if(!isRecordFound) {
        next(APIError.notFound("Task data not found"))
        return
    }
    req.task = isRecordFound
    next()

})

router.get('/',async(_: Request, res: Response) => {
    const task = await Task.find()
    res.json({
        task
    })
})

router.get('/:taskId', async(req: Request, res: Response) => {
    res.json({
        task: req.task
    })
})

router.post('/', async(req: Request, res: Response, next: NextFunction) => {
    const {name, description} = req.body

    if(!name || !description){
        next(APIError.badRequest("name and descriptions are required"))
        return
    }

    const isNameUnique = await Task.find({name})
    if(isNameUnique.length) {
        next(APIError.badRequest("name should be unique"))
        return
    }

    const task = new Task({
        name,
        description
    })

    await task.save()
    res.json({
        message: 'Successfully created the task',
        task
    })
})

router.put("/:taskId", async(req: Request, res: Response, next: NextFunction) => {
    const {name, description} = req.body

    if(name.trim() === '' || description.trim() === '') {
        next(APIError.badRequest("name and description should not be left blank"))
        return
    }

    const isNameUnique = await Task.find({name})
    if(isNameUnique.length) {
        next(APIError.badRequest("name should be unique"))
        return
    }

    const updatedTask = await Task.findByIdAndUpdate(req.task.id,{name, description})

    res.json({
        message: "Successfully updated the task",
        task: updatedTask
    })
})

router.delete("/:taskId", async(req: Request, res: Response) => {
    await User.updateMany({}, { $pull:{tasks: new mongoose.Types.ObjectId(req.task.id)}})
    const deletedTask = await Task.findByIdAndDelete(req.task.id).exec()
    res.json({
        message: "Successfully deleted the task",
        task: deletedTask
    })
})

export default router