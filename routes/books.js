const express = require('express')
const router = express.Router()
const Book = require('../models/author')
const {query} = require("express");

// All Books Route
router.get('/', async (req, res) => {
  res.send('All Books')
})

// New Book Route
router.get('/new', async (req, res) => {
  try {

  } catch {

  }
})

// Create Book Route
router.post('/', async (req, res) => {
  res.send('Create Book')
})

module.exports = router
