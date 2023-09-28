import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    like(state, action) {
      const likedBlog = action.payload
      return state.map(b =>
        b.id !== likedBlog.id ? b : likedBlog)
    },
    remove(state, action) {
      const removedBlog = action.payload
      return state.filter(b => b.id !== removedBlog.id)
    }
  }
})

export const { appendBlog, setBlogs, like, remove } = blogSlice.actions

export const fetchAllBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
  }
}

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content)
    dispatch(appendBlog(newBlog))
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const likedBlog = await blogService.update({ ...blog })
    dispatch(like(likedBlog))
  }
}

export const removeBlog = (blog) => {
  return async (dispatch) => {
    await blogService.remove(blog)
    dispatch(remove(blog))
  }
}

export default blogSlice.reducer