const { supabase } = require("../utility/dbConnection");
const { sendForgotPasswordMail, sendNewPasswordMail } = require("../utility/mailConnection");
const { generateOtp } = require("../utility/otpConnection");
const { GenerateSalt, GeneratePassword, GenerateSignature } = require("../utility/passportUtility");

async function registerUserLogic(body) {
    const { email, password, gender, name, age, registerFor, profession, company, experience, skills } = body;

    const { data, error } = await supabase
        .from('users')
        .select()
        .eq('email', email);

    if (error) {
        return { error: error.message }
    } else if (data.length > 0) {
        return { error: 'User already exists' }
    }

    const salt = await GenerateSalt();
    const hashedPassword = await GeneratePassword(password, salt);
    const { error: registeringError } = await supabase
        .from('users')
        .insert({ email: email, password: hashedPassword, name: name, dob: age, type: registerFor, salt: salt, male: gender === 'male' ? true : false })

    if (registeringError) {
        return { error: registeringError.message }
    }

    if (registerFor === 'mentor') {
        const { error } = await supabase
            .from('mentors')
            .insert({ email: email, name: name, skills: { "skills": skills }, profession: profession, company: company, experience: experience, fees: 150, verified: false, male: gender === 'male' ? true : false });

        if (error) {
            return { error: error.message }
        }
    }

    return { success: 'User registered successfully' }
}


async function loginUserLogic(body) {
    const { email, password } = body;

    const { data, error } = await supabase
        .from('users')
        .select()
        .eq('email', email)

    if (error) {
        return { error: error.message }
    }
    if (data && data.length === 0) {
        return { error: 'User with this mail does not exists' }
    }

    const salt = data[0].salt;
    const hashedPassword = await GeneratePassword(password, salt);
    if (hashedPassword !== data[0].password) {
        return { error: 'Invalid credentials' }
    }

    const { error: loginError } = await supabase
        .from('users')
        .select('')
        .eq('email', email);

    if (loginError) {
        return { error: loginError.message }
    }

    const sign = GenerateSignature({ email: email, name: data[0].name, gender: data[0].male });

    return { success: 'Login successfull', token: sign }
}


async function sendResetPasswordOtpLogic(body) {
    const { email } = body;

    const { data, error } = await supabase
        .from('users')
        .select()
        .eq('email', email)

    if (data && data.length === 0) {
        return { error: 'User with this mail does not exists' }
    } else if (error) {
        return { error: error.message }
    }

    const checkOtp = await supabase
        .from('otp')
        .select('')
        .eq('email', email);

    if (checkOtp.data && checkOtp.data.length > 0) {
        const { error } = await supabase
            .from('otp')
            .delete()
            .eq('email', email)

        if (error) {
            return { error: error.message }
        }
    }

    const totp = generateOtp();
    const { error: otpSaveError } = await supabase
        .from('otp')
        .insert({ email: email, otp: totp, created_at: new Date() })

    if (otpSaveError) {
        return { error: otpSaveError.message }
    }

    const response = sendForgotPasswordMail(email, totp);

    if (response.error) {
        return { error: response.error }
    }

    return { success: 'Password reset OTP sent successfully' }
}


async function verifyOtpLogic(body) {
    const { email, otp } = body;

    const { data, error } = await supabase
        .from('otp')
        .select()
        .eq('email', email)
        .eq('otp', otp)

    if (data && data.length === 0) {
        return { error: 'Invalid otp' }
    }
    if (error) {
        return { error: error.message }
    }

    const { error: otpDeleteError } = await supabase
        .from('otp')
        .delete()
        .eq('email', email)

    if (otpDeleteError) {
        return { error: otpDeleteError.message }
    }

    const salt = await GenerateSalt();
    const password = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
    const hashedPassword = await GeneratePassword(password, salt);
    const { error: newError } = await supabase
        .from('users')
        .update({ password: hashedPassword, salt: salt })
        .eq('email', email)

    if (newError) {
        return { error: 'Password reset failed' }
    }

    const response = await sendNewPasswordMail(email, password);

    if (response.error) {
        return { error: response.error }
    }

    return { success: 'Otp verified successfully' }
}


async function resendOtpLogic(body) {
    const { email } = req.body;

    const { data, error } = await supabase
        .from('otp')
        .select()
        .eq('email', email)

    if (error) {
        return { error: error.message }
    }

    if (data && data.length === 0) {
        const totp = generateOtp();

        const { error } = await supabase
            .from('otp')
            .insert({ email: email, otp: totp, created_at: new Date() })

        if (error) {
            return { error: 'Otp resend failed!' }
        }

        const response = await sendForgotPasswordMail(email, totp);

        if (response.error) {
            return { error: response.error }
        }

        return { success: 'Otp resend successfull!' }
    }

    const { error: deleteOtpError } = await supabase
        .from('otp')
        .delete()
        .eq('email', email)

    if (deleteOtpError) {
        return { error: 'Otp resend failed!' }
    }

    const totp = generateOtp();

    const { error: saveOtpError } = await supabase
        .from('otp')
        .insert({ email: email, otp: totp, created_at: new Date() })

    if (saveOtpError) {
        return { error: 'Otp resend failed!' }
    }

    const response = await sendForgotPasswordMail(email, totp);
    if (response.error) {
        return { error: response.error }
    }

    return { success: 'Otp resend successfull!' }
}


async function changePasswordLogic(body, user) {
    const { password, oldPassword } = body;
    const { email } = user;

    const { data, error } = await supabase
        .from('users')
        .select()
        .eq('email', email)

    if (!error) {
        const salt = data[0].salt;
        const hashedPassword = await GeneratePassword(oldPassword, salt);

        if (data[0].password === hashedPassword) {
            const salt = await GenerateSalt();
            const hashedPassword = await GeneratePassword(password, salt);

            const { error } = await supabase
                .from('users')
                .update({ password: hashedPassword, salt: salt })
                .eq('email', email)

            if (!error) {
                return { success: 'Password changed successfully' }
            }
        }
    }
    return { error: 'Password change failed' }
}


async function userDetailsLogic(user) {
    const { email } = user;

    const { data, error } = await supabase
        .from('users')
        .select('')
        .eq('email', email)

    if (error) {
        return { error: error.message }
    }
    return { success: data[0] }
}


async function fetchBookingsWithMentorLogic(params, user) {
    const { id } = params
    const { email } = user

    const { data, error } = await supabase
        .from('mentors')
        .select('')
        .eq('uniq_id', id)

    if (error) {
        return { error: error.message }
    }

    const { data: meetingsData, error: meetingsError } = await supabase
        .from('schedule_mentors')
        .select()
        .eq('mentor_email', data[0].email)
        .eq('mentee_email', email)
        .in('status', ['payment pending', 'pending', 'approved'])

    if (meetingsError) {
        return { error: meetingsError.message }
    }

    return { success: meetingsData }
}


module.exports = {
    registerUserLogic,
    loginUserLogic,
    sendResetPasswordOtpLogic,
    verifyOtpLogic,
    resendOtpLogic,
    changePasswordLogic,
    userDetailsLogic,
    fetchBookingsWithMentorLogic,
}