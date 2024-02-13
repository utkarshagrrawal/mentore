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

module.exports = {
  getAllSkills
}
