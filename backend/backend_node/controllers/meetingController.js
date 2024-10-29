const {
  getMyBookingsLogic,
  createMeetingLogic,
  joinMeetingParticipantLogic,
  joinMeetingHostLogic,
} = require("../logic/meetingLogic");

require("dotenv").config();

const getMyBookings = async (req, res) => {
  const response = await getMyBookingsLogic(req.user);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.success });
};

const createMeeting = async (req, res) => {
  const response = await createMeetingLogic(req.body, req.params);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.success });
};

const joinMeetingParticipant = async (req, res) => {
  const response = await joinMeetingParticipantLogic(req.body, req.user);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.success });
};

const joinMeetingHost = async (req, res) => {
  const response = await joinMeetingHostLogic(req.body, req.user);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.success });
};

module.exports = {
  getMyBookings,
  createMeeting,
  joinMeetingParticipant,
  joinMeetingHost,
};
