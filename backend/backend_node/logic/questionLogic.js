const { supabase } = require("../utility/databaseConnection");

const askQuestionLogic = async (body, user) => {
  const { error } = await supabase.from("questions").insert({
    question: body.question,
    tags: body.tags,
    asked_by_email: user.email,
    asked_by_name: user.name,
  });

  if (error) {
    return { error: error.message };
  }

  return { result: "Question posted successfully" };
};

const fetchQuestionsLogic = async () => {
  const { data, error } = await supabase.rpc("fetch_questions");

  if (error) {
    return { error: error.message };
  }

  return { result: data };
};

const fetchQuestionDetailsLogic = async (params) => {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", params.id);

  if (error) {
    return { error: error.message };
  }

  return { result: data };
};

const fetchAnswersWithLikesDislikesLogic = async (params) => {
  const { data, error } = await supabase.rpc("answer_with_likes", {
    question_id: params.id,
  });

  if (error) {
    return { error: error.message };
  }

  return { result: data };
};

const submitAnswerLogic = async (params, body, user) => {
  const { error } = await supabase.from("question_answers").insert({
    question_id: params.id,
    answer: body.answer,
    answered_by_email: user.email,
    answered_by_name: user.name,
    answered_by_gender: user.gender,
  });

  if (error) {
    return { error: error.message };
  }

  return { result: "Answer posted successfully" };
};

const editAnswerLogic = async (params, body) => {
  const { error } = await supabase
    .from("question_answers")
    .update({ answer: body.answer })
    .eq("answer_id", params.answer_id);

  if (error) {
    return { error: error.message };
  }

  return { result: "Answer updated successfully!" };
};

const likeAnswerLogic = async (params, user) => {
  const { data, error } = await supabase
    .from("question_answer_likes")
    .select("*")
    .eq("answer_id", params.answer_id)
    .eq("liked_by_email", user.email);

  if (error) {
    return { error: error.message };
  }

  if (data.length > 0) {
    const { error } = await supabase
      .from("question_answer_likes")
      .delete()
      .eq("answer_id", params.answer_id)
      .eq("liked_by_email", user.email);

    if (error) {
      return { error: error.message };
    }

    return { result: "Like removed" };
  }

  const { error: likeError } = await supabase
    .from("question_answer_likes")
    .insert({ answer_id: params.answer_id, liked_by_email: user.email });

  if (likeError?.message) {
    return { error: likeError.message };
  }

  return { result: "Answer liked" };
};

const deleteAnswerLogic = async (params) => {
  const { error } = await supabase
    .from("question_answers")
    .delete()
    .eq("answer_id", params.answer_id);

  if (error) {
    return { error: error.message };
  }

  return { result: "Answer deleted successfully" };
};

const replyAnswerLogic = async (params, body, user) => {
  const { error } = await supabase.from("question_answers").insert({
    question_id: params.id,
    answer: body.reply,
    answered_by_email: user.email,
    answered_by_name: user.name,
    parent_answer_id: params.answer_id,
    answered_by_gender: user.gender,
  });

  if (error) {
    return { error: error.message };
  }

  return { result: "Answer posted successfully" };
};

const fetchQuestionsWithFilterLogic = async (body) => {
  const { data, error } = await supabase.rpc("fetch_questions_with_filter", {
    inputtags: [...body.tags],
  });

  if (error) {
    return { error: error.message };
  }

  return { result: data };
};

module.exports = {
  askQuestionLogic,
  fetchQuestionsLogic,
  fetchQuestionDetailsLogic,
  fetchAnswersWithLikesDislikesLogic,
  submitAnswerLogic,
  editAnswerLogic,
  likeAnswerLogic,
  deleteAnswerLogic,
  replyAnswerLogic,
  fetchQuestionsWithFilterLogic,
};
