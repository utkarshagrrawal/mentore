const express = require("express");
const { searchMentors } = require("../controllers/searchController");

const router = express.Router();

router.get("/:search_query", searchMentors);

module.exports = router;
