const express = require("express")
const { authentication } = require("../middlewares/auth.middleware")
const { joinMeetingParticipant, joinMeetingHost } = require("../controllers/meeting.controller")
const { fetchMentorAvailability } = require("../controllers/mentor.controller")
const { removeExpiredMeetings } = require("../middlewares/meeting.middleware")

const router = express.Router()

router.post("/schedule", authentication, removeExpiredMeetings, fetchMentorAvailability)

router.post("/join/participant", authentication, joinMeetingParticipant)

router.post("/join/host", authentication, joinMeetingHost)

module.exports = router