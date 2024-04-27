const { changePasswordLogic, registerUserLogic, loginUserLogic, sendResetPasswordOtpLogic, verifyOtpLogic, resendOtpLogic, userDetailsLogic, fetchBookingsWithMentorLogic } = require("../logic/user.logic");

const registerUser = async (req, res) => {
    const response = registerUserLogic(req.body);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}

const loginUser = async (req, res) => {
    const response = await loginUserLogic(req.body);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success, token: response.token })
}

const forgotPassword = async (req, res) => {
    const response = await sendResetPasswordOtpLogic(req.body);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json(response)
}

const verifyOtp = async (req, res) => {
    const response = await verifyOtpLogic(req.body);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}

const resendOtp = async (req, res) => {
    const response = await resendOtpLogic(req.body);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}

const changepassword = async (req, res) => {
    const response = await changePasswordLogic(req.body, req.user);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}

const currentUserDetails = async (req, res) => {
    const response = await userDetailsLogic(req.user);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ result: response.success })
}

const fetchBookingsWithMentor = async (req, res) => {
    const response = await fetchBookingsWithMentorLogic(req.params, req.user);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ result: response.success })
}

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    changepassword,
    currentUserDetails,
    verifyOtp,
    resendOtp,
    fetchBookingsWithMentor
}
