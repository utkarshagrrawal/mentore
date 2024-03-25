const { supabase } = require('../utility/dbConnection')

const askQuestionLogic = async (body, user) => {
    const { error } = await supabase
        .from('questions')
        .insert({ question: body.question, tags: body.tags, asked_by_email: user.email, asked_by_name: user.name })

    if (error) {
        return { error: error.message }
    }

    return { result: "Question posted successfully" }
}

const fetchQuestionsLogic = async () => {
    const { data, error } = await supabase
        .rpc('fetch_questions')

    if (error) {
        return { error: error.message }
    }

    return { result: data }
}

const fetchQuestionDetailsLogic = async (params) => {
    const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', params.id)

    if (error) {
        return { error: error.message }
    }

    return { result: data }
}

const fetchAnswersWithLikesDislikesLogic = async (params) => {
    const { data, error } = await supabase
        .rpc('answer_with_likes_dislikes', { question_id: params.id })

    if (error) {
        return { error: error.message }
    }

    return { result: data }
}

module.exports = {
    askQuestionLogic,
    fetchQuestionsLogic,
    fetchQuestionDetailsLogic,
    fetchAnswersWithLikesDislikesLogic
}