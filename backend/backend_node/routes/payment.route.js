const express = require("express");
const { authentication } = require("../middlewares/auth.middleware");
const { pay, paymentSuccess } = require("../controllers/payment.controller");
const { createMeeting } = require("../controllers/meeting.controller");
const { removeExpiredMeetings } = require("../middlewares/meeting.middleware");

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
