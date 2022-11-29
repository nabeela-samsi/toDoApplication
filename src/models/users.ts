import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    userName:{
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        $regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        unique: true
    },
    phoneNumber: {
        type: Number,
        unique: true,
        default: 0
    },
    extension: {
        type: Number,
        default: 0
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate:{
        type: Date,
        default: Date.now
    },
    tasks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Task'
    }
})

export default mongoose.model('User', userSchema)