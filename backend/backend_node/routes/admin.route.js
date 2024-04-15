const express = require('express')
const { fetchPendingVerifications, approveMentor, rejectMentor } = require('../controllers/admin.controller')

const router = express.Router()

router.get('/pending-verifications', fetchPendingVerifications)

router.put('/verify-mentor', approveMentor)

router.put('/reject-mentor', rejectMentor)

module.exports = router