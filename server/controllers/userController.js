const { GenerateSignature, GenerateSalt, GeneratePassword } = require("../utility/passportUtility");
const { supabase } = require('../utility/dbConnection');
const { generateOtp } = require("../utility/otpConnection");
const { sendForgotPasswordMail, sendNewPasswordMail } = require("../utility/mailConnection");

const registerUser = async (req, res) => {
  const { email, password, name, age, registerFor, profession, company, experience, skills } = req.body;
  let { data, error } = await supabase.from('users').select().eq('email', email);
  if (data && data.length > 0) {
    return res.json({ error: 'User already exists' })
  }
  let salt = await GenerateSalt();
  let hashedPassword = await GeneratePassword(password, salt);
  let newUser = await supabase.from('users').insert([{ email: email, password: hashedPassword, name: name, dob: age, type: registerFor, salt: salt }]);
  if (registerFor === 'mentor') {
    const { error } = await supabase.from('mentors').insert([{ email: email, name: name, skills: { "skills": skills }, profession: profession, company: company, experience: experience, fees: 150 }]);
    if (error) {
      return res.json({ error: error.message })
    }
  }
  if (newUser.error) {
    res.json({ error: newUser.error.message })
  } else {
    res.json({ success: 'User registered successfully' })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('email', email)
  if (error) {
    return res.json({ error: 'User account not found' })
  }
  const salt = data[0].salt;
  const hashedPassword = await GeneratePassword(password, salt);
  if (hashedPassword !== data[0].password) {
    return res.json({ error: 'Invalid credentials' })
  } else {
    let username = await supabase.from('users').select('name').eq('email', email);
    const sign = GenerateSignature({ email: email, name: username.data[0].name });
    return res.json({ success: 'User logged in successfully', token: sign, name: username.data[0].name })
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('email', email)
  if (data.length === 0) {
    res.json({ error: 'Invalid email' })
  } else {
    const checkOtp = await supabase.from('otp').select('').eq('email', email);
    if (checkOtp.data && checkOtp.data.length > 0) {
      return res.json({ error: 'Otp already sent' })
    }
    const totp = generateOtp();
    const { error } = await supabase
      .from('otp')
      .insert({
        email: email,
        otp: totp,
        created_at: new Date()
      })
    if (error) {
      return res.json({ error: error.message })
    }
    sendForgotPasswordMail(email, totp);
    setTimeout(() => {
      supabase.from('otp').delete().eq('email', email);
    }, 1000 * 60 * 15)
    res.json({ success: 'Password reset email sent successfully' })
  }
}

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const { data, error } = await supabase
    .from('otp')
    .select()
    .eq('email', email)
    .eq('otp', otp)
  if (data && data.length === 0) {
    return res.json({ error: 'Invalid otp' })
  } else if (!error) {
    const { data, error } = await supabase
      .from('otp')
      .delete()
      .eq('email', email)
    const salt = await GenerateSalt();
    const password = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
    const hashedPassword = await GeneratePassword(password, salt);
    const { error: newError } = await supabase
      .from('users')
      .update({ password: hashedPassword, salt: salt })
      .eq('email', email)
    if (!error) {
      sendNewPasswordMail(email, password);
    } else {
      return res.json({ error: 'Password reset failed' })
    }
    return res.json({ success: 'Otp verified successfully' })
  } else {
    return res.json({ error: 'Otp verification failed' })
  }
}

const resendOtp = async (req, res) => {
  const { email } = req.body;
  const { data, error } = await supabase
    .from('otp')
    .select()
    .eq('email', email)
  if (data.length === 0) {
    let totp = generateOtp();
    const { error } = await supabase
      .from('otp')
      .insert({
        email: email,
        otp: totp,
        created_at: new Date()
      })
    if (!error) {
      sendForgotPasswordMail(email, totp);
      return res.json({ success: 'Otp resend successfull!' })
    } else {
      return res.json({ error: 'Otp resend failed!' })
    }
  } else if (!error) {
    const { error } = await supabase
      .from('otp')
      .delete()
      .eq('email', email)
    let totp = generateOtp();
    const { error: newError } = await supabase
      .from('otp')
      .insert({
        email: email,
        otp: totp,
        created_at: new Date()
      })
    if (!error) {
      sendForgotPasswordMail(email, totp);
      return res.json({ success: 'Otp resend successfull!' })
    } else {
      return res.json({ error: 'Otp resend failed!' })
    }
  } else {
    return res.json({ error: 'Otp resend failed!' })
  }
}

const changepassword = async (req, res) => {
  const { password, oldPassword } = req.body;
  const { email } = req.user;
  const { data, error: newError } = await supabase
    .from('users')
    .select()
    .eq('email', email)
  if (!newError) {
    const salt = data[0].salt;
    const hashedPassword = await GeneratePassword(oldPassword, salt);
    if (data[0].password === hashedPassword) {
      const salt = await GenerateSalt();
      const hashedPassword = await GeneratePassword(password, salt);
      const { error } = await supabase
        .from('users')
        .update({ password: hashedPassword, salt: salt })
        .eq('email', email)
      if (error) {
        return res.json({ error: error.message })
      }
      return res.json({ success: 'Password changed successfully' })
    } else {
      return res.json({ error: 'Invalid old password' })
    }
  } else {
    return res.json({ error: 'Invalid email' })
  }
}

const getcurrentuser = async (req, res) => {
  const { email } = req.user;
  const { data } = await supabase
    .from('users')
    .select('')
    .eq('email', email)
  return res.json({ result: data[0] })
}


module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  changepassword,
  getcurrentuser,
  verifyOtp,
  resendOtp
}
