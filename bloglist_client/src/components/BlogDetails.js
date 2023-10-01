import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, removeBlog } from '../reducers/blogsReducer'
import Comments from './Comments'

const BlogDetails = ({ blog }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loggedUser = useSelector(state => state.user)
  if (!blog) {
    return null
  }

  const handleLike = async (blog) => {
    const likedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    dispatch(likeBlog(likedBlog))
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(removeBlog(blog))
      navigate('/blogs')
    }
  }

  const buttonStyle = {
    backgroundColor: '#318ce7',
  }
  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div className="showLikes">
        {blog.likes} likes
        <button id="addLikes" onClick={() => handleLike(blog)}>
          like
        </button>
        <div>
          added by {blog.user.name}
        </div>
        <Comments blog={blog} />
        {blog.user.username === loggedUser.username && <button
          id="removeBlog"
          onClick={() => handleRemove(blog)}
          style={buttonStyle}>
            remove
        </button>}
      </div>
    </div>
  )
}

export default BlogDetails