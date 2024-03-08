import { ReqLoginForm, ResLogin, ReqRegister } from "@/api/interface/index"
import http from "@/api"

// 用户登录
export const login = (params: ReqLoginForm) => {
  return http.post<ResLogin>(`/user/login`, params)
}

export const register = (params: ReqRegister) => {
  return http.post<string>(`/user/register`, params)
}

