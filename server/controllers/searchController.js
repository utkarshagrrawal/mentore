const { searchMentorsLogic } = require("../businessLogic/searchLogic");

const searchMentors = async (req, res) => {
    const response = await searchMentorsLogic(req.params);
    if (response.error) {
        return res.json({ error: response.error });
    }
    return res.json({ response: response.success });
}

module.exports = {
    searchMentors,
}