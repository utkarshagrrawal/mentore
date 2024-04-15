const express = require("express")
const { registerForWebinar, joinWebinarAsHost, createWebinar, fetchAllWebinars, joinWebinarAsParticipant } = require('../controllers/webinar.controller')
const { authentication } = require("../middlewares/auth.middleware")
const { removeExpiredWebinars } = require("../middlewares/webinar.middleware")

const router = express.Router()

router.get('/all', removeExpiredWebinars, fetchAllWebinars)

router.post('/create', authentication, createWebinar)

router.post('/register', authentication, registerForWebinar)

router.post('/join/host', authentication, joinWebinarAsHost)

router.post('/join/participant', authentication, joinWebinarAsParticipant)

module.exports = router