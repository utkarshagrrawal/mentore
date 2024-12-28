const express = require("express");
const {
  fetchPendingVerifications,
  approveMentor,
  rejectMentor,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/pending-verifications", fetchPendingVerifications);

router.put("/verify-mentor", approveMentor);
router.put("/reject-mentor", rejectMentor);

module.exports = router;
