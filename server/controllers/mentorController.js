const { supabase } = require("../utility/dbConnection")

const getAllSkills = async (req, res) => {
  const { data, error } = await supabase
    .from('domains')
    .select('')
  if (error) {
    return res.json({ error: error.message })
  } else {
    return res.json({ result: data })
  }
}

const getMentorSkills = async (req, res) => {
  const { data, error } = await supabase
    .from('mentors')
    .select('skills')
    .eq('email', req.user.email)
  if (error) {
    return res.json({ error: error.message })
  } else {
    return res.json({ result: data[0].skills })
  }
}


module.exports = {
  getAllSkills,
  getMentorSkills
}
