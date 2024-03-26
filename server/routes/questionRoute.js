const app = require('express');
const { askQuestion, fetchQuestions, fetchAnswersWithLikesDislikes, fetchQuestionWithDetails, submitAnswer, editAnswer, likeAnswer, deleteAnswer, replyAnswer } = require('../controllers/questionController');
const { authentication } = require('../middlewares/authMiddleware')

const router = app.Router();

router.post('/ask', authentication, askQuestion)

router.get('/all', fetchQuestions)

router.get('/:id', fetchQuestionWithDetails)

router.get('/:id/answer/all', fetchAnswersWithLikesDislikes)

router.post('/:id/answer', authentication, submitAnswer)

router.put('/:id/answer/:answer_id', authentication, editAnswer)

router.post('/:id/answer/:answer_id/like', authentication, likeAnswer)

router.delete('/:id/answer/:answer_id', authentication, deleteAnswer)

router.post('/:id/answer/:answer_id/reply', authentication, replyAnswer)

module.exports = router