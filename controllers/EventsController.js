import { EventModel } from "../models/EventsModel.js";
import { TeamsModel } from "../models/TeamsModel.js";
import { GradesModel } from "../models/GradesModel.js";

const validateEvent = (metrics, name, max_round) => {
    const data = {
        isValid: false,
        msg: ""
    }
    if (!Array.isArray(metrics)) {
        data.msg = "Metricas no es un arreglo"
        return data
    }

    if (metrics.length === 0) {
        data.msg = "metricas tiene vacio"
        return data
    }

    const incomplete = metrics.filter(
        (metric) => !metric.description || !metric.max_points
    );

    if (incomplete.length > 0) {
        data.msg = "Metrics está incompleto"
        return data
    }

    const invalidMetrics = metrics.filter(
        (metric) =>
            metric.description.trim().length === 0 || metric.max_points <= 0
    );

    if (invalidMetrics.length > 0) {
        data.msg = "alguna de las metricas es invalida"
        return data
    }

    if (!req.body.name && !req.body.name.length) {
        data.msg = "el nombre del evento esta vacio"
        return data
    }

    if (!max_round) {
        data.msg = "num maxico de rondas invalido"
        return data

    }
    data.isValid = true
    return data
}






export default {
    createEvent: async (req, res) => {
        try {
            const { metrics, name, max_round } = req.body
            const { isValid, msg } = validateEvent(req.body.metrics, req.body.name, req.body.max_round)

            if (!isValid) {
                return res.status(400).json({ msg })
            }
            const event = {
                name: req.body.name,
                metrics,
                max_round: req.body.max_round,
            };

            await EventModel.create(event);
            res.status(201).json({ msg: "Evento creado con éxito" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Error al crear el evento" });
        }

    },

    updateEvent: async (req, res) => {
        try {
            const idEvent = req.params.id;
            const event = await EventModel.findById(idEvent);
            if (!event) {
                return res.status(400).json({ msg: "El evento no existe" })
            }
            const { metrics, name, max_round } = req.body
            const { isValid, msg } = validateEvent(req.body.metrics, req.body.name, req.body.max_round)

            if (!isValid) {
                return res.status(400).json({ msg })
            }

            await EventModel.findByIdAndUpdate(idEvent, {

                $set: {
                    metrics,
                    name,
                    max_round
                }
            })
            return res.status(200).json({ msg: "Evento creado exitosamente" })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Error wey" });
        }
    },
    changeStatus: async (req, res) => {
        try {
            const idEvent = req.params.id;
            const event = await EventModel.findById(idEvent);
            if (!event) {
                return res.status(400).json({ msg: "El evento no existe" })
            }
            if (!["pending", "active", "done"].includes(req.body.status.toLowerCase())) {
                return res.status(400).json({ msg: "El status incluido no es aceptable" })
            }
            await EventModel.findByIdAndUpdate(idEvent, {
                $set: {
                    status: req.body.status
                }
            })
            return res.status(200).json({ msg: "Se actualizo el status del evento" })
        } catch (error) {
            return res.status(500).json({ msg: "Error al actualizar el status del evento" })
        }
    }




}

changeRound: async (req, res) => {
    try {

        const idEvent = req.params.id;
        const event = await EventModel.findById(idEvent);
        if (!event) {
            return res.status(400).json({ msg: "El evento no existe" })
        }
        const teamsPerRound = req.query.maxTeams ? req.query.maxTeams : 5

        const { groups } = event
        const teamsWithFinalGrade = []

        for (const group of groups) {
            const GradesPerMetric = []
            const GradesPerGroup = await GradesModel.FindOne({ id_event: event._id, id_group: group })

            const { grades } = await GradesModel.FindOne({ id_event: event._id, id_group: group })

            const alreadyChecked = []




            for (const grade of grades) {
                const filteredGrades = grades.filter(item => grade.id_metric === item.id_metric && !alreadyChecked.includes(grade.id_metric))
                console.log(filteredGrades)

                let GradesPerMetric = 0
                if (filteredGrades.length > 0) {
                    GradesPerMetric = filteredGrades.reduce((a, b) => a.grade + b.grade)
                }
                if (!alreadyChecked.includes(grade.id_metric)) {
                    alreadyChecked.push(filteredGrades[0].id_metric)
                    GradesPerMetric.push({
                        id_metric: grade.id_metric,
                        grade: GradesPerMetric / filteredGrades.length
                    })
                }

            }

            const finalGrade = GradesPerMetric.reduce((a, b) => a.grade + b.grade) / GradesPerMetric.length
            console.log(finalGrade)
            teamsWithFinalGrade.push({
                idTeam: group,
                finalGrade,
                GradesPerMetric

            })
        }

        const sortedTeams = teamsWithFinalGrade.sort((a,b)=>a-b)

        const passedTeams = sortedTeams.slice(0,teamsPerRound)

        for (const team of passedTeams) {
            await GradesModel.findByIdAndUpdate(team.idTeam,{
                $set:{
                    round: req.body.round,
                    grades:[]
                }
            })
        }

        const nextTeams = passedTeams.map((i)=>i.idTeam)

        await EventModel.findById(event._id,{
            $set:{
                groups:nextTeams,
                round:req.body.round
            }
        })

        await TeamsModel.findByIdAndUpdate(team.idTeam,{
            $set: {
                round: req.body.round
            }
        })

        
        return res.json({msg:"ronda cambiada con exito"})
    } catch (error) {
        return res.status(500).json({ msg: "error al cambiar de ronda" })


    }



}




