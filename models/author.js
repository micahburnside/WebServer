const mongoose = require('mongoose')
const Book = require('./book')

const checkAuthorHasBooks = function (next) {
  Book.find({author: this.id}, (err, books) => {
    if (err) {
      next(err);
    } else if (books.length > 0) {
      next(new Error('This author has books still'));
    } else {
      next();
    }
  });
};

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

authorSchema.pre('remove', checkAuthorHasBooks);

module.exports = mongoose.model('Author', authorSchema);
