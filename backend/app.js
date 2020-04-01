require('dotenv').config()
const express = require('express')
const path = require('path')
const helmet = require('helmet')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('config')
const app = express()

app.use(cors({ origin: 'http://localhost:3001' }))
app.use(helmet())
app.use(bodyParser.json())

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/WWWProgrammingCW', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

// setup admin user
const setup = require('./setup/createusers')
setup(config.get('admin'))

// send app to router
require('./router.js')(app)

// middleware to serve the static files from React app
app.use(express.static(path.join(__dirname, '../frontend/build')))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} - try on browser http://localhost:${PORT} to view the application.`)
})

module.exports = app