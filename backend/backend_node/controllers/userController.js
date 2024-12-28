const {
  changePasswordLogic,
  registerUserLogic,
  loginUserLogic,
  sendResetPasswordOtpLogic,
  verifyOtpLogic,
  resendOtpLogic,
  userDetailsLogic,
  fetchBookingsWithMentorLogic,
} = require("../logic/userLogic");

const registerUser = async (req, res) => {
  const response = registerUserLogic(req.body);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ success: response.success });
};

const loginUser = async (req, res) => {
  const response = await loginUserLogic(req.body);
  if (response.error) {
    return res.json({ error: response.error });
  }
  let cookieOptions = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    Path: "/",
  };
  if (process.env.ENV === "production") {
    cookieOptions.secure = true;
    cookieOptions.sameSite = "None";
  }
  res.cookie("SESSION_ID", response.token, cookieOptions);
  return res.json({ success: response.success });
};

const forgotPassword = async (req, res) => {
  const response = await sendResetPasswordOtpLogic(req.body);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json(response);
};

const verifyOtp = async (req, res) => {
  const response = await verifyOtpLogic(req.body);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json(response);
};

const changepassword = async (req, res) => {
  const response = await changePasswordLogic(req.body, req.user);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ success: response.success });
};

const currentUserDetails = async (req, res) => {
  const response = await userDetailsLogic(req.user);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.success });
};

const fetchBookingsWithMentor = async (req, res) => {
  const response = await fetchBookingsWithMentorLogic(req.params, req.user);
  if (response.error) {
    return res.json({ error: response.error });
  }
  return res.json({ result: response.success });
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  changepassword,
  currentUserDetails,
  verifyOtp,
  fetchBookingsWithMentor,
};
