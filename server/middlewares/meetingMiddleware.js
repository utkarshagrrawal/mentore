const { supabase } = require('../utility/dbConnection')


const removeExpiredMeetings = async (req, res, next) => {
    var now = new Date();

    now.setHours(now.getHours() + 5);
    now.setMinutes(now.getMinutes() + 30);

    const { error } = await supabase
        .from('schedule_mentors')
        .delete()
        .lte('end_time', now.toISOString().split('.')[0])

    if (error) {
        console.log(error.message)
    }

    next();
}


module.exports = {
    removeExpiredMeetings
}