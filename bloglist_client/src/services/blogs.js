import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (blogObj) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, blogObj, config)
  return response.data
}

const update = async (blogObj) => {
  blogObj.likes += 1
  blogObj.user = blogObj.user.id
  const response = await axios.put(`${baseUrl}/${blogObj.id}`, blogObj)
  return response.data
}

const remove = async (blogObj) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${blogObj.id}`, config)
  return response.data
}

const blogService = { getAll, create, setToken, update, remove }
export default blogService
