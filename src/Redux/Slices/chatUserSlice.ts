import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Timestamp } from 'firebase/firestore'
import { RootState } from '../store'

export type ChatUserType = {
  uid: string,
  displayName: string,
  photoURL: string,
  onlineStatus: string,
  lastMessage?: string,
  lastSendTime?: Timestamp,
  lastMessages?: []
}

interface ChatUserState {
  chatUser: ChatUserType
}

const initialState: ChatUserState = {
  chatUser: {
    uid: "",
    displayName: "",
    photoURL: "",
    onlineStatus: ""
  }
}

export const chatUserSlice = createSlice({
  name: 'chatUser',
  initialState,
  reducers: {
    setChatUser: (state, action: PayloadAction<ChatUserType>) => {
      state.chatUser = action.payload
    },
  },
})

export const { setChatUser } = chatUserSlice.actions
export const chatUserSelector = (state: RootState) => state.currentUser.currentUser
export default chatUserSlice.reducer