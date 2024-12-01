import { EventModel } from "../models/EventsModel";
import { GradesModel } from "../models/GradesModel";






export default {

    createGrade: async (req, res) => {

        try {
            const idGroup = req.params.idGroup
            const group = await TeamsModel.findById(idGroup)
            if (!group) {
                return res.status(400).json({ msg: "grupo no encontrado" })


            }



            const round = req.body.round
            if (!round) {
                return res.status(400).json({ msg: "ronda invalida" })
            }
            const id_Event = req.params.id_Event
            const event = await EventModel.findById(id_Event)
            if (!event) {
                return res.status(400).json({ msg: "evento no encontrado" })
            }

            if (event.groups.includes(group._id)) {
                return res.status(400).json({ msg: "no hay correlacion entre el grupo y el evento" })

            }

            gradesFromDb.grades.filter((grade) => {
                grade.id_judge == req.body.id_judge
            })

            const grades = req.body.grades

        } catch (error) {

        }


    }


}