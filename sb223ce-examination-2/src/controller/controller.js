import express from 'express'

import { UserService } from '../service/user-service'
import { SnippetService } from '../service/snippet-service'
import { MyError } from '../error/error'
import { SIGN_UP, LOG_IN, CREATE_SNIPPET, DELETE_SNIPPET, GET_SNIPPETS, UPDATE_SNIPPET, LOG_OUT } from '../api/api'

/**
 * This class handles the request and response it back
 */
export class Controller extends express.Router {
  constructor () {
    super()
    this.userService = new UserService()
    this.snippetService = new SnippetService()

    this.route(SIGN_UP)
      .post((req, res) => {
        this.userService.signUp(req.body)
          .then(user => res.status(201).send({ message: 'signed up successfully' }))
          .catch(err => res.status(err.status || 500).send({ error: err.message }))
      })

    this.route(LOG_IN)
      .post((req, res) => {
        this.userService.logIn(req.body)
          .then(user => {
            req.session.userId = user._id
            res.status(200).send({ message: 'logged in successfully' })
          })
          .catch(err => res.status(err.status || 500).send({ error: err.message }))
      })

    this.route(LOG_OUT)
      .get((req, res) => {
        this.userService.checkAuthorization(req.session.userId)
          .then(user => {
            req.session.destroy(err => {
              if (err) throw new MyError()
              else res.status(200).send({ message: 'logged out successfully' })
            })
          })
          .catch(err => res.status(err.status || 500).send({ error: err.message }))
      })

    this.route(GET_SNIPPETS)
      .get((req, res) => {
        this.snippetService.getSnippets(req.query.username, req.query.tag)
          .then(snippets => res.status(200).send({ snippets: snippets }))
          .catch(err => res.status(err.status || 500).send({ error: err.message }))
      })

    this.route(CREATE_SNIPPET)
      .post((req, res) => {
        this.userService.checkAuthorization(req.session.userId)
          .then(user => { return this.snippetService.createSnippet(user.username, req.body) })
          .then(snippet => res.status(201).send({ snippet: snippet }))
          .catch(err => res.status(err.status || 500).send({ error: err.message }))
      })

    this.route(UPDATE_SNIPPET)
      .put((req, res) => {
        this.userService.checkAuthorization(req.session.userId)
          .then(user => { return this.snippetService.updateSnippet(user.username, req.body) })
          .then(snippet => res.status(200).send({ snippet: snippet }))
          .catch(err => res.status(err.status || 500).send({ error: err.message }))
      })

    this.route(DELETE_SNIPPET)
      .delete((req, res) => {
        this.userService.checkAuthorization(req.session.userId)
          .then(user => { return this.snippetService.deleteSnippet(req.params.snippetId, user.username) })
          .then(snippet => res.status(200).send({ message: 'deleted successfully' }))
          .catch(err => res.status(err.status || 500).send({ error: err.message }))
      })
  }
}
