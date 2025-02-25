const { supabase } = require("../utility/databaseConnection");

const fetchBookingsForMentorLogic = async (user) => {
  const { email } = user;

  const { data, error } = await supabase
    .from("schedule_mentors")
    .select()
    .eq("mentor_email", email)
    .in("status", ["pending", "approved", "payment pending"]);

  if (error) {
    return { error: error.message };
  }

  return { success: data };
};

const approveMeetingRequestLogic = async (query) => {
  const { id } = query;

  const { error } = await supabase
    .from("schedule_mentors")
    .update({ status: "payment pending" })
    .eq("uniq_id", id);

  if (error) {
    return { error: error.message };
  }

  return { success: "Meeting approved" };
};

const rejectMeetingRequestLogic = async (query) => {
  const { id } = query;

  const { error } = await supabase
    .from("schedule_mentors")
    .update({ status: "rejected" })
    .eq("uniq_id", id);

  if (error) {
    return { error: error.message };
  }

  return { success: "Meeting rejected" };
};

const fetchWebinarsByMentorLogic = async (user) => {
  const { email } = user;

  const { data, error } = await supabase
    .from("webinar")
    .select("")
    .eq("mentor_email", email);

  if (error) {
    return { error: error.message };
  }

  return { success: data };
};

const fetchMentorSkillOptionsLogic = async () => {
  const { data, error } = await supabase.from("domains").select("");

  if (error) {
    return { error: error.message };
  }

  return { success: data };
};

const fetchAllMentorsLogic = async () => {
  const { data, error } = await supabase
    .from("mentors")
    .select()
    .eq("verified", true);

  if (error) {
    return { error: error.message };
  }

  return { success: data };
};

const fetchMentorProfileLogic = async (query) => {
  const { id } = query;

  const { data, error } = await supabase
    .from("mentors")
    .select()
    .eq("uniq_id", id);

  if (error) {
    return { error: error.message };
  }

  return { success: data[0] };
};

const fetchBlogsByMentorLogic = async (user) => {
  const { email } = user;

  const { data, error } = await supabase
    .from("blogs")
    .select()
    .eq("email", email);

  if (error) {
    return { error: error.message };
  }

  return { success: data };
};

const fetchMentorAvailabilityLogic = async (body, user) => {
  const { duration, mentorId, about, startDateTime } = body;
  const { email } = user;

  let startTime = new Date(startDateTime);

  let endTime = new Date(startDateTime);
  endTime.setHours(endTime.getHours() + parseInt(duration));

  startTime = startTime.toISOString().split(".")[0];
  endTime = endTime.toISOString().split(".")[0];

  const { data: mentorDetails, error } = await supabase
    .from("mentors")
    .select("")
    .eq("uniq_id", mentorId);

  if (error) {
    return { error: error.message };
  }

  const mentorEmail = mentorDetails[0].email;

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mentor_email: mentorEmail,
      req_start_date: startTime.split(".")[0],
      req_end_date: endTime.split(".")[0],
    }),
  };

  let response = await fetch(
    "https://mentore-api.onrender.com/schedule",
    options
  );
  let data = await response.json();

  if (data.error) {
    return { error: data.error };
  } else {
    if (data.response) {
      const { error } = await supabase.from("schedule_mentors").insert({
        mentee_email: email,
        mentor_email: mentorEmail,
        start_time: startTime,
        end_time: endTime,
        about: about,
        status: "pending",
        mentor_name: mentorDetails[0].name,
        fees: mentorDetails[0].fees,
      });

      if (error) {
        return { error: error.message };
      }

      return { success: "Booking request has been sent to mentor" };
    } else {
      return { error: "Mentor is not available" };
    }
  }
};

const updateMentorFeesLogic = async (body, user) => {
  const { fees } = body;
  const { email } = user;

  const { error } = await supabase
    .from("mentors")
    .update({ fees: fees })
    .eq("email", email);

  if (error) {
    return { error: error.message };
  }

  return { success: "Fees updated" };
};

module.exports = {
  fetchBookingsForMentorLogic,
  approveMeetingRequestLogic,
  rejectMeetingRequestLogic,
  fetchWebinarsByMentorLogic,
  fetchMentorSkillOptionsLogic,
  fetchAllMentorsLogic,
  fetchMentorProfileLogic,
  fetchBlogsByMentorLogic,
  fetchMentorAvailabilityLogic,
  updateMentorFeesLogic,
};
