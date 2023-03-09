import getTrendsInDB from "../repositories/trends.repository.js"

export default async function getTrends(req,res) {
    try {
        const {rows: trends} = await getTrendsInDB()
        return res.send(trends)
    } catch (error) {
        return res.status(500).send(error.message);
        
    }
}