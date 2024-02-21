const express = require('express')
const cors = require('cors');
const session = require('express-session');
const { registerUser, loginUser, forgotPassword, getcurrentuser, verifyOtp, resendOtp, changepassword } = require('./controllers/userController');
const { authentication } = require('./utility/passportUtility');
const { getAllSkills, getMentorDetails, getAllMentors } = require('./controllers/mentorController');
const { createWebinar, getWebinars, getAllWebinars, addParticipant, addHost } = require('./controllers/dyteController');
const { getBlogs, createBlog, getCurrentBlog, getAllBlogs, deleteBlog } = require('./controllers/blogController');

const app = express()
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }
}))
app.use(cors())
app.use(express.json())

app.post('/register', registerUser)

app.post('/login', loginUser)

app.post('/forgotpassword', forgotPassword)

app.post('/changepassword', authentication, changepassword)

app.get('/getcurrentuser', authentication, getcurrentuser)

app.get('/getallskills', getAllSkills)

app.get('/getmentordetails', authentication, getMentorDetails)

app.get('/getallmentors', getAllMentors)

app.post('/verifyotp', verifyOtp)

app.post('/resendotp', resendOtp)

app.post('/createwebinar', authentication, createWebinar)

app.get('/getwebinars', authentication, getWebinars)

app.get('/allwebinars', getAllWebinars)

app.post('/joinwebinarparticipant', authentication, addParticipant)

app.post('/joinwebinarhost', authentication, addHost)

app.get('/getblogs', authentication, getBlogs)

app.post('/createblog', authentication, createBlog)

app.post('/getcurrentblog', authentication, getCurrentBlog)

app.get('/getallblogs', getAllBlogs)

app.post('/deleteblog', authentication, deleteBlog)

// const checkSchedule = async (req, res) => {
//   const schedule = await fetch('https://mentore-api.onrender.com/schedule', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       "req_start_date": "2024-02-17T01:00:00",
//       "req_end_date": "2024-02-17T01:30:00",
//       "mentor_email": "divyas@gmail.com",
//     })
//   })
//   const response = await schedule.json();
//   console.log('hi', response)
// }

// checkSchedule();

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
