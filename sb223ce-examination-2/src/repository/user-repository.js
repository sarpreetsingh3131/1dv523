import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

import { User } from '../model/user'
import { MyError } from '../error/error'

var UserModel = mongoose.model('user', new User())
mongoose.Promise = global.Promise

export class UserRepository {
  /**
   * @param {String} password
   * Convert password into hash
   */
  hash (password) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) reject(new MyError(err.message))
        bcrypt.hash(password, salt, (err, hash) => {
          err ? reject(new MyError(err.message)) : resolve(hash)
        })
      })
    })
  }

  /**
   * @param {String} username
   * @param {String} password
   * Validate the length
   */
  validate (username, password) {
    return new Promise((resolve, reject) => {
      if (!username || !password) reject(new MyError(400, 'username/password must be provided'))
      if (username.length >= 5 && password.length >= 5 && username.length <= 10 && password.length <= 10) resolve()
      else reject(new MyError(400, 'username/password length must be between 5 and 10'))
    })
  }

  /**
   * @param {String} username
   * @param {String} password
   * Signup the user
   */
  signUp (username, password) {
    return new Promise((resolve, reject) => {
      UserModel.init()
        .then(() => { return this.validate(username, password) })
        .then(() => { return this.hash(password) })
        .then(hash => { return UserModel.create({ username: username, password: hash }) })
        .then(user => resolve(user))
        .catch(err => reject(new MyError(err.status || 403, err.status ? err.message : 'user already exist')))
    })
  }

  /**
   * @param {String} username
   * @param {String} password
   * Login the user
   */
  logIn (username, password) {
    return new Promise((resolve, reject) => {
      this.validate(username, password)
        .then(() => { return UserModel.findOne({ username: username }).exec() })
        .then(user => { if (user) { return user } else reject(new MyError(401, 'login failed')) })
        .then(user => bcrypt.compare(password, user.password)
          .then(match => match ? resolve(user) : reject(new MyError(401, 'login failed'))))
        .catch(err => reject(new MyError(err.status, err.message)))
    })
  }

  /**
   * @param {String} id
   * Check if user exist
   */
  checkAuthorization (id) {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ _id: id }).exec()
        .then(user => user ? resolve(user) : reject(new MyError(403, 'forbidden')))
        .catch(err => reject(new MyError(err.status, err.message)))
    })
  }
}
