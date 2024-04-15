const express = require('express')
const { fetchMentorSkillOptions, fetchMentorDetails, fetchBookingsForMentor, approveMeetingRequest, rejectMeetingRequest, fetchWebinarsByMentor, fetchAllMentors, fetchMentorProfile, fetchBlogsByMentor, isMentorVerified } = require('../controllers/mentor.controller')
const { authentication } = require('../middlewares/auth.middleware')
const { removeExpiredWebinars } = require('../middlewares/webinar.middleware')
const { removeExpiredMeetings } = require('../middlewares/meeting.middleware')

const router = express.Router()

router.get("/all", fetchAllMentors)

router.get("/skill-options", fetchMentorSkillOptions)

router.get("/profile", fetchMentorProfile)

router.get("/details", authentication, fetchMentorDetails)

router.get("/meetings", authentication, removeExpiredMeetings, fetchBookingsForMentor)

router.put("/meeting/approve", authentication, approveMeetingRequest)

router.put("/meeting/reject", authentication, rejectMeetingRequest)

router.get("/webinars", authentication, removeExpiredWebinars, fetchWebinarsByMentor)

router.get("/blogs", authentication, fetchBlogsByMentor)

router.get("/verified", authentication, isMentorVerified)

module.exports = router