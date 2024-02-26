const { supabase } = require("../utility/dbConnection");
const { razorpayOrderCreate } = require("../utility/razorpayConnection");
const { razorpay } = require('razorpay')

const getMentorAvailability = async (req, res) => {
    const startDateTime = new Date(req.body.startDateTime).toISOString();
    let endDateTime = new Date(req.body.startDateTime)
    endDateTime.setHours(endDateTime.getHours() + parseInt(req.body.duration));
    endDateTime = endDateTime.toISOString();

    const { data: mentorData, error } = await supabase
        .from('mentors')
        .select('')
        .eq('uniq_id', req.body.mentorId)
    if (error) {
        return res.json({ error: error.message })
    }

    const mentorEmail = mentorData[0].email;

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mentor_email: mentorEmail,
            req_start_date: startDateTime.split('.')[0],
            req_end_date: endDateTime.split('.')[0],
        })
    }

    let response = await fetch('https://mentore-api.onrender.com/schedule', options);
    let data = await response.json();

    console.log(data)

    if (data.error) {
        return res.json({ error: data.error })
    } else {
        if (data.availability) {
            const { error } = await supabase
                .from('schedule_mentors')
                .insert({ 'mentee_email': req.user.email, 'mentor_email': mentorEmail, 'start_date': startDateTime, 'end_date': endDateTime, 'about': req.body.about, status: 'payment pending' })

            if (error) {
                return res.json({ error: error.message })
            }

            return res.json({ success: 'Booking request has been sent to mentor' })
        } else {
            return res.json({ error: 'Mentor is not available' })
        }
    }
}

const getMentorBookings = async (req, res) => {
    const { id } = req.params

    const { data, error } = await supabase
        .from('mentors')
        .select('')

    if (error) {
        return res.json({ error: error.message })
    }
    if (data.length === 0) {
        return res.json({ error: 'No mentors found' })
    }

    const { data: meetingData, error: meetingError } = await supabase
        .from('schedule_mentors')
        .select()
        .eq('mentor_email', data[0].email)
        .eq('mentee_email', req.user.email)
        .in('status', ['payment pending', 'pending', 'approved'])

    if (meetingError) {
        return res.json({ error: meetingError.message })
    }

    return res.json({ result: meetingData })
}

const mentorAllBookings = async (req, res) => {
    const { data, error } = await supabase
        .from('schedule_mentors')
        .select()
        .eq('mentor_email', req.user.email)
        .in('status', ['pending', 'approved'])

    if (error) {
        return res.json({ error: error.message })
    }
    return res.json({ result: data })
}

const pay = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('schedule_mentors')
        .select()
        .eq('uniq_id', id)

    if (error) {
        return res.json({ error: error.message })
    }

    if (data.length === 0) {
        return res.json({ error: 'No meeting found' })
    }

    const response = await razorpayOrderCreate();

    return res.json({ result: response });
}

const paymentsuccess = async (req, res) => {
    const { id } = req.params
    const { data, error } = await supabase
        .from('schedule_mentors')
        .update({ status: 'pending' })
        .eq('uniq_id', id)

    if (error) {
        return res.json({ error: error.message })
    }
    return res.json({ success: 'Payment successful' })
}


module.exports = {
    getMentorAvailability,
    getMentorBookings,
    mentorAllBookings,
    pay,
    paymentsuccess
}