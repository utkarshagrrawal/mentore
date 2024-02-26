const express = require('express')
const cors = require('cors');
const { registerUser, loginUser, forgotPassword, getcurrentuser, verifyOtp, resendOtp, changepassword, logout } = require('./controllers/userController');
const { authentication } = require('./utility/passportUtility');
const { getAllSkills, getMentorDetails, getAllMentors, getMentorProfile } = require('./controllers/mentorController');
const { createWebinar, getWebinars, getAllWebinars, addParticipant, addHost } = require('./controllers/dyteController');
const { getBlogs, createBlog, getCurrentBlog, getAllBlogs, deleteBlog, addLike } = require('./controllers/blogController');
const { linkRedis } = require('./utility/redisConnection');
const { getMentorAvailability, getMentorBookings, mentorAllBookings, pay, paymentsuccess, approveMeeting, rejectMeeting } = require('./controllers/bookingController');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

linkRedis();

app.post('/register', registerUser)

app.post("/login", loginUser);

app.post("/forgotpassword", forgotPassword);

app.post('/logout', authentication, logout)

app.post('/changepassword', authentication, changepassword)

app.get("/getcurrentuser", authentication, getcurrentuser);

app.get("/getallskills", getAllSkills);

app.get("/getmentordetails", authentication, getMentorDetails);

app.get("/getallmentors", getAllMentors);

app.post("/verifyotp", verifyOtp);

app.post("/resendotp", resendOtp);

app.post("/createwebinar", authentication, createWebinar);

app.get("/getwebinars", authentication, getWebinars);

app.get("/allwebinars", getAllWebinars);

app.post("/joinwebinarparticipant", authentication, addParticipant);

app.post("/joinwebinarhost", authentication, addHost);

app.get("/getblogs", authentication, getBlogs);

app.post("/createblog", authentication, createBlog);

app.post("/getcurrentblog", authentication, getCurrentBlog);

app.get("/getallblogs", getAllBlogs);

app.post("/deleteblog", authentication, deleteBlog);

app.get("/getmentorprofile", authentication, getMentorProfile);

app.post("/schedulemeet", authentication, getMentorAvailability)

app.get("/getwithmentormeetings/:id", authentication, getMentorBookings)

app.get("/getmentorallmeetings", authentication, mentorAllBookings)

app.post("/pay/:id", authentication, pay)

app.post('/paymentsuccess/:id', authentication, paymentsuccess)

app.post("/approve", authentication, approveMeeting);

app.post("/reject", authentication, rejectMeeting);

app.post("/like", addLike);

/* app.post("/comment", addComment); */

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
