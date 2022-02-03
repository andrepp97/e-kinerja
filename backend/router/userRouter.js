const express = require('express')
const { auth } = require('../helper/auth')
const { userController } = require('../controller')

const router = express.Router()

router.post('/login', userController.userLogin)
router.post('/clockIn', userController.userClockIn)
router.post('/clockOut', userController.userClockOut)
router.post('/getAttendanceList', userController.getAttendanceList)
router.get('/getRecentTask', userController.getRecentTask)
router.get('/getRecentAttendance', userController.getRecentAttendance)
router.post('/updateDuration', userController.updateDuration)
router.post('/uploadAttachment', userController.uploadAttachment)

module.exports = router