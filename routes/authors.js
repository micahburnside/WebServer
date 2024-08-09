const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const {query} = require("express");
const res = require("express/lib/response");

// All Authors Route
router.get('/', async (req, res) => {
let searchOptions = {}
  if(req.query.name != null && query.name !== ''){
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
    res.redirect(`authors/${newAuthor.id}`)
    res.redirect('authors')
  } catch (err) {
    res.render('authors/new', { author: author, errorMessage: 'Error creating Author' })
  }
})

router.get('/:id',  (req, res) => {
  res.send('Show Author' + req.params.id)
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

router.delete('/:id',  (req, res) => {
  res.send('Delete Author' + req.params.id)
})

module.exports = router
