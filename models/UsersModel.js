import { Schema, model, Model } from "mongoose";

const UserSchema = new Schema({



    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
        ,
        required: true
    },
    curp: {
        type: String
        ,
        required: true
    },
    rol: {
        type: String
        ,
        required: true,
        enum: ["administrator", "participant", "judge"],
        lowerCase: true
    },




})

export const UserModel = model("Users", UserSchema)