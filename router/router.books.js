const express = require('express');
const router = express.Router();
const booksControllers = require("../controllers/controller.books");
const authMiddleware = require("../middlewares/middleware.auth");

router.route('/books').get(authMiddleware, booksControllers.books)
router.route('/addedBooks').post(authMiddleware, booksControllers.addBooks)


module.exports = router;