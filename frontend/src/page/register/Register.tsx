import { Button, Col, Form, Input, Row } from "antd";
import './register.css'
import { register } from '@/api/modules/login'
import { getRegisterCaptcha } from '@/api/modules/user'
import { message } from "antd"
import { ReqRegister } from "@/api/interface"
import { useNavigate } from "react-router";

type FieldType = {
  username: string
  password: string
  nickName: string
  confirmPassword: string
  email: string
  captcha: string
}

export function Register() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const onFinish = async(values: FieldType) => {
    if (values.password !== values.confirmPassword) return message.error('两次密码输入不一致')
    const reqRegister: ReqRegister = {
      username: values.username,
      nickName: values.nickName,
      password: values.password,
      email: values.email,
      captcha: values.captcha
    }
    await register(reqRegister)
    message.success('注册成功')
    setTimeout(() => {
      navigate('/login')
    }, 1000)
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  
  const sendCaptcha = async() => {
    const email = form.getFieldValue('email')
    await getRegisterCaptcha({ email })
    message.success('邮箱验证码已发送')
  }
  return (
    <div className="register-wrapper">
      <h1>会议室预订系统</h1>
        <Form
          name="basic"
          form={form}
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
            label="昵称"
            name="nickName"
            rules={[{ required: true, message: 'Please input your nickname!' }]}
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

          <Form.Item<FieldType>
            label="确认密码"
            name="confirmPassword"
            rules={[{ required: true, message: 'Please confirm your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            label="邮箱"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="验证码" style={{ marginBottom: 0 }}>
            <Row gutter={8}>
              <Col span={16}>
                <Form.Item<FieldType>
                  name="captcha"
                  rules={[{ required: true, message: 'Please input your email!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Button type="primary" block onClick={ sendCaptcha }>发送验证码</Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="text">已有账号? 去登录</Button>
            </div>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
            <Button type="primary" htmlType="submit" block>
              注册
            </Button>
          </Form.Item>
        </Form>
    </div>
  )
}