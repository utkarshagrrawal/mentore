require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY)

const sendForgotPasswordMail = async (to, otp) => {
    const mailOptions = {
        from: 'onboarding@resend.dev',
        to: process.env.GMAIL_ID,
        subject: 'Forgot password for mentore account',
        html: `<p>Hey, your otp for verification is: <strong>${otp}</strong> </p>`
    };

    const { data, error } = await resend.emails.send(mailOptions)

    if (error) {
        return error.message;
    }
    return;
}

const sendNewPasswordMail = async (to, password) => {
    const mailOptions = {
        from: 'onboarding@resend.dev',
        to: process.env.GMAIL_ID,
        subject: 'New password for your mentore account',
        html: `<p>Hey, your new password is: <strong>${password}</strong>. Please change it ASAP. </p>`
    };

    const { data, error } = await resend.emails.send(mailOptions)

    if (error) {
        return error.message;
    }
    return;
}

module.exports = {
    sendForgotPasswordMail,
    sendNewPasswordMail
}
