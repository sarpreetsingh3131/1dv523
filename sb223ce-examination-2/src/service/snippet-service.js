import { SnippetRepository } from '../repository/snippet-repository'

export class SnippetService {
  constructor () {
    this.repo = new SnippetRepository()
  }

  /**
   * @param {String} username
   * @param {JSON} param1
   * Return result from repository
   */
  createSnippet (username, { content }) {
    return this.repo.createSnippet(username, content)
  }

  /**
   *
   * @param {String} username
   * @param {JSON} param1
   * Return result from repository
   */
  updateSnippet (username, { snippet }) {
    return this.repo.updateSnippet(username, snippet)
  }

  /**
   *
   * @param {String} id
   * @param {String} username
   * Return result from repository
   */
  deleteSnippet (id, username) {
    return this.repo.deleteSnippet(id, username)
  }

  /**
   * @param {String} username
   * @param {String} tag
   * Return result from repository
   */
  getSnippets (username = '', tag = '') {
    return this.repo.getSnippets(username, tag)
  }
}
