import mongoose from 'mongoose'

import { Snippet } from '../model/snippet'
import { MyError } from '../error/error'

var SnippetModel = mongoose.model('snippet', new Snippet())
mongoose.Promise = global.Promise

export class SnippetRepository {
  /**
   * @param {String} content
   * Validate the length of snippet content
   */
  validate (content) {
    return new Promise((resolve, reject) => {
      if (!content) reject(new MyError(400, 'content must be provided'))
      content.trim().length > 0 && content.length <= 1000 ? resolve()
        : reject(new MyError(400, 'snippet content length must be between 1 and 1000'))
    })
  }

  /**
   * @param {String} username
   * @param {String} content
   * Create a new snippet
   */
  createSnippet (username, content) {
    return new Promise((resolve, reject) => {
      this.validate(content)
        .then(() => { return SnippetModel.create({ username: username, content: content }) })
        .then(snippet => resolve(snippet))
        .catch(err => reject(new MyError(err.status, err.message)))
    })
  }

  /**
   * @param {String} username
   * @param {Object} snippet
   * Update the snippet if found
   */
  updateSnippet (username, snippet) {
    return new Promise((resolve, reject) => {
      this.validate(snippet.content)
        .then(() => { return SnippetModel.findOne({ _id: snippet._id, username: username }).exec() })
        .then(found => {
          if (!found) reject(new MyError(404, 'not found'))
          found.content = snippet.content
          snippet.tags.forEach(tag => tag && found.tags.indexOf(tag) === -1 ? found.tags.push(tag) : '')
          return found
        })
        .then(found => {
          return SnippetModel.findByIdAndUpdate({ _id: found._id }, { tags: found.tags, content: found.content }, {
            new: true
          }).exec()
        })
        .then(updatedSnippet => resolve(updatedSnippet))
        .catch(err => reject(new MyError(err.status || 500, err.message)))
    })
  }

  /**
   * @param {String} id
   * @param {String} username
   * Delete the snippet if found
   */
  deleteSnippet (id, username) {
    return new Promise((resolve, reject) => {
      SnippetModel.findOneAndRemove({ _id: id, username: username }).exec()
        .then(snippet => snippet ? resolve(snippet) : reject(new MyError(404, 'not found')))
        .catch(() => reject(new MyError(404, 'not found')))
    })
  }

  /**
   * @param {String} username
   * @param {String} tag
   * If params exist then return the searched snippets otherwise all snippets
   */
  getSnippets (username, tag) {
    let search = {}
    if (username && tag) search = { username: username, tags: tag }
    else if (username) search = { username: username }
    else if (tag) search = { tags: tag }

    return new Promise((resolve, reject) => {
      SnippetModel.find(search).exec()
        .then(snippets => (username || tag) && snippets.length === 0
          ? reject(new MyError(404, 'not found')) : resolve(snippets))
        .catch(err => reject(new MyError(err.status, err.message)))
    })
  }
}
