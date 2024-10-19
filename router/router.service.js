const express = require('express');
const router = express.Router();
const services = require('../controllers/controller.service');

router.route('/service').get(services)

module.exports = router;