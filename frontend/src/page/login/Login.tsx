import { Button, Form, Input, message } from "antd";
import "./login.css"
import { login } from "@/api/modules/login";
import { Link, useNavigate } from "react-router-dom";

type FieldType = {
  username: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate()
  const onFinish = async(values: any) => {
    const { data } = await login({ ...values })
    message.success('登录成功')
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
    setTimeout(() => {
      navigate('/home')
    }, 1000)
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className="login-wrapper">
      <h1>会议室预订系统</h1>
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        style={{ minWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="用户名"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="密码"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <div className="btn-wrapper">
            <Link to='/register'>创建账号</Link>
            <Link to='/update-password'>忘记密码</Link>
          </div>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}