import { EventModel } from "../models/EventsModel.js";
import { TeamsModel } from "../models/TeamsModel.js";

export default {

    createTeam: async (req, res) => {

        try {
            const team = {

                name: req.body.name,
                id_members: req.body.id_members,
                leader: req.bodi.id_leader
            }

            await TeamsModel.create(team)
            return res.status(200).json({ msg: "Grupo creado con exito" })
        } catch (error) {
            console.log(error)
            return res.status(400).json({ msg: "ha fallado la creacion del equipo" })
        }


    },

    registerEvent: async (req, res) => {
        try {
            const idTeam = req.params.id
            const Team = await TeamsModel.findById(idTeam)
            if (!Team) {
                return res.status(400).json({ msg: "el equipo no existe" })
            }

            const idEvent = req.params.idEvent
            const event = await EventModel.findById(idEvent)
            if (!event) {

                return res.status(400).json({ msg: "el evento no existe" })

            }
            await EventModel.findByIdAndUpdate(idEvent, {
                $push: {

                    "groups": idTeam
                }
            })
            return res.status(200).json({ msg: "el qeuipo se inscribio con exito" })


        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: "ocurrio un error al crear el equipo" })
        }

    }
}