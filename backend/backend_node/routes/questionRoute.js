const app = require("express");
const {
  askQuestion,
  fetchQuestions,
  fetchAnswersWithLikesDislikes,
  fetchQuestionWithDetails,
  submitAnswer,
  editAnswer,
  likeAnswer,
  deleteAnswer,
  replyAnswer,
  fetchQuestionsWithFilter,
} = require("../controllers/questionController");
const { authentication } = require("../middlewares/authMiddleware");

const router = app.Router();

router.get("/all", fetchQuestions);
router.get("/:id", fetchQuestionWithDetails);
router.get("/:id/answer/all", fetchAnswersWithLikesDislikes);

router.post("/ask", authentication, askQuestion);
router.post("/filter", fetchQuestionsWithFilter);
router.post("/:id/answer", authentication, submitAnswer);
router.post("/:id/answer/:answer_id/like", authentication, likeAnswer);
router.post("/:id/answer/:answer_id/reply", authentication, replyAnswer);

router.put("/:id/answer/:answer_id", authentication, editAnswer);

router.delete("/:id/answer/:answer_id", authentication, deleteAnswer);

module.exports = router;
