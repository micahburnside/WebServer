const express = require('express')
// const res = require("express/lib/response");
const router = express.Router()

//All Authors Route
router.get('/', (req, res) => {
  res.render('authors/index')
})

//New Author Route
router.post('/new', (req, res) => {
  res.render('authors/new')
})

module.exports = router
