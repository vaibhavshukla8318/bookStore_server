const { model, Schema } = require('mongoose');

const isValidImageUrl = (url) => {
  const regex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
  return regex.test(url);
};

const booksSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    
  validate: {
    validator: isValidImageUrl,
    message: "Invalid image URL. Please provide a valid URL that starts with http or https.",
  },
    required: true
  },
});

const Books = model('Books', booksSchema);

module.exports = Books;
