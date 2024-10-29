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
} = require("../controllers/userController");
const { authentication } = require("../middlewares/authMiddleware");
const { getMyBookings } = require("../controllers/meetingController");
const { removeExpiredMeetings } = require("../middlewares/meetingMiddleware");

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
