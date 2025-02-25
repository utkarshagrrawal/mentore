const { supabase } = require("../utility/databaseConnection");

async function createWebinarLogic(body, user) {
  const data = {
    title: body.title.split(" ").join("_"),
    preferred_region: "ap-south-1",
    record_on_start: false,
    live_stream_on_start: false,
  };

  const concatenatedString =
    process.env.DYTE_ORG_ID + ":" + process.env.DYTE_API_KEY;

  const webinar = await fetch("https://api.dyte.io/v2/meetings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(concatenatedString).toString(
        "base64"
      )}`,
    },
    body: JSON.stringify(data),
  });
  const response = await webinar.json();

  if (response && response.success) {
    const { error } = await supabase.from("webinar").insert({
      title: body.title,
      meeting_link: "https://api.dyte.io/v2/meetings/" + response.data.id,
      start_time: body.start,
      end_time: body.end,
      mentor_email: user.email,
      mentor_name: user.name,
      registered_users: [user.email],
    });

    if (error) {
      return { error: error.message };
    }

    return { success: "Webinar created!" };
  }

  return { error: response.error };
}

async function registerForWebinarLogic(body, user) {
  const { webinar_id } = body;
  const { email } = user;

  const { data, error } = await supabase
    .from("webinar")
    .select("")
    .eq("id", webinar_id);

  if (error) {
    return { error: error.message };
  }

  let participants = data[0].registered_users;
  participants = [...participants, email];

  const { error: updateError } = await supabase
    .from("webinar")
    .update({ registered_users: participants })
    .eq("id", webinar_id);

  if (updateError?.message) {
    return { error: updateError.message };
  }

  return { success: "User registered for webinar successfully" };
}

async function joinWebinarAsHostLogic(body, user) {
  const concatenatedString =
    process.env.DYTE_ORG_ID + ":" + process.env.DYTE_API_KEY;

  const webinar = await fetch(body.meeting_id + "/participants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(concatenatedString).toString(
        "base64"
      )}`,
    },
    body: JSON.stringify({
      name: user.name,
      preset_name: "webinar_presenter",
      custom_participant_id: user.email,
    }),
  });
  const response = await webinar.json();

  if (response && response.success) {
    return {
      success:
        "https://app.dyte.io/v2/meeting?id=" +
        response.data.id +
        "&authToken=" +
        response.data.token,
    };
  }

  return { error: response.error };
}

async function joinWebinarAsParticipantLogic(body, user) {
  const concatenatedString =
    process.env.DYTE_ORG_ID + ":" + process.env.DYTE_API_KEY;

  const webinar = await fetch(body.meeting_id + "/participants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(concatenatedString).toString(
        "base64"
      )}`,
    },
    body: JSON.stringify({
      name: user.name,
      preset_name: "webinar_viewer",
      custom_participant_id: user.email,
    }),
  });
  const response = await webinar.json();

  if (response && response.success) {
    return {
      success:
        "https://app.dyte.io/v2/meeting?id=" +
        response.data.id +
        "&authToken=" +
        response.data.token,
    };
  }

  return { error: response.error };
}

async function fetchAllWebinarsLogic(query) {
  const skip = query?.page ? (query.page - 1) * 10 : 0;

  const { data, error } = await supabase.rpc("get_webinars_with_filter", {
    skip,
    web_title: query?.title || null,
    author_name: query?.author || null,
    start_date: query?.start_date
      ? new Date(query.start_date).toISOString().split("T")[0]
      : null,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: data };
}

module.exports = {
  createWebinarLogic,
  registerForWebinarLogic,
  joinWebinarAsHostLogic,
  fetchAllWebinarsLogic,
  joinWebinarAsParticipantLogic,
};
