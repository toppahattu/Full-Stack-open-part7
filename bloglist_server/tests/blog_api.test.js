const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map((r) => r.title)
    expect(titles).toContain('React patterns')
  })

  test('there is an specific property called "id" for every blog', async () => {
    const blogsAtEnd = await helper.blogsInDb()
    for (const blog of blogsAtEnd) {
      expect(blog.id).toBeDefined()
      expect(blog._id).not.toBeDefined()
    }
  })

  describe('addition of a new blog by existing logged-in user', () => {
    let loginDetails, user
    const userLogin = { username: 'root', password: 'kissa123' }

    beforeEach(async () => {
      await User.deleteMany()
      const passwordHash = await bcrypt.hash('kissa123', 10)
      user = new User({ username: 'root', passwordHash })
      await user.save()
    })

    test('fails with status code 401 if no token or wrong token is provided', async () => {
      const newBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .set('authorization', 'puutaheinää')
        .send(newBlog)
        .expect(401)

      await api.post('/api/blogs').send(newBlog).expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      const titles = blogsAtEnd.map((r) => r.title)
      expect(titles).not.toContain('Go To Statement Considered Harmful')
    })

    test('succeeds with valid data and valid token', async () => {
      loginDetails = await api.post('/api/login').send(userLogin)

      const newBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .set('authorization', `Bearer ${loginDetails.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
      const titles = blogsAtEnd.map((r) => r.title)
      expect(titles).toContain('Go To Statement Considered Harmful')
    })

    test('fails with status code 400 if title or url is missing', async () => {
      loginDetails = await api.post('/api/login').send(userLogin)

      const newBlog = {
        author: 'Jeff Atwood',
        url: 'https://blog.codinghorror.com/the-2030-self-driving-car-bet/',
      }
      const newBlog2 = {
        title: 'The 2030 Self-Driving Car Bet',
        author: 'Jeff Atwood',
      }

      await api
        .post('/api/blogs')
        .set('authorization', `Bearer ${loginDetails.body.token}`)
        .send(newBlog)
        .expect(400)

      await api
        .post('/api/blogs')
        .set('authorization', `Bearer ${loginDetails.body.token}`)
        .send(newBlog2)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('if added blog is missing likes then zero likes are given', async () => {
      loginDetails = await api.post('/api/login').send(userLogin)

      const newBlog = {
        title: 'The 2030 Self-Driving Car Bet',
        author: 'Jeff Atwood',
        url: 'https://blog.codinghorror.com/the-2030-self-driving-car-bet/',
      }

      await api
        .post('/api/blogs')
        .set('authorization', `Bearer ${loginDetails.body.token}`)
        .send(newBlog)

      const blogsAtEnd = await helper.blogsInDb()
      const newBlogAtEnd = blogsAtEnd.find(
        (blog) => blog.title === 'The 2030 Self-Driving Car Bet',
      )
      console.log(newBlogAtEnd)
      expect(newBlogAtEnd.likes).toBe(0)
    })
  })

  describe('updating a specific blog', () => {
    test('updating succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      let copiedBlog = { ...blogToUpdate }
      copiedBlog.likes = copiedBlog.likes + 1

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(copiedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlogAtEnd = blogsAtEnd.find(
        (blog) => blog.id === blogToUpdate.id,
      )
      expect(updatedBlogAtEnd.likes).toBe(blogToUpdate.likes + 1)
    })
  })

  describe('deletion of a blog by existing logged-in user', () => {
    let loginDetails, user
    const userLogin = { username: 'root', password: 'kissa123' }

    beforeEach(async () => {
      await User.deleteMany()
      const passwordHash = await bcrypt.hash('kissa123', 10)
      user = new User({ username: 'root', passwordHash })
      await user.save()
    })

    test('fails with status code 401 if no token or wrong token is provided', async () => {
      loginDetails = await api.post('/api/login').send(userLogin)

      const newBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
      }

      const responseToPost = await api
        .post('/api/blogs')
        .set('authorization', `Bearer ${loginDetails.body.token}`)
        .send(newBlog)

      const blogsAfterAddition = await helper.blogsInDb()
      const blogToDelete = responseToPost.body

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('authorization', 'puutaheinää')
        .expect(401)

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAfterAddition.length)

      const titles = blogsAtEnd.map((b) => b.title)
      expect(titles).toContain(blogToDelete.title)
    })

    test('succeeds with status code 204 if id and token are valid', async () => {
      loginDetails = await api.post('/api/login').send(userLogin)

      const newBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
      }

      const responseToPost = await api
        .post('/api/blogs')
        .set('authorization', `Bearer ${loginDetails.body.token}`)
        .send(newBlog)

      const blogsAfterAddition = await helper.blogsInDb()
      const blogToDelete = responseToPost.body

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('authorization', `Bearer ${loginDetails.body.token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAfterAddition.length - 1)

      const titles = blogsAtEnd.map((b) => b.title)
      expect(titles).not.toContain(blogToDelete.title)
    })
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany()

    const passwordHash = await bcrypt.hash('kissa123', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'toppahattu',
      name: 'Jouko Mälkönen',
      password: 'onTaiEi123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'LOL123',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username or password is too short or missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'gg',
      name: 'Superuser',
      password: 'LOL123',
    }

    const newUser2 = {
      username: '',
      name: 'Superuser',
      password: 'LOL123',
    }

    const newUser3 = {
      username: 'toppahattu',
      name: 'Superuser',
      password: '12',
    }

    const newUser4 = {
      username: 'toppahattu',
      name: 'Superuser',
      password: '',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const result2 = await api
      .post('/api/users')
      .send(newUser2)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const result3 = await api
      .post('/api/users')
      .send(newUser3)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const result4 = await api
      .post('/api/users')
      .send(newUser4)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(
      'User validation failed: username: Path `username` (`gg`) is shorter than the minimum allowed length (3).',
    )
    expect(result2.body.error).toContain(
      'User validation failed: username: Path `username` is required.',
    )
    expect(result3.body.error).toContain(
      'password missing or too short, must be at least 3 characters',
    )
    expect(result4.body.error).toContain(
      'password missing or too short, must be at least 3 characters',
    )

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
