const { askQuestionLogic, fetchQuestionsLogic, fetchAnswersWithLikesDislikesLogic, fetchQuestionDetailsLogic } = require("../logic/questionLogic")

const askQuestion = async (req, res) => {
    const response = await askQuestionLogic(req.body, req.user)
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ result: response.result })
}

const fetchQuestions = async (req, res) => {
    const response = await fetchQuestionsLogic()
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ result: response.result })
}

const fetchQuestionWithDetails = async (req, res) => {
    const response = await fetchQuestionDetailsLogic(req.params)
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ result: response.result })
}

const fetchAnswersWithLikesDislikes = async (req, res) => {
    const response = await fetchAnswersWithLikesDislikesLogic(req.params);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ result: response.result })
}

module.exports = {
    askQuestion,
    fetchQuestions,
    fetchQuestionWithDetails,
    fetchAnswersWithLikesDislikes
}