import mongoose from 'mongoose'

export class Snippet extends mongoose.Schema {
  constructor () {
    super({
      username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 10,
        trim: true
      },
      content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1000
      },
      tags: {
        type: [],
        required: false
      }
    })
  }
}
