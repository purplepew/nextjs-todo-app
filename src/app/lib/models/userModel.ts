import mongoose, { Document, Model } from 'mongoose'

export interface IUser {
    email: string,
    picture: string,
    name: string,
    todos: mongoose.Schema.Types.ObjectId[]
}

export interface IUserInfo {
    UserInfo: {
        email: string,
        picture: string,
        name: string,
        id: string
    }
}

export interface IUserDocument extends IUser, Document {
    createdAt: Date,
    updatedAt: Date
}

const userSchema = new mongoose.Schema<IUserDocument>({
    email: {
        type: String,
    },
    picture: {
        type: String
    },
    name: {
        type: String
    },
    todos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ]
})

const User: Model<IUserDocument> = mongoose.models?.User || mongoose.model("User", userSchema)

export default User