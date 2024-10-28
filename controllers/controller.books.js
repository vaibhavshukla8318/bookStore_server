const Book = require('../models/models.books');

const books = async (req, res)=>{
  try {
    
    const page = parseInt(req.query.page) || 1;  // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit;

    const response = await Book.find().skip(skip).limit(limit);

    // Count total documents
    const totalItems = await Book.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);
    if(!response){
      return res.status(400).json({msg: "Book not found"})
    }

    res.status(200).json({
      response,
      totalItems,
      totalPages,
      currentPage: page,
    });

  } catch (error) {
    console.log("Books", error);
  }
}


// Adding a books
const addBooks = async (req, res)=>{
  try {
      const {title, author, image} = req.body;
      const titleExist = await Book.findOne({title});
      if(titleExist){
        return res.status(400).json({msg: "This books is already exist with this title"})
      }
 
      const addBook = await Book.create({title, author, image});

      res.status(200).json({msg: "You New Books Is Added Successfully", addBook});
  } catch (error) {
    console.log("error in adding a books from controllers", error.message)
  }
}

module.exports = {books, addBooks};