import { Schema, model } from "mongoose";

const UserSchema = new Schema([
    {
        nombre:{
            type:String,
            required: true
        }
    },

    {
        contraseña:{
            type:String,
            required:true
        }
    },

    {
        correo:{
            type:String,
            required: true
        }
    },

    {
        curp:{
            type:String,
            required: true
        }
    },

    {
        rol:{
            type:String,
            enum:["administrator", "participantes", "judge"],
            lowercase: true,
            required: true
        }
    }

])

export const UsuariosModel = model("Usuarios", UserSchema)