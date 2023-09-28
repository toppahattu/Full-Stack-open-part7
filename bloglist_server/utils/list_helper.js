const _ = require('lodash')

const dummy = (blogs) => {
  if (blogs) {
    return 1
  }
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, curr) => acc + curr.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (!blogs.length) {
    return null
  }
  const favorite = blogs.reduce((prev, curr) =>
    prev.likes > curr.likes ? prev : curr,
  )
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

const mostBlogs = (blogs) => {
  if (!blogs.length) {
    return 0
  }
  const groupByAuthor = _.groupBy(blogs, (blog) => blog.author)
  const longestBlogList = _.maxBy(Object.values(groupByAuthor), 'length')
  return {
    author: longestBlogList[0].author,
    blogs: longestBlogList.length,
  }
}

const mostLikes = (blogs) => {
  if (!blogs.length) {
    return 0
  }
  const groupByAuthor = _.groupBy(blogs, (blog) => blog.author)
  const likesByAuthor = Object.values(groupByAuthor).map((bloglist) => {
    return { author: bloglist[0].author, likes: totalLikes(bloglist) }
  })
  return _.maxBy(likesByAuthor, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
