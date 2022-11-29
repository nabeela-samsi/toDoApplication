import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdDate:{
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Task', taskSchema)