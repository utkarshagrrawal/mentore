const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  changepassword,
  currentUserDetails,
  verifyOtp,
  resendOtp,
  fetchBookingsWithMentor,
} = require("../controllers/user.controller");
const { authentication } = require("../middlewares/auth.middleware");
const { getMyBookings } = require("../controllers/meeting.controller");
const { removeExpiredMeetings } = require("../middlewares/meeting.middleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.put("/change-password", authentication, changepassword);

router.get("/details", authentication, currentUserDetails);

router.post("/verifyotp", verifyOtp);

router.post("/resendotp", resendOtp);

router.get(
  "/my-bookings",
  authentication,
  removeExpiredMeetings,
  getMyBookings
);

router.get(
  "/bookings/mentor/:id",
  authentication,
  removeExpiredMeetings,
  fetchBookingsWithMentor
);

module.exports = router;
