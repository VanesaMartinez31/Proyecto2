import { Schema, model, Model } from "mongoose";

const GradesSchema = new Schema({

    id_group: {
        type: Schema.Types.ObjectId,
        required: true
    },
    round: {
        type: Number,
        required: true


    },
    id_Event: {

        type: Schema.Types.ObjectId,
        required: true
    },

    grades: [{

        id_metric: {
            type: Number,
            required: true
        },

        grade: {
            type: Number,
            required: true
        },
        id_judges: {
            type: Number,
            required: true
        }



    }]

})

export const GradesModel = model("grades", GradesSchema)