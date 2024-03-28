const { supabase } = require("../utility/dbConnection");

const removeExpiredWebinars = async (req, res, next) => {
    var now = new Date();

    const { error } = await supabase
        .from('webinar')
        .delete()
        .lt('end_time', now.toISOString().split('.')[0])

    if (error) {
        console.log(error.message)
    }

    next();
}


module.exports = {
    removeExpiredWebinars
}