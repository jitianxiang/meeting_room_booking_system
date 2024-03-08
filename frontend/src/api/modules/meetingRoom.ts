import http from "@/api"
import { ResMeetingRoomList, ReqMeetingRoomList, ReqAddMeetingRoom, MeetingRoom } from "../interface/meetingRoom"

export const getMeetingRoomList = (params: ReqMeetingRoomList) => {
  return http.post<ResMeetingRoomList>(`/meeting-room/getMeetingRoomList`, params)
}

export const createMeetingRoom = (params: ReqAddMeetingRoom) => {
  return http.post<string>(`/meeting-room/createMeetingRoom`, params)
}

export const delMeetingRoomById = (params: { id: number }) => {
  return http.get<string>(`/meeting-room/delMeetingRoomById`, params)
}

export const getMeetingRoomInfoById = (params: { id: number }) => {
  return http.get<MeetingRoom>(`/meeting-room/getMeetingRoomInfoById`, params)
}

export const updateMeetingRoom = (params: MeetingRoom) => {
  return http.post<string>(`/meeting-room/updateMeetingRoom`, params)
}