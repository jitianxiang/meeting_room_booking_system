export interface UserInfo {
  createTime: string;
  email: string;
  headPic: string | null;
  id: number;
  isAdmin: boolean;
  isFrozen: boolean;
  nickName: string;
  phoneNumber: string | null;
  username: string;
  permissions: Permission[];
  roles: string[];
}

export interface Permission {
  id: number;
  code: string;
  description: string;
}

export interface ReqUpdatePassword {
  username: string
  password: string
  email: string
  captcha: string
}

export interface ResUserInfo {
  createTime: string;
  email: string;
  headPic: string | null;
  id: number;
  isFrozen: boolean;
  nickName: string;
  phoneNumber: string | null;
  username: string;
}

export interface ReqUpdateUserInfo {
  headPic: string;
  nickName: string;
  email: string;
  captcha: string;
}

export interface ReqUserList {
  pageNo: number;
  pageSize: number;
  username: string;
  nickName: string;
  email: string;
}

export interface User {
  createTime: string;
  email: string;
  headPic: string | null;
  id: number;
  isFrozen: boolean;
  nickName: string;
  username: string;
  phoneNumber: string | null;
}

export interface ResUserList {
  totalCount: number;
  users: User[]
}
