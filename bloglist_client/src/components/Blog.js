import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div className="blogContent" style={blogStyle}>
      <div className="showTitle">
        <Link to={`/blogs/${blog.id}`} >{blog.title} {blog.author}</Link>
      </div>
    </div>
  )
}

export default Blog
