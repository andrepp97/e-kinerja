const express = require('express')
const { adminController } = require('../controller')

const router = express.Router()

router.get('/getAllUser', adminController.getAllUser)
router.get('/getUserById', adminController.getUserById)
router.post('/createUser', adminController.createUser)
router.post('/toogleBanUser', adminController.toogleBanUser)
router.post('/createAssignment', adminController.createAssignment)
router.post('/toogleAssignment', adminController.toogleAssignment)
router.get('/getAllAssignment', adminController.getAllAssignment)
router.get('/getAssignmentById', adminController.getAssignmentById)
router.get('/getUserAttendance', adminController.getUserAttendance)
router.get('/getAttendanceById', adminController.getAttendanceById)

module.exports = router