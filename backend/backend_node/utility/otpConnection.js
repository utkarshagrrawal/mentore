const generateOtp = () => {
  let otp = "";
  let digists = "0123456789";
  for (let i = 0; i < 6; i++) {
    otp += digists[Math.floor(Math.random() * 10)];
  }
  return otp;
};

module.exports = {
  generateOtp,
};
