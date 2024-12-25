const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_GMAIL_USER,
      pass: process.env.NODEMAILER_GMAIL_PASSWORD,
    },
  });
};

const sendMail = (mailOptions) => {
  const transporter = createTransporter();
  let response = {};
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      response = { error: error };
    }
    response = { success: info };
  });
  return response;
};

module.exports = { sendMail };
