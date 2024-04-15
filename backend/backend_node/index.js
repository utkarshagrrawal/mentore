const express = require('express')
const cors = require('cors');

const userRoute = require('./routes/user.route');
const adminRoute = require('./routes/admin.route');
const webinarRoute = require('./routes/webinar.route');
const mentorRoute = require('./routes/mentor.route');
const blogRoute = require('./routes/blog.route');
const paymentRoute = require('./routes/payment.route');
const meetingRoute = require('./routes/meeting.route');
const searchRoute = require('./routes/search.route');
const questionRoute = require('./routes/question.route');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


app.use('/user', userRoute)

app.use('/admin', adminRoute)

app.use('/search', searchRoute)

app.use("/webinar", webinarRoute)

app.use("/mentor", mentorRoute)

app.use("/blog", blogRoute)

app.use("/payment", paymentRoute)

app.use("/meeting", meetingRoute)

app.use("/question", questionRoute)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
