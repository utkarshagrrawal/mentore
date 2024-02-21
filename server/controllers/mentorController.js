const { supabase } = require("../utility/dbConnection")

const getAllSkills = async (req, res) => {
    const { data, error } = await supabase
        .from('domains')
        .select('')
    if (error) {
        return res.json({ error: error.message })
    } else {
        return res.json({ result: data })
    }
}

const getMentorDetails = async (req, res) => {
    const { data, error } = await supabase
        .from('mentors')
        .select()
        .eq('email', req.user.email)
    if (error) {
        return res.json({ error: error.message })
    } else {
        return res.json({ result: data[0] })
    }
}

const getAllMentors = async (req, res) => {
    const { data, error } = await supabase
        .from('mentors')
        .select()
    if (error) {
        return res.json({ error: error.message })
    } else {
        return res.json({ result: data })
    }
}

const getMentorProfile = async (req, res) => {
    const { data, error } = await supabase
        .from('mentors')
        .select()
        .eq('uniq_id', req.query.id)
    if (error) {
        return res.json({ error: error.message })
    } else {
        return res.json({ result: data[0] })
    }
}

module.exports = {
    getAllSkills,
    getMentorDetails,
    getAllMentors,
    getMentorProfile
}
