const express = require('express')
const cors = require('cors')
const routes = require('./config/routes')
const passport = require('./config/passport')


const app = express()
app.use(passport.initialize())
app.use(cors()) // { origin: 'http://meuapp.com' }
app.use(express.json())
app.use(routes)

const port = process.env.PORT || 3333
app.listen(port)