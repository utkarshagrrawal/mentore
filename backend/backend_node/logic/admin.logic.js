const { supabase } = require("../utility/database.connection")

const fetchPendingVerificationsLogic = async () => {
    const { data, error } = await supabase
        .from('mentors')
        .select('')
        .eq('verified', false)

    if (error) {
        return { error: error.message }
    }
    return { success: data }
}

const approveMentorLogic = async (query) => {
    const { id } = query

    const { error } = await supabase
        .from('mentors')
        .update({ verified: true })
        .eq('uniq_id', id)

    if (error) {
        return { error: error.message }
    }
    return { success: "Mentor approved successfully" }
}

const rejectMentorLogic = async (query) => {
    const { id } = query

    const { error } = await supabase
        .from('mentors')
        .delete()
        .eq('uniq_id', id)

    if (error) {
        return { error: error.message }
    }
    return { success: "Mentor rejected successfully" }
}

module.exports = {
    fetchPendingVerificationsLogic,
    approveMentorLogic,
    rejectMentorLogic
}