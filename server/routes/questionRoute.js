const app = require('express');
const { askQuestion, fetchQuestions, fetchAnswersWithLikesDislikes, fetchQuestionWithDetails } = require('../controllers/questionController');
const { authentication } = require('../middlewares/authMiddleware')

const router = app.Router();

router.post('/ask', authentication, askQuestion)

router.get('/all', fetchQuestions)

router.get('/:id', fetchQuestionWithDetails)

router.get('/:id/answer/all', fetchAnswersWithLikesDislikes)

module.exports = router