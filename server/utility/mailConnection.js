require('dotenv').config();
const nodemailer = require('nodemailer');

const createTransporter = async () => {
    var transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    return transporter;
}

const sendForgotPasswordMail = async (to, otp) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: 'Forgot password for mentore account',
        html: `<p>Hey, your otp for verification is: <strong>${otp}</strong> </p>`
    };

    const transporter = await createTransporter();

    console.log(transporter)

    transporter.sendMail(mailOptions, function (error, info) {
        console.log('sending mail')
        if (error) {
            console.log(error);
            return error.message;
        }
        console.log(info)
        return info;
    })
}

const sendNewPasswordMail = (to, password) => {
    const mailOptions = {
        from: 'nodemailer',
        to: to,
        subject: 'New password for your mentore account',
        html: `<p>Hey, your new password is: <strong>${password}</strong>. Please change it ASAP. </p>`
    };
    transporter.sendMail(mailOptions, function (error, info) {
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
