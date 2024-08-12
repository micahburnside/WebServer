const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const {query} = require("express");
const res = require("express/lib/response");
const Book = require("../models/book");
// All Authors Route
router.get('/', async (req, res) => {
let searchOptions = {}
  if(req.query.name != null && req.query.name !== ''){
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  let authors = [];
  try {
    authors = await Author.find(searchOptions)
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query})
  } catch {
    res.redirect('/')
  }
})

// New Author Route
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author(), errorMessage: null })
})

// Create Author Route
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name
  })
  try {
    const newAuthor = await author.save()
    res.redirect(`authors/${newAuthor.id}`) // First response
  } catch (err) {
    res.render('authors/new', { author: author, errorMessage: 'Error creating Author' }) // Possible third response if error occurs during author.save
  }
})

router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    const books = await Book.find({ author: author.id }).limit(6).exec()
    res.render('authors/show', {
      author: author,
      booksByAuthor: books
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/:id/edit',  async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    res.render('authors/edit', { author: author })
  } catch {
    res.redirect('/authors')
  }
})

router.put('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save()
    res.redirect(`/authors/${author.id}`)
  } catch (err) {
    if (author == null) {
      res.redirect('/')
    } else {
      res.render('authors/new', {
        author: author,
        errorMessage: 'Error updating Author'
      })
    }
  }
})

router.delete('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    if (author == null) {
      return res.redirect('/')
    }
    const books = await Book.find({ author: author.id }).limit(1).exec()
    if (books.length > 0) {
      return res.redirect(`/authors/${author.id}`);
    }
    await Author.findByIdAndDelete(author.id)
    res.redirect('/authors')
  } catch (err) {
    console.log(err)
    if (author != null) {
      res.redirect(`/authors/${author.id}`)
    } else {
      res.redirect('/')
    }
  }
})

module.exports = router
