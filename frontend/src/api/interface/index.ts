import { UserInfo } from "./user"

export interface Result {
  status: string;
  message: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

export interface ReqLoginForm {
  username: string;
  password: string;
}

export interface ResLogin {
  accessToken: string;
  refreshToken: string;
  userInfo: UserInfo;
}

export interface ReqRegister {
  username: string
  nickName: string
  password: string
  email: string
  captcha: string
}
