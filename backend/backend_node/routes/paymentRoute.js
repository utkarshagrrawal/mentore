const express = require("express");
const { authentication } = require("../middlewares/authMiddleware");
const { pay, paymentSuccess } = require("../controllers/paymentController");
const { createMeeting } = require("../controllers/meetingController");
const { removeExpiredMeetings } = require("../middlewares/meetingMiddleware");

const router = express.Router();

router.post(
  "/pay/:id",
  authentication,
  pay,
  removeExpiredMeetings,
  createMeeting
);

router.post("/success/:id", authentication, paymentSuccess);

module.exports = router;
