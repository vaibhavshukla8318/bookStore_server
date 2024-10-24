const {model, Schema} = require('mongoose');

const booksSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image:{
    type: String,
    required: true
  }
  
})

const books = new model('Books', booksSchema);

module.exports = books;