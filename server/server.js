const express = require('express')
const cors = require('cors');
const session = require('express-session');
const { registerUser, loginUser, forgotPassword, getcurrentuser, verifyOtp, resendOtp, changepassword } = require('./controllers/userController');
const { authentication } = require('./utility/passportUtility');
const { getAllSkills, getMentorSkills, getMentorDetails } = require('./controllers/mentorController');
const { createWebinar, getWebinars } = require('./controllers/dyteController')

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

app.post('/verifyotp', verifyOtp)

app.post('/resendotp', resendOtp)

app.post('/createwebinar', authentication, createWebinar)

app.get('/getwebinars', authentication, getWebinars)

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
//   console.log(response)
// }

// checkSchedule()

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
