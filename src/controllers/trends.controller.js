import getTrendsInDB from "../repositories/trends.repository.js"

export default async function getTrends(req,res) {
    try {
        const {rowCount, rows: trends} = await getTrendsInDB()
        if (!rowCount) return res.sendStatus(404)
        else return res.send(trends)
    } catch (error) {
        return res.status(500).send(error.message);
    }
}