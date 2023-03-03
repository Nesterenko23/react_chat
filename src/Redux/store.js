import { configureStore } from '@reduxjs/toolkit'
import currentUser from './Slices/currentUserSlice'
import chatUser from './Slices/chatUserSlice'
export const store = configureStore({
  reducer: {
    currentUser,
    chatUser  
  },
})