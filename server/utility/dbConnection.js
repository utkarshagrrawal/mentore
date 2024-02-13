const { createClient } = require('@supabase/supabase-js')
const { SUPABASE_URL, SUPABASE_ANON_KEY } = require('../config');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { db: { schema: 'mentore' } })

module.exports = {
  supabase
}
