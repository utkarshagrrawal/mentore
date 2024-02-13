const { GenerateSignature, GenerateSalt, GeneratePassword } = require("../utility/passportUtility");
const { supabase } = require('../utility/dbConnection');

const registerUser = async (req, res) => {
  const { email, password, name, age, registerFor } = req.body;
  let checkUser = await supabase.from('users').select().eq('email', email);
  if (checkUser.data.length > 0) {
    return res.json({ error: 'User already exists' })
  }
  let salt = await GenerateSalt();
  let hashedPassword = await GeneratePassword(password, salt);
  let newUser = await supabase.from('users').insert([{ email: email, password: hashedPassword, name: name, dob: age, type: registerFor, salt: salt }]);
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
  const salt = data[0].salt;
  const hashedPassword = await GeneratePassword(password, salt);

  if (hashedPassword !== data[0].password) {
    res.json({ error: 'Invalid credentials' })
  } else {
    let username = await supabase.from('users').select('name').eq('email', email);
    const sign = GenerateSignature({ email: email, name: username.data[0].name });
    res.json({ success: 'User logged in successfully', token: sign, name: username.data[0].name })
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
    res.json({ success: 'Password reset email sent successfully' })
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
  getcurrentuser,
}
