const express = require('express')
const { fetchMentorSkillOptions, fetchMentorDetails, fetchBookingsForMentor, approveMeetingRequest, rejectMeetingRequest, fetchWebinarsByMentor, fetchAllMentors, fetchMentorProfile, fetchBlogsByMentor } = require('../controllers/mentorController')
const { authentication } = require('../middlewares/authMiddleware')
const { removeExpiredWebinars } = require('../middlewares/webinarMiddleware')
const { removeExpiredMeetings } = require('../middlewares/meetingMiddleware')

const router = express.Router()

router.get("/all", authentication, fetchAllMentors)

router.get("/skill-options", fetchMentorSkillOptions)

router.get("/profile", authentication, fetchMentorProfile)

router.get("/details", authentication, fetchMentorDetails)

router.get("/meetings", authentication, removeExpiredMeetings, fetchBookingsForMentor)

router.put("/meeting/approve", authentication, approveMeetingRequest)

router.put("/meeting/reject", authentication, rejectMeetingRequest)

router.get("/webinars", authentication, removeExpiredWebinars, fetchWebinarsByMentor)

router.get("/blogs", authentication, fetchBlogsByMentor)

module.exports = router