import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
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
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label htmlFor="inputTitle" >title: </Form.Label>
          <Form.Control
            id="inputTitle"
            className="inputTitle"
            type="text"
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="inputAuthor" >author: </Form.Label>
          <Form.Control
            id="inputAuthor"
            className="inputAuthor"
            type="text"
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="inputUrl" >url: </Form.Label>
          <Form.Control
            id="inputUrl"
            className="inputUrl"
            type="text"
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">create</Button>
      </Form>
    </Togglable>
  )
}

export default BlogForm