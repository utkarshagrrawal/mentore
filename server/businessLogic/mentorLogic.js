const { supabase } = require("../utility/dbConnection");



const fetchBookingsForMentorLogic = async (user) => {
    const { email } = user;

    const { data, error } = await supabase
        .from('schedule_mentors')
        .select()
        .eq('mentor_email', email)
        .in('status', ['pending', 'approved', 'payment pending'])

    if (error) {
        return { error: error.message }
    }

    return { success: data }
}


const approveMeetingRequestLogic = async (query) => {
    const { id } = query

    const { error } = await supabase
        .from('schedule_mentors')
        .update({ status: 'payment pending' })
        .eq('uniq_id', id)

    if (error) {
        return { error: error.message }
    }

    return { success: 'Meeting approved' }
}


const rejectMeetingRequestLogic = async (query) => {
    const { id } = query

    const { error } = await supabase
        .from('schedule_mentors')
        .update({ status: 'rejected' })
        .eq('uniq_id', id)

    if (error) {
        return { error: error.message }
    }

    return { success: 'Meeting rejected' }
}


const fetchWebinarsByMentorLogic = async (user) => {
    const { email } = user

    const { data, error } = await supabase
        .from('webinar')
        .select('*')
        .eq('mentor_email', email)

    if (error) {
        return { error: error.message }
    }

    return { success: data }
}


const fetchMentorDetailsLogic = async (user) => {
    const { email } = user

    const { data, error } = await supabase
        .from('mentors')
        .select()
        .eq('email', email)

    if (error) {
        return { error: error.message }
    }

    return { success: data[0] }
}


const fetchMentorSkillOptionsLogic = async () => {
    const { data, error } = await supabase
        .from('domains')
        .select('')

    if (error) {
        return { error: error.message }
    }

    return { success: data }
}


const fetchAllMentorsLogic = async () => {
    const { data, error } = await supabase
        .from('mentors')
        .select()

    if (error) {
        return { error: error.message }
    }

    return { success: data }
}


const fetchMentorProfileLogic = async (query) => {
    const { id } = query;

    const { data, error } = await supabase
        .from('mentors')
        .select()
        .eq('uniq_id', id)

    if (error) {
        return { error: error.message }
    }

    return { success: data[0] }
}


const fetchBlogsByMentorLogic = async (user) => {
    const { email } = user;

    const { data, error } = await supabase
        .from('blogs')
        .select()
        .eq('email', email)

    if (error) {
        return { error: error.message }
    }

    return { success: data }
}


const fetchMentorAvailabilityLogic = async (body, user) => {
    const { duration, mentorId, about, startTime, endTime } = body;
    const { email } = user;

    let startDateTime = new Date(startTime);

    let endDateTime = new Date(endTime);

    endDateTime.setHours(endDateTime.getHours() + parseInt(duration));

    startDateTime.setHours(startDateTime.getHours() + 5);
    startDateTime.setMinutes(startDateTime.getMinutes() + 30);

    endDateTime.setHours(endDateTime.getHours() + 5);
    endDateTime.setMinutes(endDateTime.getMinutes() + 30);

    startDateTime = startDateTime.toISOString().split('.')[0];
    endDateTime = endDateTime.toISOString().split('.')[0];


    const { data: mentorDetails, error } = await supabase
        .from('mentors')
        .select('')
        .eq('uniq_id', mentorId)

    if (error) {
        return { error: error.message }
    }

    const mentorEmail = mentorDetails[0].email;

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

    if (data.error) {
        return { error: data.error }
    } else {
        if (data.response) {
            const { error } = await supabase
                .from('schedule_mentors')
                .insert({ mentee_email: email, mentor_email: mentorEmail, start_time: startDateTime, end_time: endDateTime, about: about, status: 'pending', mentor_name: mentorDetails[0].name })

            if (error) {
                return { error: error.message }
            }

            return { success: 'Booking request has been sent to mentor' }
        } else {
            return { error: 'Mentor is not available' }
        }
    }
}


module.exports = {
    fetchBookingsForMentorLogic,
    approveMeetingRequestLogic,
    rejectMeetingRequestLogic,
    fetchWebinarsByMentorLogic,
    fetchMentorDetailsLogic,
    fetchMentorSkillOptionsLogic,
    fetchAllMentorsLogic,
    fetchMentorProfileLogic,
    fetchBlogsByMentorLogic,
    fetchMentorAvailabilityLogic
}