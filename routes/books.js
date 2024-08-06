const express = require('express')
const router = express.Router()
const Book = require('../models/author')
const {query} = require("express");

// All Books Route
router.get('/', async (req, res) => {

})

// New Book Route
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author(), errorMessage: null })
})

// Create Book Route
router.post('/', async (req, res) => {

})

module.exports = router
