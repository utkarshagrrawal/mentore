const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  changepassword,
  currentUserDetails,
  verifyOtp,
  fetchBookingsWithMentor,
} = require("../controllers/userController");
const { authentication } = require("../middlewares/authMiddleware");
const { getMyBookings } = require("../controllers/meetingController");
const { removeExpiredMeetings } = require("../middlewares/meetingMiddleware");

const router = express.Router();

router.get("/details", authentication, currentUserDetails);
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

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", (req, res) => {
  res.clearCookie("SESSION_ID");
  return res.json({ success: "Logged out successfully" });
});
router.post("/forgot-password", forgotPassword);
router.post("/verifyotp", verifyOtp);

router.put("/change-password", authentication, changepassword);

module.exports = router;
