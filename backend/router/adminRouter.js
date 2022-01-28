const express = require('express')
const { adminController } = require('../controller')

const router = express.Router()

router.get('/getAllUser', adminController.getAllUser)
router.post('/createUser', adminController.createUser)
router.post('/toogleBanUser', adminController.toogleBanUser)
router.post('/createAssignment', adminController.createAssignment)
router.post('/toogleAssignment', adminController.toogleAssignment)
router.get('/getAllAssignment', adminController.getAllAssignment)

module.exports = router