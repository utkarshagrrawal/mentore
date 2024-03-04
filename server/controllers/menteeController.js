const { supabase } = require("../utility/dbConnection");


const getSelfBookings = async (req, res) => {
    const { data, error } = await supabase
        .from("schedule_mentors")
        .select()
        .eq("mentee_email", req.user.email)
        .in("status", ["approved", "payment pending", "pending"])

    if (error) {
        return res.json({ error: error.message })
    }
    return res.json({ result: data })
}

module.exports = {
    getSelfBookings
}