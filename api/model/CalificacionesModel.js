import { Schema, model } from "mongoose";

const CalifSchema = new Schema ([
    {
        id_Equipo:{
            type:Schema.Types.ObjectId,
            required:true
        }
    },

    {
        ronda:{
            type:Number,
            required:true
        }
    },

    {
        id_evento:{
            type:Schema.Types.ObjectId,
            required:true
        }
    },

    {
        Calificacion:[
            {
                id_metricas:{
                    type:Schema.Types.ObjectId,
                    required:true
                }
            },

            {
                grade:{
                    type:Number,
                    required: true
                }
            },

            {
                id_judge:{
                    type:Schema.Types.ObjectId,
                    required:true
                }
            }
        ]
    }
])

export const CalifModel = model("Calificaciones", CalifModel)