const express = require("express");
const {
  registerForWebinar,
  joinWebinarAsHost,
  createWebinar,
  fetchAllWebinars,
  joinWebinarAsParticipant,
} = require("../controllers/webinarController");
const { authentication } = require("../middlewares/authMiddleware");
const { removeExpiredWebinars } = require("../middlewares/webinarMiddleware");

const router = express.Router();

router.get("/all", removeExpiredWebinars, fetchAllWebinars);

router.post("/create", authentication, createWebinar);
router.post("/register", authentication, registerForWebinar);
router.post("/join/host", authentication, joinWebinarAsHost);
router.post("/join/participant", authentication, joinWebinarAsParticipant);

module.exports = router;
