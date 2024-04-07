const { supabase } = require("../utility/dbConnection")


async function createWebinarLogic(body, user) {
    const data = { "title": body.title, "preferred_region": "ap-south-1", "record_on_start": false, "live_stream_on_start": false }

    const concatenatedString = process.env.DYTE_ORG_ID + ':' + process.env.DYTE_API_KEY

    const webinar = await fetch('https://api.dyte.io/v2/meetings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(concatenatedString).toString('base64')}`
        },
        body: JSON.stringify(data)
    })
    const response = await webinar.json()

    if (response && response.success) {
        const { error } = await supabase
            .from('webinar')
            .insert({ title: body.title, meeting_link: 'https://api.dyte.io/v2/meetings/' + response.data.id, start_time: body.start, end_time: body.end, mentor_email: user.email, mentor_name: user.name })

        if (error) {
            return { error: error.message }
        }

        return { success: "Webinar created!" }
    }

    return { error: response.error }
}


async function registerForWebinarLogic(body, user) {
    const { webinar_id } = body;
    const { email } = user;

    const { data, error } = await supabase
        .from("webinar")
        .select("")
        .eq("id", webinar_id)

    if (error) {
        return { error: error.message }
    }

    let participants = data[0].registered_users;
    participants ? participants.push(email) : participants = [email];

    const { error: updateError } = await supabase
        .from('webinar')
        .update({ registered_users: participants })
        .eq('id', webinar_id)

    if (updateError) {
        return { error: updateError.message }
    }

    return { success: 'User registered for webinar successfully' }
}


async function joinWebinarAsHostLogic(body, user) {
    const concatenatedString = process.env.DYTE_ORG_ID + ':' + process.env.DYTE_API_KEY

    const webinar = await fetch(body.meeting_id + '/participants', {
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
    const response = await webinar.json()

    if (response && response.success) {
        return { success: 'https://app.dyte.io/v2/meeting?id=' + response.data.id + '&authToken=' + response.data.token }
    }

    return { error: response.error }
}


async function joinWebinarAsParticipantLogic(body, user) {
    const concatenatedString = process.env.DYTE_ORG_ID + ':' + process.env.DYTE_API_KEY

    const webinar = await fetch(body.meeting_id + '/participants', {
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
    const response = await webinar.json()

    if (response && response.success) {
        return { success: 'https://app.dyte.io/v2/meeting?id=' + response.data.id + '&authToken=' + response.data.token }
    }

    return { error: response.error }
}


async function fetchAllWebinarsLogic() {
    const { data, error } = await supabase
        .from('webinar')
        .select('')

    if (error) {
        return { error: error.message }
    }

    return { success: data }
}


module.exports = {
    createWebinarLogic,
    registerForWebinarLogic,
    joinWebinarAsHostLogic,
    fetchAllWebinarsLogic,
    joinWebinarAsParticipantLogic
}