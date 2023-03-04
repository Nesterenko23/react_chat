import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export type CurrentUserType = {
    uid: string,
    displayName: string | null,
    email: string | null,
    photoURL: string | null
}

interface CurrentUserState {
    currentUser: CurrentUserType
}

const initialState: CurrentUserState = {
  currentUser: {
    uid: "",
    displayName: "",
    email: "",
    photoURL: ""
  }
}

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<CurrentUserType>) => {
      state.currentUser = action.payload
    },
  },
})

export const { setCurrentUser } = currentUserSlice.actions
export const currentUserSelector = (state: RootState) => state.currentUser.currentUser
export default currentUserSlice.reducer