const express = require('express')
const cors = require('cors');

const userRoute = require('./routes/userRoute');
const webinarRoute = require('./routes/webinarRoute');
const mentorRoute = require('./routes/mentorRoute');
const blogRoute = require('./routes/blogRoute');
const paymentRoute = require('./routes/paymentRoute');
const meetingRoute = require('./routes/meetingRoute');
const searchRoute = require('./routes/searchRoute');

const { linkRedis } = require('./utility/redisConnection');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

linkRedis();

app.use('/user', userRoute)

app.use('/search', searchRoute)

app.use("/webinar", webinarRoute)

app.use("/mentor", mentorRoute)

app.use("/blog", blogRoute)

app.use("/payment", paymentRoute)

app.use("/meeting", meetingRoute)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
