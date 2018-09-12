var express = require('express');
var router = express.Router();

var resetController = require('../controllers/resetpassword')

router.get('/:token', resetController.get_reset);
router.post('/:token', resetController.post_reset);

module.exports = router;
