import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  chatUser: {}
}

export const chatUserSlice = createSlice({
  name: 'chatUser',
  initialState,
  reducers: {
    setChatUser: (state, action) => {
      state.chatUser = action.payload
    },
  },
})

export const { setChatUser } = chatUserSlice.actions

export default chatUserSlice.reducer