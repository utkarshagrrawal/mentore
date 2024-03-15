const express = require("express")
const { authentication } = require("../middlewares/authMiddleware")
const { joinMeetingParticipant, joinMeetingHost } = require("../controllers/meetingsController")
const { fetchMentorAvailability } = require("../controllers/mentorController")

const router = express.Router()

router.post("/schedule", authentication, fetchMentorAvailability)

router.post("/join/participant", authentication, joinMeetingParticipant)

router.post("/join/host", authentication, joinMeetingHost)

module.exports = router