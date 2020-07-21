require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')

const routes = require('./routes/v1')

app.use(morgan('dev'))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/useruploads', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
app.use(routes)

module.exports = app
