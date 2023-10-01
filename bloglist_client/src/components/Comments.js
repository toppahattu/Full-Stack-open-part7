import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import { commentBlog } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationReducer'

const Comments = ({ blog }) => {
  const [newComment, setNewComment] = useState('')
  const dispatch = useDispatch()

  const addComment = async (e) => {
    e.preventDefault()
    dispatch(commentBlog(blog, newComment))
    dispatch(setNotification({
      message: `a new comment ${newComment} added`,
      color: 'Green',
    }, 5))
    setNewComment('')
  }
  return (
    <div>
      <h3>comments</h3>
      <Form onSubmit={addComment}>
        <Form.Control
          type="text"
          value={newComment}
          onChange={({ target }) => setNewComment(target.value)}
        />
        <Button variant="primary" type="submit">add comment</Button>
      </Form>
      <ul>
        {blog.comments.map(c =>
          <li key={c.id}>
            {c.comment}
          </li>)}
      </ul>
    </div>
  )
}

export default Comments
