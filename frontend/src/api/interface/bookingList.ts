import { UserInfo } from "./user"
import { MeetingRoom } from "./meetingRoom"

export interface ReqBookingList {
  pageNo: number
  pageSize: number
  username: string
  meetingRoomLocation: string
  bookingStartTime: string
  bookingEndTime: string
  meetingRoomName: string
}

export enum StatusEnum {
  APPLYING = 1,
  APPROVED = 2,
  REJECTED = 3,
  REMOVED = 4,
}

export interface Booking {
  id: number
  startTime: string
  endTime: string
  status: StatusEnum
  note: string | null
  createTime: string
  updateTime: string
  user: UserInfo
  room: MeetingRoom
}

export interface ResBookingList {
  totalCount: number
  bookings: Booking[]
}

export interface ReqAddBooking {
  meetingRoomId: number
  startTime: string
  endTime: string
  note: string
  timeRange: string[]
}