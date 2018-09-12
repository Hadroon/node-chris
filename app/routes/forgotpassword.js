var express = require('express');
var router = express.Router();

var forgotController = require('../controllers/forgotpassword')

router.get('/', forgotController.get_forgot);
router.post('/', forgotController.post_forgot);

module.exports = router;
