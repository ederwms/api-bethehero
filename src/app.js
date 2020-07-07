require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const routes = require('./routes/v1')

app.use(morgan('dev'))

app.use(cors())
app.use(express.json())
app.use(routes)

module.exports = app
