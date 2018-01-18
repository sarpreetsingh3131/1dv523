import mongoose from 'mongoose'

/**
 * This class is responsible for DB connection
 */
export class DB {
  constructor () {
    mongoose.Promise = global.Promise
    this.usename = ''
    this.password = ''
    this.dbName = 'sticky-snippets'
    this.uri = 'mongodb://' + this.usename + ':' + this.password + '@ds149855.mlab.com:49855/' + this.dbName
  }

  connect () {
    return new Promise((resolve, reject) => {
      mongoose.connect(this.uri, {
        useMongoClient: true
      })
        .then(() => resolve())
        .catch(() => reject(new Error('cannot connect to DB')))
    })
  }
}
