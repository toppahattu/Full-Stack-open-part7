import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    notify(state, action) {
      return action.payload
    }
  }
})

let timeoutId
export const setNotification = (content, time) => {
  return async dispatch => {
    dispatch(notify(content))
    if (typeof timeoutId === 'number') {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
    timeoutId = setTimeout(() => {
      dispatch(notify(null))
    }, time * 1000)
  }
}

export const { notify } = notificationSlice.actions
export default notificationSlice.reducer