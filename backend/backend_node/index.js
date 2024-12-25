const express = require("express");
const cors = require("cors");

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const webinarRoute = require("./routes/webinarRoute");
const mentorRoute = require("./routes/mentorRoute");
const blogRoute = require("./routes/blogRoute");
const paymentRoute = require("./routes/paymentRoute");
const meetingRoute = require("./routes/meetingRoute");
const searchRoute = require("./routes/searchRoute");
const questionRoute = require("./routes/questionRoute");

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://mentormentee.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/search", searchRoute);
app.use("/webinar", webinarRoute);
app.use("/mentor", mentorRoute);
app.use("/blog", blogRoute);
app.use("/payment", paymentRoute);
app.use("/meeting", meetingRoute);
app.use("/question", questionRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
