// Controller.books.js

const fs = require('fs');
const path = require('path');
const Book = require('../models/models.books');
const User = require('../models/model.user');
const { isAborted } = require('zod');

const dataFilePath = path.join(__dirname, '../data.json');


// Function to update data.json
const updateDataFile = async () => {
  try {
    const books = await Book.find();
    fs.writeFileSync(dataFilePath, JSON.stringify(books, null, 2), 'utf8');
    console.log('data.json file has been updated');
  } catch (error) {
    console.error('Error updating data.json:', error.message);
  }
};


// get All books
const getAllBooks = async (req, res) => {
  try {
    const book = await Book.find().sort({_id: -1});
    if(!book){
      return res.status(404).json({ msg: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error(error);
  }
}



const getBooksByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    let filter = {};
    let sort = {};

    switch (category) {
      case 'popular':
        sort = { likes: -1 };
        break;
      case 'highRated':
        sort = { averageRating: -1 };
        break;
      case 'recent':
        sort = { _id: -1 };
        break;
      default:
        filter = { category };
        sort = { _id: -1 };
        break;
    }

    const books = await Book.find(filter).sort(sort);

    if (!books.length) {
      return res.status(404).json({ message: `No books found for category: ${category}` });
    }

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by category", error: error.message });
  }
};

const getBooksByCategoryPagination = async (req, res) => {
  try {
    const category = req.params.category;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};
    let sort = {};

    switch (category) {
      case 'popular':
        sort = { likes: -1 };
        break;
      case 'highRated':
        sort = { averageRating: -1 };
        break;
      case 'recent':
        sort = { _id: -1 };
        break;
      default:
        filter = { category };
        sort = { _id: -1 };
        break;
    }

    const books = await Book.find(filter).sort(sort).skip(skip).limit(limit);
    const totalItems = await Book.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    if (!books.length) {
      return res.status(404).json({ message: `No books found for category: ${category}` });
    }

    res.status(200).json({
      books,
      totalItems,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by category", error: error.message });
  }
};







// books using query(limit, page)
const books = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    let response = await Book.find().sort({ _id: -1 }); 

    // Apply skip and limit for pagination
    response = response.slice(skip, skip + limit);

    // Count total documents 
    const totalItems = await Book.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);

    if (!response.length) {
      return res.status(400).json({ msg: "Book not found" });
    }

    res.status(200).json({
      response,
      totalItems,
      totalPages,
      currentPage: page,
    });

  } catch (error) {
    console.log("Books", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// get books by id(single book)

const getBooksById = async (req, res) => {
  try {
    const id = req.params.id
    const book = await Book.findOne({_id: id});

    if(!book){
      return res.status(404).json({message: "No book found with this ID"});
    }
    console.log(book)
    res.status(200).json(book);
  } catch (error) {
    console.log("Books", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


 // update books using id
const updateBookById = async (req, res) =>{
  try {
    const id = req.params.id;
    const updateBook = req.body; 
    const updatedBook = await Book.updateOne({_id: id}, {$set:updateBook});

    if(!updatedBook){
      return res.status(404).json({ message: "No book found with this ID" });
    } 

   await updateDataFile();

   res.status(200).json({ message: "Book updated successfully", updatedBook });

  } catch (error) {
    console.log("Books", error);
  }
}



// add books
const addBooks = async (req, res) => {
  try {
    const { title, author, image, pdf, category } = req.body;
    const titleExist = await Book.findOne({ title });

    if (titleExist) {
      return res.status(400).json({ msg: "This book already exists with this title" });
    }

    // Add the new book to the database
    const addBook = await Book.create({
       title, author, image, pdf, category
      });

   
    await updateDataFile();

    res.status(200).json({ msg: "Your new book has been added successfully", addBook });
  } catch (error) {
    console.log("Error in adding a book from controllers", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// delete books by id
const deleteBook = async (req, res) => {
  try {
    const id = req.params.id;

    // Delete book from MongoDB
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ message: "No book found with this ID" });
    }

    await updateDataFile(); 

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error in deleting a book", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};





// Like a book
const likeBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // if the user already liked the book
    if (book.likes.includes(userId)) {
      return res.status(400).json({ message: 'You already liked this book' });
    }

    // Remove from dislikes if the user previously disliked
    book.dislikes = book.dislikes.filter(id => id.toString() !== userId.toString());
    book.likes.push(userId);

    const updatedBook = await Book.findById(bookId).populate('likes', 'username email');
    await book.save();
    await updateDataFile();

    res.status(200).json({ message: 'Book liked',likes: updatedBook.likes, likes: book.likes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Dislike a book
const dislikeBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    //  if the user already disliked the book
    if (book.dislikes.includes(userId)) {
      return res.status(400).json({ message: 'You already disliked this book' });
    }

    // Remove from likes if the user previously liked
    book.likes = book.likes.filter(id => id.toString() !== userId.toString());
    book.dislikes.push(userId);

    await book.save();
    await updateDataFile();

    res.status(200).json({ message: 'Book disliked', dislikes: book.dislikes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Rate a book
const rateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating } = req.body;
    const userId = req.user._id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user has already rated the book
    const existingRating = book.ratings.find(r => r.userId.toString() === userId.toString());

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      book.ratings.push({ userId, rating });
    }

    // Calculate the new average rating
    const totalRatings = book.ratings.length;
    const sumRatings = book.ratings.reduce((sum, r) => sum + r.rating, 0);
    book.averageRating = sumRatings / totalRatings;

    await book.save();
    await updateDataFile();

    res.status(200).json({ message: 'Book rated successfully', averageRating: book.averageRating, ratings: book.ratings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Add a comment to a book
// const addComment = async (req, res) => {
//   try {
//     const { bookId } = req.params;
//     const { content } = req.body;
//     const userId = req.user._id;

//     if (!content || content.trim() === '') {
//       return res.status(400).json({ message: 'Comment content cannot be empty' });
//     }

//     const book = await Book.findById(bookId);

//     if (!book) {
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     const comment = { userId, content };
//     book.comments.push(comment);

//     await book.save();
//     await updateDataFile();

//     res.status(201).json({ message: 'Comment added', comments: book.comments });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };




const addComment = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment content cannot be empty' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const user = await User.findById(userId);
    const comment = { userId, content, email: user.email };

    book.comments.push(comment);
    await book.save();
    await updateDataFile();

    res.status(201).json({ message: 'Comment added', comments: book.comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Add a reply to a comment
// const addReply = async (req, res) => {
//   try {
//     const { bookId, commentId } = req.params;
//     const { content } = req.body;
//     const userId = req.user._id;

//     if (!content || content.trim() === '') {
//       return res.status(400).json({ message: 'Reply content cannot be empty' });
//     }

//     const book = await Book.findById(bookId);

//     if (!book) {
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     const comment = book.comments.id(commentId);
//     if (!comment) {
//       return res.status(404).json({ message: 'Comment not found' });
//     }

//     const reply = { userId, content };
//     comment.replies.push(reply);

//     await book.save();
//     await updateDataFile();

//     res.status(201).json({ message: 'Reply added', replies: comment.replies });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };





const addReply = async (req, res) => {
  try {
    const { bookId, commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Reply content cannot be empty' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const comment = book.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const user = await User.findById(userId);
    const reply = { userId, content, email: user.email };

    comment.replies.push(reply);
    await book.save();
    await updateDataFile();

    res.status(201).json({ message: 'Reply added', replies: comment.replies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all comments
const getComments = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId)
      .populate('comments.userId', 'username email')
      .populate('comments.replies.userId', 'username email');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ comments: book.comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports = {getAllBooks, books, addBooks, getBooksById, updateBookById, deleteBook, likeBook, dislikeBook, rateBook, addComment, getComments, addReply, getBooksByCategory, getBooksByCategoryPagination};