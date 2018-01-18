import { config } from 'dotenv'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import http from 'http'
import WebSocket from 'ws'
import { Controller } from './controller/controller'
import { BASE_URL } from './api/api'

config({ path: process.env.NODE_ENV === 'production' ? 'prod.env' : 'dev.env' })

let app = express()
let port = process.env.PORT

app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, '../public')))

let server = http.createServer(app)

app.use(BASE_URL, new Controller(new WebSocket.Server({ server })))

app.use((req, res, next) => res.status(404).send({ error: 'not found' }))

app.use((err, req, res, next) => res.status(500).send({ error: err.message }))

server.listen(port, () => console.log('server running on ' + process.env.HOST + port))
