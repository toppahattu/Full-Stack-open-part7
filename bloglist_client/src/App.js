import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Route, Routes, useMatch } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'
import Blogs from './components/Blogs'
import BlogDetails from './components/BlogDetails'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import { fetchAllBlogs } from './reducers/blogsReducer'
import { fetchAllUsers } from './reducers/usersReducer'
import { setUser } from './reducers/userReducer'
import Users from './components/Users'
import User from './components/User'
import Home from './components/Home'

const App = () => {
  const dispatch = useDispatch()
  const loggedUser = useSelector(state => state.user)
  const matchBlog = useMatch('/blogs/:id')
  const matchUser = useMatch('/users/:id')
  const blogs = useSelector(state => state.blogs)
  const users = useSelector(state => state.users)
  const blog = matchBlog ? blogs.find(b => b.id === matchBlog.params.id) : null
  const user = matchUser ? users.find(u => u.id === matchUser.params.id) : null

  useEffect(() => {
    dispatch(fetchAllBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchAllUsers())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(setUser(null))
  }

  const padding = {
    padding: 5
  }

  return (
    <div className="container">
      {loggedUser === null ? (
        <LoginForm />
      ) : (
        <div>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="#" as="span">
                  <Link style={padding} to="/blogs">blogs</Link>
                </Nav.Link>
                <Nav.Link href="#" as="span">
                  <Link style={padding} to="/users">users</Link>
                </Nav.Link>
                <Nav.Link href="#" as="span">
                  <em>
                    {loggedUser.name} logged in {' '}
                  </em>
                  <button onClick={handleLogout}>logout</button>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <h2>blogs</h2>
          <Notification />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/blogs' element={<Blogs />} />
            <Route path='/users' element={<Users />} />
            <Route path='/blogs/:id' element={<BlogDetails blog={blog} />} />
            <Route path='/users/:id' element={<User user={user} />} />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App