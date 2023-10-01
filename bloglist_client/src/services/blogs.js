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

const comment = async (blogObj, newComment) => {
  const response = await axios.post(`${baseUrl}/${blogObj.id}/comments`, { comment: newComment })
  return response.data
}

const blogService = { getAll, create, setToken, update, remove, comment }
export default blogService
