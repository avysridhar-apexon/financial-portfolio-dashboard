import { createAsyncThunk } from '@reduxjs/toolkit'

import type { RootState, AppDispatch } from './store'

// following redux docs.
// helper type to 
// (ref)[https://redux.js.org/tutorials/essentials/part-5-async-logic#typing-createasyncthunk]
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
}>()