import { configureStore } from "@reduxjs/toolkit"
import counterReducer from './modules/counter'

const store = configureStore({
  reducer: {
    counter: counterReducer
  }
})

export interface RootState {
  counter: {
    count: number
  }
}

export default store