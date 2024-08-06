const express = require('express')
const router = express.Router()
const Author = require('../models/author')

// All Authors Route
router.get('/', (req, res) => {
  try {
    const authors = await Author.find({})
    res.render('authors/index', {authors: authors})
  } catch {
    res.redirect('/')
  }
})

// New Author Route
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() })
})

// Create Author Route
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name
  })
  try {
    const newAuthor = await author.save()
    // res.redirect(`authors/${newAuthor.id}`)
    res.redirect(`authors`)
  } catch (err) {
    res.render('authors/new', {
      author: author,
      errorMessage: 'error creating author'
    })
  }
})

module.exports = router
