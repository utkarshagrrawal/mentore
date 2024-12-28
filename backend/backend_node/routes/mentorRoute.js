const express = require("express");
const {
  fetchMentorSkillOptions,
  fetchBookingsForMentor,
  approveMeetingRequest,
  rejectMeetingRequest,
  fetchWebinarsByMentor,
  fetchAllMentors,
  fetchMentorProfile,
  fetchBlogsByMentor,
  updateMentorFees,
} = require("../controllers/mentorController");
const { authentication } = require("../middlewares/authMiddleware");
const { removeExpiredWebinars } = require("../middlewares/webinarMiddleware");
const { removeExpiredMeetings } = require("../middlewares/meetingMiddleware");

const router = express.Router();

router.get("/all", fetchAllMentors);
router.get("/skill-options", fetchMentorSkillOptions);
router.get("/profile", fetchMentorProfile);
router.get(
  "/meetings",
  authentication,
  removeExpiredMeetings,
  fetchBookingsForMentor
);
router.get(
  "/webinars",
  authentication,
  removeExpiredWebinars,
  fetchWebinarsByMentor
);
router.get("/blogs", authentication, fetchBlogsByMentor);

router.put("/meeting/approve", authentication, approveMeetingRequest);
router.put("/meeting/reject", authentication, rejectMeetingRequest);
router.put("/fees/update", authentication, updateMentorFees);

module.exports = router;
