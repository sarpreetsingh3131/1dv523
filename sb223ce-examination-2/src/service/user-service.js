import { UserRepository } from '../repository/user-repository'

export class UserService {
  constructor () {
    this.repo = new UserRepository()
  }

  /**
   * @param {JSON} param0
   * Return result from repository
   */
  signUp ({ username, password }) {
    return this.repo.signUp(username, password)
  }

  /**
   * @param {JSON} param0
   * Return result from repository
   */
  logIn ({ username, password }) {
    return this.repo.logIn(username, password)
  }

  /**
   * @param {String} id
   * Return result from repository
   */
  checkAuthorization (id) {
    return this.repo.checkAuthorization(id)
  }
}
