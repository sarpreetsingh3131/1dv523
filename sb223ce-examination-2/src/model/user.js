import mongoose from 'mongoose'

export class User extends mongoose.Schema {
  constructor () {
    super({
      username: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 10,
        trim: true
      },
      password: {
        type: String,
        unique: false,
        required: true,
        minlength: 5,
        trim: true
      }
    })
  }
}
