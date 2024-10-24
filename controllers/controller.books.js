const Book = require('../models/models.books');

const books = async (req, res)=>{
  try {
    
    const response = await Book.find();
    if(!response){
      return res.status(400).json({msg: "Book not found"})
    }

    res.status(200).json({msg:response});

  } catch (error) {
    console.log("Books", error);
  }
}

module.exports = books;