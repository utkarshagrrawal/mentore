const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  { db: { schema: "mentore" } }
);

module.exports = {
  supabase,
};
