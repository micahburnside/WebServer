if (process.env.NODE_ENV !== 'production') { require('dotenv').config(); }

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
// const dotenv = require('dotenv').config()
require('dotenv').config()

const indexRouter = require('./routes/index')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

console.log("Database URL: ", process.env.DATABASE_URL)

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (err) => console.error(err))
db.once('open', (err) => console.log('Connected to Mongoose'))


app.use('/', indexRouter)

app.listen(process.env.PORT || 3000, () => console.log('Server Started'))
