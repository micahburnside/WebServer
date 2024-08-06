const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const {query} = require("express");

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
    await author.save()
    res.redirect('authors')
  } catch (err) {
    res.render('authors/new', { author: author, errorMessage: 'Error creating Author' })
  }
})

module.exports = router
