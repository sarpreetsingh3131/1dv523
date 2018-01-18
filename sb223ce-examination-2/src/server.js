import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import fs from 'fs'
import https from 'https'

import { Controller } from './controller/controller'
import { BASE_URL } from './api/api'
import { DB } from './db/db'

new DB().connect()
  .then(() => {
    let app = express()
    let port = process.env.PORT || 3000

    app.use(bodyParser.json())
    app.use(cookieParser())
    app.use(session({
      name: 'sticky-snippets',
      secret: 'sb223ce',
      saveUninitialized: false,
      resave: false,
      cookie: {
        domain: 'localhost',
        httpOnly: true,
        secure: true,
        maxAge: 2000 * 60 * 60 * 24
      }
    }))

    app.use(express.static(path.resolve(__dirname, 'public')))

    // for cross-origin
    app.use((req, res, next) => {
      res.type('json')
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000')
      res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie')
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      next()
    })

    var privateKey = fs.readFileSync('./src/certificates/key.pem', 'utf8')
    var certificate = fs.readFileSync('./src/certificates/cert.pem', 'utf8')
    var credentials = { key: privateKey, cert: certificate }

    let httpsServer = https.createServer(credentials, app)

    app.use(BASE_URL, new Controller())

    app.use((request, response, next) => response.status(404).send({ error: 'not found' }))

    app.use((error, request, response, next) => {
      console.log('ERROR', error.stack)
      response.status(500).send({ error: 'internal server error' })
    })

    httpsServer.listen(port, () => console.log('open https://localhost:' + port))
  })
  .catch(err => console.log('cannot connect to db', err.message))
