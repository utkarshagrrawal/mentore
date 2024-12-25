const { supabase } = require("../utility/databaseConnection");
const { sendMail } = require("../utility/mailUtility");
const { generateOtp } = require("../utility/otpConnection");
const {
  GenerateSalt,
  GeneratePassword,
  GenerateSignature,
} = require("../utility/passportUtility");

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

  const salt = GenerateSalt();
  const hashedPassword = GeneratePassword(password, salt);
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
  const hashedPassword = GeneratePassword(password, salt);
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

  const { error: deleteOldOTPError } = await supabase
    .from("otp")
    .delete()
    .eq("email", email);

  if (deleteOldOTPError) {
    return { error: deleteOldOTPError.message };
  }

  const totp = generateOtp();
  const { error: otpSaveError } = await supabase
    .from("otp")
    .insert({ email: email, otp: totp, created_at: new Date() });

  if (otpSaveError?.message) {
    return { error: otpSaveError.message };
  }

  const passwordResetEmailResponse = sendMail({
    from: process.env.NODEMAILER_GMAIL_USER,
    to: email,
    subject: "Mentore: Password Reset OTP",
    html: `
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
      <table align="center" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <tr>
                <td style="background-color: #4caf50; color: #ffffff; text-align: center; padding: 20px;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Mentore</h1>
                  <p style="margin: 5px 0 0; font-size: 16px;">Connecting Mentors and Mentees Seamlessly</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; color: #555555; text-align: left; line-height: 1.6;">
                  <h2 style="color: #333333; font-size: 22px; margin-top: 0;">Hello,</h2>
                  <p style="margin: 10px 0;">We received a request to verify your email address. Please use the OTP below to proceed:</p>
                  <p style="text-align: center;">
                    <span style="display: inline-block; background-color: #f0f8ff; padding: 15px 30px; font-size: 24px; font-weight: bold; color: #333333; border-radius: 5px; border: 1px solid #e0e0e0;">
                      ${totp}
                    </span>
                  </p>
                  <p style="margin: 20px 0;">This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
                  <p style="margin: 0;">If you did not request this OTP, please ignore this email or contact our support team immediately.</p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f9f9f9; color: #777777; text-align: center; padding: 15px;">
                  <p style="margin: 0; font-size: 14px;">Need help? Contact us at <a href="mailto:mentorecapstone2024@gmail.com" style="color: #4caf50; text-decoration: none;">mentorecapstone2024@gmail.com</a></p>
                  <p style="margin: 5px 0 0; font-size: 12px;">© 2024 Mentore. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>`,
  });

  if (passwordResetEmailResponse.error) {
    return { error: passwordResetEmailResponse.error };
  }

  return { success: "Password reset OTP sent successfully" };
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

  const salt = GenerateSalt();
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 16; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  const hashedPassword = GeneratePassword(password, salt);
  const { error: newError } = await supabase
    .from("users")
    .update({ password: hashedPassword, salt: salt })
    .eq("email", email);

  if (newError?.message) {
    return { error: "Password reset failed" };
  }

  const newPasswordEmailResponse = sendMail({
    from: process.env.NODEMAILER_GMAIL_USER,
    to: email,
    subject: "Mentore: Temporary Password",
    html: `
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
      <table align="center" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <tr>
                <td style="background-color: #4caf50; color: #ffffff; text-align: center; padding: 20px;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Mentore</h1>
                  <p style="margin: 5px 0 0; font-size: 16px;">Connecting Mentors and Mentees Seamlessly</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; color: #555555; text-align: left; line-height: 1.6;">
                  <h2 style="color: #333333; font-size: 22px; margin-top: 0;">Hello,</h2>
                  <p style="margin: 10px 0;">We have generated a temporary password for your account as requested. Please use the password below to log in and update it immediately:</p>
                  <p style="text-align: center;">
                    <span style="display: inline-block; background-color: #f0f8ff; padding: 15px 30px; font-size: 24px; font-weight: bold; color: #333333; border-radius: 5px; border: 1px solid #e0e0e0;">
                      ${password}
                    </span>
                  </p>
                  <p style="margin: 20px 0;">For your account's security, we strongly recommend changing your password as soon as possible. To update your password, please visit your account settings after logging in.</p>
                  <p style="margin: 0;">If you did not request this temporary password, please contact our support team immediately.</p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f9f9f9; color: #777777; text-align: center; padding: 15px;">
                  <p style="margin: 0; font-size: 14px;">Need help? Contact us at <a href="mailto:mentorecapstone2024@gmail.com" style="color: #4caf50; text-decoration: none;">mentorecapstone2024@gmail.com</a></p>
                  <p style="margin: 5px 0 0; font-size: 12px;">© 2024 Mentore. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>`,
  });

  if (newPasswordEmailResponse.error) {
    return { error: newPasswordEmailResponse.error };
  }

  return { success: "Otp verified successfully" };
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
  changePasswordLogic,
  userDetailsLogic,
  fetchBookingsWithMentorLogic,
};
