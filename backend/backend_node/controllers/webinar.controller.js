const { registerForWebinarLogic, joinWebinarAsHostLogic, createWebinarLogic, fetchAllWebinarsLogic, joinWebinarAsParticipantLogic } = require("../logic/webinar.logic")

const createWebinar = async (req, res) => {
    const response = await createWebinarLogic(req.body, req.user);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}


const registerForWebinar = async (req, res) => {
    const response = await registerForWebinarLogic(req.body, req.user);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}


const joinWebinarAsHost = async (req, res) => {
    const response = await joinWebinarAsHostLogic(req.body, req.user);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}


const joinWebinarAsParticipant = async (req, res) => {
    const response = await joinWebinarAsParticipantLogic(req.body, req.user);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}


const fetchAllWebinars = async (req, res) => {
    const response = await fetchAllWebinarsLogic();
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}


module.exports = {
    createWebinar,
    registerForWebinar,
    joinWebinarAsHost,
    joinWebinarAsParticipant,
    fetchAllWebinars
}