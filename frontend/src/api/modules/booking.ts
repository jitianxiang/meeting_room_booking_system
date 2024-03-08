import http from "@/api"
import { ReqBookingList, ResBookingList, StatusEnum, ReqAddBooking } from "../interface/bookingList"

export const getBookingList = (params: ReqBookingList) => {
  return http.post<ResBookingList>(`/booking/getBookingList`, params)
}

export const changeBookingStatus = (params: { id: number, status: StatusEnum }) => {
  return http.post<string>(`/booking/changeBookingStatus`, params)
}

export const addBooking = (params: ReqAddBooking) => {
  return http.post<string>(`/booking/addBooking`, params)
}