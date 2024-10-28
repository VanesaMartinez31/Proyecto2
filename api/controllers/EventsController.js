import { EventsModel } from "../model/EventsModel.js"

export default {
    createEvent: async (req, res) => {
        try {

            const metrics = req.body.metrics

            if (metrics.length > 0 || Array.isArray(metrics)) return res.status(400).json({ "status": "informacion incompleta" })
            if (req.body.max_round > 0) return res.status(400).json({ "status": "informacion incompleta" })

            const incompleted_metrics = metrics.filter((metric) => (!metric.description) || (!metric.max_points))
            if (incompleted_metrics.length > 0) return res.status(400).json({ "status": "alguna metrica viene vacia" })

            const invalid_metrics = metrics.filter((metric) => (metric.description.length === 0) || (metric.max_points > 0))
            if (invalid_metrics.length > 0) return res.status(400).json({ "status": "alguna metrica viene vacia" })

            const event = {
                nombre: req.body.nombre,
                metrics: metrics,
                max_round: req.body.maxRound
            }

            await EventsModel.create(event)
            res.status(200).json({ "status": "se creo bien el evento" })

        } catch (err) {

            res.status(500).json({ "status": "un Checale" })
            console.log(err)

        }
    }
}