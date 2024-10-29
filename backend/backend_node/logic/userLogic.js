const { supabase } = require("../utility/databaseConnection");
const { generateOtp } = require("../utility/otpConnection");
const {
  GenerateSalt,
  GeneratePassword,
  GenerateSignature,
} = require("../utility/passportUtility");
require("dotenv").config();

async function registerUserLogic(body) {
  const {
    email,
    password,
    gender,
    name,
    dob,
    registerFor,
    profession,
    company,
    experience,
    skills,
  } = body;

  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("email", email);

  if (error) {
    return { error: error.message };
  } else if (data.length > 0) {
    return { error: "User already exists" };
  }

  const salt = await GenerateSalt();
  const hashedPassword = await GeneratePassword(password, salt);
  const { error: registeringError } = await supabase.from("users").insert({
    email: email,
    password: hashedPassword,
    name: name,
    dob: dob,
    type: registerFor,
    salt: salt,
    gender: gender === "male" ? true : false,
  });
  if (registeringError?.message) {
    return { error: registeringError.message };
  }
  if (registerFor === "mentor") {
    const { error } = await supabase.from("mentors").insert({
      email: email,
      name: name,
      skills: { skills: skills },
      profession: profession,
      company: company,
      experience: experience,
      fees: 150,
      verified: false,
      gender: gender === "male" ? true : false,
    });

    if (error) {
      return { error: error.message };
    }
  }

  return { success: "User registered successfully" };
}

async function loginUserLogic(body) {
  const { email, password } = body;

  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("email", email);

  if (error) {
    return { error: error.message };
  }
  if (data && data.length === 0) {
    return { error: "User with this mail does not exists" };
  }

  const salt = data[0].salt;
  const hashedPassword = await GeneratePassword(password, salt);
  if (hashedPassword !== data[0].password) {
    return { error: "Invalid credentials" };
  }

  const { error: loginError } = await supabase
    .from("users")
    .select("")
    .eq("email", email);

  if (loginError?.message) {
    return { error: loginError.message };
  }

  const sign = GenerateSignature({
    email: email,
    name: data[0].name,
    gender: data[0].gender,
  });

  return { success: "Login successfull", token: sign };
}

async function sendResetPasswordOtpLogic(body) {
  const { email } = body;

  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("email", email);

  if (data && data.length === 0) {
    return { error: "User with this mail does not exists" };
  } else if (error) {
    return { error: error.message };
  }

  const checkOtp = await supabase.from("otp").select("").eq("email", email);

  if (checkOtp.data && checkOtp.data.length > 0) {
    const { error } = await supabase.from("otp").delete().eq("email", email);

    if (error) {
      return { error: error.message };
    }
  }

  const totp = generateOtp();
  const { error: otpSaveError } = await supabase
    .from("otp")
    .insert({ email: email, otp: totp, created_at: new Date() });

  if (otpSaveError?.message) {
    return { error: otpSaveError.message };
  }

  return {
    success: "Password reset OTP sent successfully",
    otp: totp,
    emailServiceID: process.env.EMAILJS_SERVICE_ID,
    emailPublicKey: process.env.EMAILJS_PUBLIC_KEY,
    emailPrivateKey: process.env.EMAILJS_PRIVATE_KEY,
  };
}

async function verifyOtpLogic(body) {
  const { email, otp } = body;

  const { data, error } = await supabase
    .from("otp")
    .select()
    .eq("email", email)
    .eq("otp", otp);

  if (data && data.length === 0) {
    return { error: "Invalid otp" };
  }
  if (error) {
    return { error: error.message };
  }

  const { error: otpDeleteError } = await supabase
    .from("otp")
    .delete()
    .eq("email", email);

  if (otpDeleteError?.message) {
    return { error: otpDeleteError.message };
  }

  const salt = await GenerateSalt();
  const password =
    email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1);
  const hashedPassword = await GeneratePassword(password, salt);
  const { error: newError } = await supabase
    .from("users")
    .update({ password: hashedPassword, salt: salt })
    .eq("email", email);

  if (newError?.message) {
    return { error: "Password reset failed" };
  }

  return {
    success: "Otp verified successfully",
    tempPassword: password,
    emailServiceID: process.env.EMAILJS_SERVICE_ID,
    emailPublicKey: process.env.EMAILJS_PUBLIC_KEY,
    emailPrivateKey: process.env.EMAILJS_PRIVATE_KEY,
  };
}

async function resendOtpLogic(body) {
  const { email } = body;

  const { data, error } = await supabase
    .from("otp")
    .select()
    .eq("email", email);

  if (error) {
    return { error: error.message };
  }

  if (data && data.length === 0) {
    const totp = generateOtp();

    const { error } = await supabase
      .from("otp")
      .insert({ email: email, otp: totp, created_at: new Date() });

    if (error) {
      return { error: "Otp resend failed!" };
    }

    const response = await sendForgotPasswordMail(email, totp);

    if (response.error) {
      return { error: response.error };
    }

    return { success: "Otp resend successfull!" };
  }

  const { error: deleteOtpError } = await supabase
    .from("otp")
    .delete()
    .eq("email", email);

  if (deleteOtpError?.message) {
    return { error: "Otp resend failed!" };
  }

  const totp = generateOtp();

  const { error: saveOtpError } = await supabase
    .from("otp")
    .insert({ email: email, otp: totp, created_at: new Date() });

  if (saveOtpError?.message) {
    return { error: "Otp resend failed!" };
  }

  return {
    success: "Otp resend successfull!",
    otp: totp,
    emailServiceID: process.env.EMAILJS_SERVICE_ID,
    emailPublicKey: process.env.EMAILJS_PUBLIC_KEY,
    emailPrivateKey: process.env.EMAILJS_PRIVATE_KEY,
  };
}

async function changePasswordLogic(body, user) {
  const { password, oldPassword } = body;
  const { email } = user;

  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("email", email);

  if (!error) {
    const salt = data[0].salt;
    const hashedPassword = await GeneratePassword(oldPassword, salt);

    if (data[0].password === hashedPassword) {
      const salt = await GenerateSalt();
      const hashedPassword = await GeneratePassword(password, salt);

      const { error } = await supabase
        .from("users")
        .update({ password: hashedPassword, salt: salt })
        .eq("email", email);

      if (!error) {
        return { success: "Password changed successfully" };
      }
    }
  }
  return { error: "Password change failed" };
}

async function userDetailsLogic(user) {
  const { email } = user;

  const { data, error } = await supabase
    .from("users")
    .select("")
    .eq("email", email);

  if (error) {
    return { error: error.message };
  }
  return {
    success: {
      email: data[0].email,
      name: data[0].name,
      dob: data[0].dob,
      type: data[0].type,
      gender: data[0].gender,
    },
  };
}

async function fetchBookingsWithMentorLogic(params, user) {
  const { id } = params;
  const { email } = user;

  const { data, error } = await supabase
    .from("mentors")
    .select("")
    .eq("uniq_id", id);

  if (error) {
    return { error: error.message };
  }

  const { data: meetingsData, error: meetingsError } = await supabase
    .from("schedule_mentors")
    .select()
    .eq("mentor_email", data[0].email)
    .eq("mentee_email", email)
    .in("status", ["payment pending", "pending", "approved"]);

  if (meetingsError?.message) {
    return { error: meetingsError.message };
  }

  return { success: meetingsData };
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
};
