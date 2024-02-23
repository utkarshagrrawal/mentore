const { supabase } = require("../utility/dbConnection")

const getMentorAvailability = async (req, res) => {
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mentor_email: req.body.email,
            req_start_date: req.body.date,
            req_end_date: req.body.time,
        })
    }
    let response = await fetch('https://mentore-api.onrender.com/schedule', options);
    let data = await response.json();
    if (data.error) {
        return res.json({ error: data.error })
    } else {
        if (data.availability) {
            return res.json({ result: 'Mentor is available' })
        } else {
            return res.json({ error: 'Mentor is not available' })
        }
    }
}


module.exports = {
    getMentorAvailability,
}