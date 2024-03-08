import { ReqUpdatePassword, ResUserInfo, ReqUpdateUserInfo, ReqUserList, ResUserList } from "@/api/interface/user"
import http from "@/api"

export const getUpdatePwdCaptcha = (params: { email: string }) => {
  return http.get<string>(`/user/getUpdatePwdCaptcha`, params)
}

export const updatePassword = (params: ReqUpdatePassword) => {
  return http.post<string>(`/user/updatePassword`, params)
}

export const getRegisterCaptcha = (params: { email: string }) => {
  return http.get<string>(`/user/getRegisterCaptcha`, params)
}

export const getUserInfo = () => {
  return http.get<ResUserInfo>(`/user/getUserInfo`)
}

export const getUpdateUserInfoCaptcha = () => {
  return http.get<string>(`/user/getUpdateUserInfoCaptcha`)
}

export const updateUserInfo = (params: ReqUpdateUserInfo) => {
  return http.post<string>(`/user/updateUserInfo`, params)
}

export const getUserList = (params: ReqUserList) => {
  return http.post<ResUserList>(`/user/getUserList`, params)
}


export const freeze = (params: { userId: number }) => {
  return http.get<string>(`/user/freeze`, params)
}
