const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const GenerateSignature = (payload) => {
  return jwt.sign(payload, process.env.APP_SECRET_KEY, { expiresIn: "1d" });
};

const GenerateSalt = () => {
  return bcrypt.genSaltSync();
};

const GeneratePassword = (password, salt) => {
  return bcrypt.hashSync(password, salt);
};

module.exports = {
  GenerateSignature,
  GenerateSalt,
  GeneratePassword,
};
