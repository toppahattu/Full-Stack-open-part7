import { useSelector } from 'react-redux'
import BlogForm from './BlogForm'
import Blog from './Blog'

const Blogs = () => {
  const blogs = useSelector(state => state.blogs)
  let sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  return (
    <>
      <BlogForm />
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
        />
      ))}
    </>

  )
}

export default Blogs