const express = require('express')
const cors = require('cors')
const routes = require('./config/routes')
const passport = require('./config/passport')

require('dotenv').config()

const app = express()
app.use(passport.initialize())
app.use(cors()) // { origin: 'http://myapp.com' }
app.use(express.json())
app.use(routes)

const port = process.env.PORT || 3333
app.listen(port)
console.log("Server running on port", port)