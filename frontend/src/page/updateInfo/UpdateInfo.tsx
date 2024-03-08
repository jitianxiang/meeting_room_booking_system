import { Button, Col, Form, Input, Row, Upload, message } from "antd";
import './updateInfo.css'
import { getUserInfo, getUpdateUserInfoCaptcha, updateUserInfo } from "@/api/modules/user";
import { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadProps } from 'antd';

type FieldType = {
  headPic: string;
  nickName: string;
  email: string;
  captcha: string;
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export function UpdateInfo() {
  const [form] = Form.useForm()
  const fetchData = async() => {
    const { data } = await getUserInfo()
    setImageUrl(data.headPic ? data.headPic : '')
    form.setFieldValue('nickName', data.nickName)
    form.setFieldValue('email', data.email)
  }
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onFinish = async(values: any) => {
    await updateUserInfo({ ...values, headPic: imageUrl })
    message.success('修改个人信息成功')
    form.resetFields()
    fetchData()
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const sendCaptcha = async() => {
    await getUpdateUserInfoCaptcha()
    message.success('邮箱验证码已发送')
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    return isJpgOrPng;
  }

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      setLoading(false)
      const url = `http://127.0.0.1:3000${info.file.response.data}`
      setImageUrl(url)
    }
  };

  return (
    <div className="updateInfo-wrapper">
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        style={{ minWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <Form.Item<FieldType>
          label="头像"
          name="headPic"
          rules={[{ required: true, message: 'Please input your headPic!' }]}
        >
          <Upload
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            action="http://localhost:3000/api/user/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} /> : uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item<FieldType>
          label="昵称"
          name="nickName"
          rules={[{ required: true, message: 'Please input your nickName!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="邮箱"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item label="验证码" style={{ marginBottom: 0 }}>
          <Row gutter={8}>
            <Col span={16}>
              <Form.Item<FieldType>
                name="captcha"
                rules={[{ required: true, message: 'Please input your captcha!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button type="primary" block onClick={ sendCaptcha }>发送验证码</Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <Button type="primary" htmlType="submit" block>
            修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}