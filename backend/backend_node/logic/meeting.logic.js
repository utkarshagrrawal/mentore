const { supabase } = require("../utility/database.connection");
const { razorpayOrderCreate } = require("../utility/razorpayConnection");

require('dotenv').config();

async function getMyBookingsLogic(user) {
    const { email } = user;

    const { data, error } = await supabase
        .from("schedule_mentors")
        .select()
        .eq("mentee_email", email)
        .in("status", ["approved", "payment pending", "pending"])

    if (error) {
        return { error: error.message }
    }
    return { success: data }
}


async function createMeetingLogic(body) {
    const data = { "title": body.title, "preferred_region": "ap-south-1", "record_on_start": false, "live_stream_on_start": false }

    const concatenatedString = process.env.DYTE_ORG_ID + ':' + process.env.DYTE_API_KEY

    const meeting = await fetch('https://api.dyte.io/v2/meetings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(concatenatedString).toString('base64')}`
        },
        body: JSON.stringify(data)
    })

    const response = await meeting.json()

    if (response.error) {
        return { error: response.error }
    } else if (response && !response.success) {
        return { error: response.error }
    }

    const { error } = await supabase
        .from('schedule_mentors')
        .update({ meeting_link: 'https://api.dyte.io/v2/meetings/' + response.data.id })
        .eq('uniq_id', body.meeting_uuid)

    if (error) {
        return { error: error.message }
    }

    const result = await razorpayOrderCreate(body.amount);

    return { success: result, key_id: process.env.RAZORPAY_KEY_ID }
}


async function joinMeetingParticipantLogic(body, user) {
    const concatenatedString = process.env.DYTE_ORG_ID + ':' + process.env.DYTE_API_KEY

    const meeting = await fetch(body.meeting_id + '/participants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(concatenatedString).toString('base64')}`
        },
        body: JSON.stringify({
            "name": user.name,
            "preset_name": "group_call_participant",
            "custom_participant_id": user.email
        })
    })
    const response = await meeting.json()

    if (response && response.success) {
        return { success: 'https://app.dyte.io/v2/meeting?id=' + response.data.id + '&authToken=' + response.data.token }
    }

    return { error: response.error }
}


async function joinMeetingHostLogic(body, user) {
    const concatenatedString = process.env.DYTE_ORG_ID + ':' + process.env.DYTE_API_KEY

    const meeting = await fetch(body.meeting_id + '/participants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(concatenatedString).toString('base64')}`
        },
        body: JSON.stringify({
            "name": user.name,
            "preset_name": "group_call_host",
            "custom_participant_id": user.email
        })
    })
    const response = await meeting.json()

    if (response && response.success) {
        return { success: 'https://app.dyte.io/v2/meeting?id=' + response.data.id + '&authToken=' + response.data.token }
    }

    return { error: response.error }
}


module.exports = {
    getMyBookingsLogic,
    createMeetingLogic,
    joinMeetingParticipantLogic,
    joinMeetingHostLogic
}