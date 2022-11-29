import User from "../models/users";
import Task from "../models/tasks"

const validateUserFields = async (data: any) => {
    const {userName, email, phoneNumber, tasks} = data

    const userNameExists = await User.find({$or: [{userName},{phoneNumber},{email}]})
    if(userNameExists.length) {
        return ({
            message: "userName, email and phoneNumber should be unique",
            statusType: "bad request"
        })
    }

    if(tasks) {
        let uniqueTasks = tasks.filter((item: string,index: number) => tasks.indexOf(item) === index)
        if(tasks.length !== uniqueTasks.length) {
            return ({
                message : "tasks should have unique value",
                statusType : "bad request"
            })

        }
    }

    try{
        await Task.find({_id: {$all:tasks}})
    } catch(err: any) {
        return ({
            message : `No task found for id: ${err.value}`,
            statusType : "not found"
        })
    }

    return ({
        message: '',
        statusType: ''
    })
}

export default validateUserFields