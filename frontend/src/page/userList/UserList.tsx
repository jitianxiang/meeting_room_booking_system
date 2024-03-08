import { Button, Form, Input, Table, Image, message, Modal, Card, Row, Col } from "antd";
import { ColumnsType } from "antd/es/table";
import './userList.css'
import { useEffect, useState } from "react";
import { freeze, getUserList } from "@/api/modules/user";
import { User } from "@/api/interface/user";

interface SearchUser {
  username: string;
  nickName: string;
  email: string;
}

export function UserList() {
  const [form] = Form.useForm()
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState(0)
  const [data, setData] = useState<User[]>()

  const columns: ColumnsType<User> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '头像',
      dataIndex: 'headPic',
      key: 'headPic',
      render: value => {
        return value ? <Image width={50} src={value} /> : ''
      }
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      key: 'nickName'
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: value => {
        return new Date(value).toLocaleDateString()
      }
    },
    {
      title: '操作',
      dataIndex: 'isFrozen',
      key: 'operation',
      render: (value, record: User) => {
        return <Button type="link" onClick={() => { toggleFrozen(record) }}>{value ? '解冻' : '冻结'}</Button>
      }
    } 
  ]

  const toggleFrozen = async(record: User) => {
    Modal.info({
      title: '提示',
      centered: true,
      closable: true,
      content: (
        <div>{`是否确定${record.isFrozen ? '解冻' : '冻结'}该用户` }</div>
      ),
      onOk: async() => {
        await freeze({ userId: record.id })
        message.success(`${record.isFrozen ? '解冻' : '冻结'}成功`)
        searchTableData()
      },
      onCancel() {}
    });
  }

  const searchTableData = async() => {
    const { data } = await getUserList({
      ...form.getFieldsValue(),
      pageNo: current,
      pageSize
    })
    setTotal(data.totalCount)
    setData(data.users)
  }

  const onFinish = () => {
    searchTableData()
  }

  const onReset = () => {
    form.setFieldValue('username', '')
    form.setFieldValue('nickName', '')
    form.setFieldValue('email', '')
    setCurrent(1)
    setPageSize(5)
  }

  const handlePaginationChanged = (page: number, pageSize: number) => {
    setPageSize(pageSize)
    setCurrent(page)
  }

  useEffect(() => {
    searchTableData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pageSize])

  return (
    <div className="user-list">
      <Card bordered={false} style={{ width: '100%' }}>
        <Form
          form={form}
          name="search"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
        >
          <Row>
            <Col span={6}>
              <Form.Item<SearchUser> label="用户名" name="username">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<SearchUser> label="昵称" name="nickName">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<SearchUser> label="邮箱" name="email" rules={[{ type: "email", message: '请输入合法邮箱地址!'}]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label=" " colon={false} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">搜索</Button>
                <Button htmlType="submit" onClick={onReset}>重置</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card bordered={false} style={{ width: '100%', marginTop: '20px' }}>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          rowKey={columns => columns.id}
          pagination={{
            current,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            onChange: handlePaginationChanged
          }}
        />
      </Card>
    </div>
  )
}