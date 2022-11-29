import express, { NextFunction, Request, Response } from 'express'
import APIError from '../errors/APIError'
import User from '../models/users'
import validateUserFields from '../utility/validateUserFields'

const router = express.Router()

router.param("userId", async(req: Request, _: Response, next: NextFunction, id) => {
    const isUserFound = await User.findById(id).populate('tasks').exec()
    if(!isUserFound) {
        next(APIError.notFound("User data not found"))
        return
    }
    req.user = isUserFound
    next()

})

router.get('/', async(_: Request, res: Response) => {
    const usersData = await User.find().populate('tasks')
    res.json({usersData})
})

router.get("/:userId", (req:Request, res: Response) => {
    res.json({
        user: req.user
    })
})

router.get("/searchByFirstName/:firstName", async(req: Request, res: Response, next: NextFunction) => {
    console.log(req.params.firstName)
    console.log(await User.find({firstName: new RegExp(req.params.firstName) }))
    // await User.find({firstName: /req.params.firstName/}).populate('tasks').exec((err: any, result) => {
    //     if(err) {
    //         next(APIError.notFound("User data not found"))
    //         return
    //     }

    //     res.json({result})
    // })

})

router.post('/', async(req: Request, res: Response, next: NextFunction) => {
   const {firstName, lastName, userName, email, phoneNumber, extension, tasks} = req.body

    if(!firstName || !lastName || !userName || !email) {
        next(APIError.badRequest("firstName, lastName, userName and email are required fields"))
        return
    }

    let validation = await validateUserFields({userName, email, phoneNumber, tasks})

    if(validation.statusType === 'bad request') {
        next(APIError.badRequest(validation.message))
        return
    } else if(validation.statusType === 'not found') {
        next(APIError.notFound(validation.message))
    }

    const user = new User({
        firstName,
        lastName,
        userName,
        email,
        phoneNumber,
        extension,
        tasks
    })

    await user.save()

    res.json({
        message: 'New user is successfully created',
        user
    })
})

router.put("/:userId",async(req: Request, res: Response, next: NextFunction) => {
    const {firstName, lastName, userName, email, phoneNumber, extension, tasks} = req.body

    if(firstName.trim() === '' || lastName.trim() === '' || userName.trim() === '' || email.trim() === '') {
        next(APIError.badRequest("firstName, lastName, username and email should not be left blank"))
        return
    }

    let validation = await validateUserFields({userName, email, phoneNumber, tasks})

    if(validation.statusType === 'bad request') {
        next(APIError.badRequest(validation.message))
        return
    } else if(validation.statusType === 'not found') {
        next(APIError.notFound(validation.message))
    }

    const user = {
        firstName,
        lastName,
        userName,
        email,
        phoneNumber,
        extension,
        tasks
    }

    const updatedUser = await User.findByIdAndUpdate({_id: req.user.id},user)

    res.json({
        message: "Successfully updated user data",
        user: updatedUser
    })
})

router.delete("/:userId", async(req: Request, res: Response) => {
    const deletedUser = await User.findByIdAndDelete({_id:req.user.id})
    res.json({
        message: "Successfully deleted the data",
        user: deletedUser
    })
})

export default router