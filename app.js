const express = require('express')
const path = require('path')
const fs = require('fs')
const cors = require("cors")
const passport = require('passport')
const cookie = require('cookie-session')
const https = require('https')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const stravaRouter = require('./routes/strava')

const credentials = {
  key: fs.readFileSync('key.pem').toString(),
  cert: fs.readFileSync('cert.pem').toString()
}

const app = express()

app.set('trust proxy', 1) // trust first proxy
app.use(cookie({
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['adsfghgjhjrdggfgfdg']
}))

// initialize passport
app.use(passport.initialize())
app.use(passport.session())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(cors())
//app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/auth', stravaRouter)

app.use((err, req, res, next) => {
  console.log(err.stack)
  if (err) {
    res.status(500).send({Error: err.stack})
  }
})

// For self-signed certificate.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// Start server
https.createServer(credentials, app).listen(9000, () => {
  console.log('Application started successfully https://localhost:9000')
})
