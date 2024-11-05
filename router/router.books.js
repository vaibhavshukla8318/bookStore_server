// router.books.js

const express = require('express');
const router = express.Router();
const booksControllers = require("../controllers/controller.books");
const authMiddleware = require("../middlewares/middleware.auth");

// get all books, get books by pagination, get books by id, update books by id, add books, delete books by id

router.route('/allBooks').get(authMiddleware, booksControllers.getAllBooks)
router.route('/books').get(authMiddleware, booksControllers.books)
router.route('/books/:id').get(authMiddleware, booksControllers.getBooksById)
router.route('/books/update/:id').patch(authMiddleware, booksControllers.updateBookById)
router.route('/addedBooks').post(authMiddleware, booksControllers.addBooks)
router.route('/books/delete/:id').delete(authMiddleware, booksControllers.deleteBook)
router.get('/books/category/:category', booksControllers.getBooksByCategory);
router.get('/books/categoryPagination/:category', booksControllers.getBooksByCategoryPagination);



// Likes, Dislikes, Rate
router.put('/books/:bookId/like', authMiddleware, booksControllers.likeBook);
router.put('/books/:bookId/dislike', authMiddleware, booksControllers.dislikeBook);
router.put('/books/:bookId/rate', authMiddleware, booksControllers.rateBook);

// get comments, post comments, reply comments
router.post('/books/:bookId/comment', authMiddleware, booksControllers.addComment);
router.post('/books/:bookId/comment/:commentId/reply', authMiddleware, booksControllers.addReply);
router.get('/books/:bookId/comments', authMiddleware, booksControllers.getComments);

module.exports = router;