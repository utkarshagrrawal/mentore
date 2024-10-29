const {
  askQuestionLogic,
  fetchQuestionsLogic,
  fetchAnswersWithLikesDislikesLogic,
  fetchQuestionDetailsLogic,
  submitAnswerLogic,
  editAnswerLogic,
  likeAnswerLogic,
  deleteAnswerLogic,
  replyAnswerLogic,
  fetchQuestionsWithFilterLogic,
} = require("../logic/questionLogic");

const askQuestion = async (req, res) => {
  const response = await askQuestionLogic(req.body, req.user);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.result });
};

const fetchQuestions = async (req, res) => {
  const response = await fetchQuestionsLogic();
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.result });
};

const fetchQuestionWithDetails = async (req, res) => {
  const response = await fetchQuestionDetailsLogic(req.params);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.result });
};

const fetchAnswersWithLikesDislikes = async (req, res) => {
  const response = await fetchAnswersWithLikesDislikesLogic(req.params);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.result });
};

const submitAnswer = async (req, res) => {
  const response = await submitAnswerLogic(req.params, req.body, req.user);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.result });
};

const editAnswer = async (req, res) => {
  const response = await editAnswerLogic(req.params, req.body);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.result });
};

const likeAnswer = async (req, res) => {
  const response = await likeAnswerLogic(req.params, req.user);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.result });
};

const deleteAnswer = async (req, res) => {
  const response = await deleteAnswerLogic(req.params);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.result });
};

const replyAnswer = async (req, res) => {
  const response = await replyAnswerLogic(req.params, req.body, req.user);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.result });
};

const fetchQuestionsWithFilter = async (req, res) => {
  const response = await fetchQuestionsWithFilterLogic(req.body);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.result });
};

module.exports = {
  askQuestion,
  fetchQuestions,
  fetchQuestionWithDetails,
  fetchAnswersWithLikesDislikes,
  submitAnswer,
  editAnswer,
  likeAnswer,
  deleteAnswer,
  replyAnswer,
  fetchQuestionsWithFilter,
};
