import {Schema, model} from "mongoose"

const TeamsSchema = new Schema ([
    {
        nombre:{
            type:String,
            required:true
        }
    },

    {
        Participantes:[]
    },

    {
        Lider:{
            type:Schema.type.ObjectId,
            required: true
        }
    },

    {
        Ronda:{
            type:Number,
            required: true
        }
    },

    {
        Calificacion:[]
    }
])

export const TeamsModel = model ("Teams", TeamsModel);  