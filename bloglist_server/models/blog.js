const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
  comment: String
})

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,
  url: {
    type: String,
    required: true,
  },
  likes: Number,
  comments: [commentSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

blogSchema.set('toJSON', {
  transform: (_doc, retObj) => {
    retObj.id = retObj._id.toString()
    if (retObj.comments) {
      for (let comment of retObj.comments) {
        comment.id = comment._id.toString()
        delete comment._id
      }
    }
    delete retObj._id
    delete retObj.__v
  },
})

const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog
