const nodemailer = require('nodemailer');
const { GMAIL_SECRET_KEY } = require('../config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mentore.capstone@gmail.com',
    pass: GMAIL_SECRET_KEY
  }
});

const sendForgotPasswordMail = (to, otp) => {
  const mailOptions = {
    from: 'nodemailer',
    to: to,
    subject: 'Forgot password for mentore account',
    html: `<p>Hey, your otp for verification is: <strong>${otp}</strong> </p>`
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return error.message;
    }
    return info;
  });
}

const sendNewPasswordMail = (to, password) => {
  const mailOptions = {
    from: 'nodemailer',
    to: to,
    subject: 'New password for your mentore account',
    html: `<p>Hey, your new password is: <strong>${password}</strong>. Please change it ASAP. </p>`
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return error.message;
    } else {
      return info;
    }
  })
}

module.exports = {
  sendForgotPasswordMail,
  sendNewPasswordMail
}
