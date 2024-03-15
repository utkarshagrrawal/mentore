const express = require('express')
const { registerUser, loginUser, forgotPassword, logout, changepassword, currentUserDetails, verifyOtp, resendOtp } = require('../controllers/userController')
const { authentication } = require('../middlewares/authMiddleware')
const { getMyBookings } = require('../controllers/meetingsController')
const { fetchBookingsForMentor } = require('../controllers/mentorController')

const router = express.Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.post("/forgot-password", forgotPassword);

router.put('/change-password', authentication, changepassword)

router.delete("/logout", authentication, logout)

router.get("/details", authentication, currentUserDetails)

router.post("/verifyotp", verifyOtp)

router.post("/resendotp", resendOtp)

router.get("/my-bookings", authentication, getMyBookings)

router.get("/bookings/mentor/:id", authentication, fetchBookingsForMentor)

module.exports = router