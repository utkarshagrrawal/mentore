const express = require('express')
const cors = require('cors');
const session = require('express-session');
const { registerUser, loginUser, forgotPassword, getcurrentuser, verifyOtp, resendOtp } = require('./controllers/userController');
const { authentication } = require('./utility/passportUtility');
const { getAllSkills, getMentorSkills, getMentorDetails } = require('./controllers/mentorController');

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

app.get('/getcurrentuser', authentication, getcurrentuser)

app.get('/getallskills', getAllSkills)

app.get('/getmentordetails', authentication, getMentorDetails)

app.post('/verifyotp', verifyOtp)

app.post('/resendotp', resendOtp)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
