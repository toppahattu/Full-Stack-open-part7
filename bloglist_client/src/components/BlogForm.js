import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Togglable from './Togglable'
import { createBlog } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationReducer'

const BlogForm = () => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const dispatch = useDispatch()
  const blogFormRef = useRef()
  const user = useSelector(state => state.user)

  const addBlog = async (e) => {
    e.preventDefault()
    const blogObj = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      user: user,
    }
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObj))
    dispatch(setNotification({
      message: `a new blog ${blogObj.title} by ${blogObj.author} added`,
      color: 'Green',
    }, 5))
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            className="inputTitle"
            type="text"
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            className="inputAuthor"
            type="text"
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            className="inputUrl"
            type="text"
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>
        <button id="blogSubmit" type="submit">
          create
        </button>
      </form>
    </Togglable>
  )
}

export default BlogForm