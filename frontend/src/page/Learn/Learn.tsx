import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { increment, decrement, asyncFunc } from "@/store/modules/counter"

export function Learn() {
  const { count } = useSelector((state: RootState) => state.counter)
  const dispatch = useDispatch()
  
  return (
    <>
      <button onClick={() => { dispatch(decrement(10)) }}>-</button>
      <div>{ count }</div>
      <button onClick={() => { dispatch(increment(10)) }}>+</button>
      <button onClick={() => { dispatch(asyncFunc(123456) as any) }}>async</button>
    </>
  )
}