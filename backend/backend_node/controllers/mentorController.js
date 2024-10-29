const {
  fetchBookingsForMentorLogic,
  approveMeetingRequestLogic,
  rejectMeetingRequestLogic,
  fetchWebinarsByMentorLogic,
  fetchMentorDetailsLogic,
  fetchMentorSkillOptionsLogic,
  fetchAllMentorsLogic,
  fetchMentorProfileLogic,
  fetchBlogsByMentorLogic,
  fetchMentorAvailabilityLogic,
  isMentorVerifiedLogic,
  updateMentorFeesLogic,
} = require("../logic/mentorLogic");

const fetchBookingsForMentor = async (req, res) => {
  const response = await fetchBookingsForMentorLogic(req.user);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.success });
};

const approveMeetingRequest = async (req, res) => {
  const response = await approveMeetingRequestLogic(req.query);
  if (response.error) {
    return res.json({ error: error.message });
  }
  return res.json({ success: response.success });
};

const rejectMeetingRequest = async (req, res) => {
  const response = await rejectMeetingRequestLogic(req.query);
  if (response.error) {
    return res.json({ error: error.message });
  }
  return res.json({ success: response.success });
};

const fetchWebinarsByMentor = async (req, res) => {
  const response = await fetchWebinarsByMentorLogic(req.user);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ success: response.success });
};

const fetchMentorSkillOptions = async (req, res) => {
  const response = await fetchMentorSkillOptionsLogic();
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.success });
};

const fetchMentorDetails = async (req, res) => {
  const response = await fetchMentorDetailsLogic(req.user);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.success });
};

const fetchAllMentors = async (req, res) => {
  const response = await fetchAllMentorsLogic();
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.success });
};

const fetchMentorProfile = async (req, res) => {
  const response = await fetchMentorProfileLogic(req.query);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.success });
};

const fetchBlogsByMentor = async (req, res) => {
  const response = await fetchBlogsByMentorLogic(req.user);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.success });
};

const fetchMentorAvailability = async (req, res) => {
  const response = await fetchMentorAvailabilityLogic(req.body, req.user);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.success });
};

const isMentorVerified = async (req, res) => {
  const response = await isMentorVerifiedLogic(req.user);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ success: response.success });
};

const updateMentorFees = async (req, res) => {
  const response = await updateMentorFeesLogic(req.body, req.user);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ success: response.success });
};

module.exports = {
  fetchMentorSkillOptions,
  fetchMentorDetails,
  fetchAllMentors,
  fetchMentorProfile,
  fetchBookingsForMentor,
  approveMeetingRequest,
  rejectMeetingRequest,
  fetchWebinarsByMentor,
  fetchBlogsByMentor,
  fetchMentorAvailability,
  isMentorVerified,
  updateMentorFees,
};
