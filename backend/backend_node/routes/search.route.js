const express = require("express");
const { searchMentors } = require("../controllers/search.controller");

const router = express.Router();

router.get("/:search_query", searchMentors);

module.exports = router