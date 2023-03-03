import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    changedWidth: false
}

export const screenParamsSlice = createSlice({
  name: 'screenParams',
  initialState,
  reducers: {
    setChangedWidth: (state, action) => {
        state.changedWidth = action.payload
      },
  },
})

export const { setChangedWidth } = screenParamsSlice.actions

export default screenParamsSlice.reducer