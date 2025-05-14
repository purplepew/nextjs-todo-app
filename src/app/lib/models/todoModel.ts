import mongoose, { Document, Model } from 'mongoose'

export interface ITodo {
    title: string,
    completed?: boolean,
    userId: mongoose.Schema.Types.ObjectId | string
}

export interface ITodoDocument extends ITodo, Document {
    createdAt: Date,
    updatedAt: Date
}

const todoSchema = new mongoose.Schema<ITodoDocument>({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
    { timestamps: true }
)

const Todo: Model<ITodoDocument> = mongoose.models?.Todo || mongoose.model('Todo', todoSchema)

export default Todo