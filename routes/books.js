const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Book = require('../models/book');
const Author = require('../models/author');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

// All Books Route
router.get('/', async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title !== '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore !== '') {
    query = query.lte('publishDate', req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter !== '') {
    query = query.gte('publishDate', req.query.publishedAfter);
  }
  try {
    const books = await query.exec();
    res.render('books/index', {
      books: books,
      searchOptions: req.query
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Create Book Route
router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  });
  saveCover(book, req.body.cover);
  try {
    const newBook = await book.save();
    res.redirect(`books/${newBook.id}`)
  } catch (err) {
    console.error(err);
    renderNewPage(res, book, true);
  }
});

// Show Book Route
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author').exec()
    res.render('books/show', { book: book })
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
})

// Edit Book Route
router.get('/:id/edit', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    renderEditPage(res, book)
  } catch {
    res.redirect('/')
  }
});

async function renderNewPage(res, book, hasError = false) {
  renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book
    };
    if (hasError) params.errorMessage = 'Error Creating Book';
    res.render(`books/${form}`, params)
  } catch (err) {
    console.error(err);
    res.redirect('/books');
  }
}

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;
  try {
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      book.coverImage = Buffer.from(cover.data, 'base64');
      book.coverImageType = cover.type;
    }
  } catch (err) {
    console.error('Error parsing cover:', err);
  }
}

module.exports = router;
