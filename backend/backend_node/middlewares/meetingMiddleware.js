const { supabase } = require("../utility/databaseConnection");

const removeExpiredMeetings = async (req, res, next) => {
  let now = new Date();

  /* 
        the below code is commented because the time is not in sync with the server time
    */

  // now.setHours(now.getHours() + 5);
  // now.setMinutes(now.getMinutes() + 30);

  const { error } = await supabase
    .from("schedule_mentors")
    .delete()
    .lte("end_time", now.toISOString().split(".")[0]);

  if (error) {
    console.log(error.message);
  }

  next();
};

module.exports = {
  removeExpiredMeetings,
};
