// Updated Books model
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
    required: true,
    validate: [isValidImageUrl, 'Invalid image URL'],
  },
  pdf: {
    type: Array,
  },
  category: [String],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  ratings: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  comments: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    replies: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  }]
});

const Books = model('Books', booksSchema);

module.exports = Books;
