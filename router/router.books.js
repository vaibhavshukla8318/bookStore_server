const express = require('express');
const router = express.Router();
const books = require("../controllers/controller.books");

router.route('/books').get(books)

module.exports = router;