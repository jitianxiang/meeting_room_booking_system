export interface MeetingRoom {
  id: number
  name: string
  capacity: number
  location: string
  equipment: string | null
  description: string | null
  isBooked: boolean
  createTime: Date
  updateTime: Date
}

export interface ReqMeetingRoomList {
  pageNo: number
  pageSize: number
  name: string
  capacity: number
  equipment: string
}

export interface ResMeetingRoomList {
  meetingRooms: MeetingRoom[]
  totalCount: number
}

export interface ReqAddMeetingRoom {
  name: string
  capacity: number
  location: string
  equipment: string
  description: string
}