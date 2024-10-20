const express = require('express');
const adminControllers = require('../controllers/controller.admin')
const authMiddleware = require("../middlewares/middleware.auth");
const adminMiddleware = require("../middlewares/middleware.admin");

const router = express.Router();
router.route('/users').get(authMiddleware, adminMiddleware, adminControllers.getAllUsers);
router.route('/contact').get(authMiddleware, adminMiddleware, adminControllers.getAllContact)

module.exports = router;