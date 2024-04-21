require('dotenv').config();
const emailjs = require('@emailjs/browser')

const sendForgotPasswordMail = async (to, otp) => {
	const templateParams = {
		reply_to: to,
		message: `Hey, your otp for verification is: ${otp}. Please do not share it with anyone.`
	};

	try {
		await emailjs.send(process.env.EMAIL_SERVICE_ID, 'template_mdm21jv', { templateParams }, {
			publicKey: process.env.EMAILJS_PUBLIC_KEY,
			privateKey: process.env.EMAILJS_PRIVATE_KEY
		});
		return { success: 'Email sent successfully' };
	} catch (error) {
		console.error("Error sending email:", error);
		return { error: error.message };
	}
}

const sendNewPasswordMail = async (to, password) => {
	const templateParams = {
		reply_to: to,
		message: `Hey, your new password is: ${password}. Please change it ASAP.`
	};

	try {
		await emailjs.send(process.env.EMAIL_SERVICE_ID, 'template_531nigr', templateParams, {
			publicKey: process.env.EMAILJS_PUBLIC_KEY,
			privateKey: process.env.EMAILJS_PRIVATE_KEY
		});
		return { success: 'Email sent successfully' };
	} catch (error) {
		console.error("Error sending email:", error);
		return { error: error.message };
	}
}

module.exports = {
	sendForgotPasswordMail,
	sendNewPasswordMail
}
