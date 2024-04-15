const { fetchPendingVerificationsLogic, approveMentorLogic, rejectMentorLogic } = require("../logic/admin.logic");

const fetchPendingVerifications = async (req, res) => {
    const response = await fetchPendingVerificationsLogic();
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ result: response.success })
}

const approveMentor = async (req, res) => {
    const response = await approveMentorLogic(req.query);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}

const rejectMentor = async (req, res) => {
    const response = await rejectMentorLogic(req.query);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}

module.exports = {
    fetchPendingVerifications,
    approveMentor,
    rejectMentor
}