const { supabase } = require("../utility/database.connection");

async function payLogic(params) {
  const { id } = params;

  const { data, error } = await supabase
    .from("schedule_mentors")
    .select()
    .eq("uniq_id", id);

  if (!error && data.length > 0) {
    return { success: id };
  }

  return { error: "Payment failed" };
}

async function paymentSuccessLogic(params) {
  const { id } = params;

  const { data, error } = await supabase
    .from("schedule_mentors")
    .update({ status: "approved" })
    .eq("uniq_id", id);

  if (error) {
    return { error: error.message };
  }

  return { success: "Payment successful and meeting booked" };
}

module.exports = {
  payLogic,
  paymentSuccessLogic,
};
