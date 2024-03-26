import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const p = new Promise((res) => {
  setTimeout(() => {
    res(1008666)
  }, 5000)
})

// 定义异步任务，并导出给ui使用
export const asyncFunc = createAsyncThunk('asyncTest', async(value: number) => {
  await p
  return value
})

const counterStore = createSlice({
  name: 'counter',
  // 初始状态数据
  initialState: {
    count: 0
  },
  // 修改数据的同步方法
  reducers: {
    increment(state, action) {
      state.count += action.payload
    },
    decrement(state, action) {
      state.count -= action.payload
    }
  },
  extraReducers(builder) {
    // 根据外部的异步任务定义reducer
    builder.addCase(asyncFunc.fulfilled, (state, action) => {
      state.count = action.payload as number
    })
  },
})

export const { increment, decrement } = counterStore.actions
export default counterStore.reducer