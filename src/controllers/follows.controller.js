import { addFollowDB , deleteFollowDB, checkIfFollowedDB} from "../repositories/follows.repositories.js";

export  async function addFollow(req,res) {
    const follower_user_id = res.locals.user;
    const {followed_user_id} = req.params
    try {
        const insert_follow = await addFollowDB(follower_user_id,followed_user_id)
        if (insert_follow) return res.send("ok")
        else return res.sendStatus(404)
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export  async function delFollow(req,res) {
    const follower_user_id = res.locals.user;
    const {followed_user_id} = req.params
    try {
        const deleted = await deleteFollowDB(follower_user_id,followed_user_id)
         if (deleted) return res.send("ok")
         else return res.sendStatus(404)
    } catch (error) {
        return res.status(500).send(error.message);
    }

}
export  async function checkIfFollowed(req,res) {
    const follower_user_id = res.locals.user;
    const {followed_user_id} = req.params
    try {
        const check = await checkIfFollowedDB(follower_user_id,Number(followed_user_id))
        res.send(check)
    } catch (error) {
        return res.status(500).send(error.message);
    }

}
