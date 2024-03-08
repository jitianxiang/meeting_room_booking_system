import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import './roomList.css'
import { useEffect, useState } from "react";
import { MeetingRoom, ReqAddMeetingRoom } from "@/api/interface/meetingRoom";
import { createMeetingRoom, getMeetingRoomList, delMeetingRoomById, getMeetingRoomInfoById, updateMeetingRoom } from '@/api/modules/meetingRoom';
import { ReqAddBooking } from '@/api/interface/bookingList'
import { addBooking } from "@/api/modules/booking";
import dayjs from "dayjs";

interface SearchUser {
  name: string;
  capacity: number;
  equipment: string;
}

const { RangePicker } = DatePicker;

export function RoomList() {
  const [form] = Form.useForm()
  const [meetingRoomForm] = Form.useForm()
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState(0)
  const [data, setData] = useState<MeetingRoom[]>()
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modelStatus, setModelStatus] = useState('')
  const [bookingForm] = Form.useForm()
  const [openBooking, setOpenBooking] = useState(false)
  const [confirmBookingLoading, setConfirmBookingLoading] = useState(false)
  const [bookingRoomId, setBookingRoomId] = useState(-1)

  const columns: ColumnsType<MeetingRoom> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '容纳人数',
      dataIndex: 'capacity',
      key: 'capacity'
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: '设备',
      dataIndex: 'equipment',
      key: 'equipment',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: value => {
        return new Date(value).toLocaleDateString()
      }
    },
    {
      title: '最近更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: value => {
        return new Date(value).toLocaleDateString()
      }
    },
    {
      title: '预订状态',
      dataIndex: 'isBooked',
      key: 'isBooked',
      render: (value: boolean) => {
        return <>{ value ? '已预定' : '未预定' }</>
      }
    },
    {
      title: '操作',
      dataIndex: 'isBooked',
      key: 'operation',
      render: (_value: boolean, record: MeetingRoom) => {
        return <div>
          <Button type="link" onClick={() => { updateRoom(record.id) }}>修改</Button>
          <Button type="link" onClick={() => {delRoom(record.id)}}>删除</Button>
          <Button type="link" onClick={() => {bookingRoom(record.id)}}>预定</Button>
        </div>
      }
    } 
  ]

  const bookingRoom = (id: number) => {
    setOpenBooking(true)
    setBookingRoomId(id)
  }

  const updateRoom = async(id: number) => {
    setModelStatus('update')
    setOpen(true)
    const { data } = await getMeetingRoomInfoById({ id })
    meetingRoomForm.setFieldsValue({ ...data })
  }

  const delRoom = async(id: number) => {
    Modal.info({
      title: '提示',
      centered: true,
      closable: true,
      content: (
        <div>{`是否确定删除该会议室`}</div>
      ),
      onOk: async() => {
        await delMeetingRoomById({ id })
        message.success('删除会议室成功')
        searchTableData()
      },
      onCancel() {}
    });
  }

  const searchTableData = async() => {
    const { data } = await getMeetingRoomList({
      ...form.getFieldsValue(),
      pageNo: current,
      pageSize
    })
    setTotal(data.totalCount)
    setData(data.meetingRooms)
  }

  const onFinish = () => {
    searchTableData()
  }

  const onReset = () => {
    form.setFieldValue('name', '')
    form.setFieldValue('capacity', '')
    form.setFieldValue('equipment', '')
    setCurrent(1)
    setPageSize(5)
  }

  const handlePaginationChanged = (page: number, pageSize: number) => {
    setPageSize(pageSize)
    setCurrent(page)
  }

  const addMeetingRoom = () => {
    setOpen(true)
    setModelStatus('add')
  }

  const handleOk = () => {
    setConfirmLoading(true)
    meetingRoomForm.validateFields().then(async() => {
      if (modelStatus === 'add') {
        await createMeetingRoom({ ...meetingRoomForm.getFieldsValue() })
      } else {
        await updateMeetingRoom({ ...meetingRoomForm.getFieldsValue(), id: meetingRoomForm.getFieldValue('id') })
      }
      setConfirmLoading(false)
      setOpen(false)
      message.success(`${modelStatus === 'add' ? '添加' : '更新'}会议室成功`)
      searchTableData()
    }).catch((e: any) => {
      console.log(e)
      setConfirmLoading(false)
    })
  }

  const handleCancel = () => {
    meetingRoomForm.resetFields()
    setOpen(false)
  }

  const handleBookingOk = () => {
    setConfirmBookingLoading(true)
    bookingForm.validateFields().then(async() => {
      await addBooking({
        ...bookingForm.getFieldsValue(),
        meetingRoomId: bookingRoomId,
        startTime: (!bookingForm.getFieldValue('timeRange') || bookingForm.getFieldValue('timeRange')[0] === '') ? '' : dayjs(bookingForm.getFieldValue('timeRange')[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: (!bookingForm.getFieldValue('timeRange') || bookingForm.getFieldValue('timeRange')[1] === '') ? '' : dayjs(bookingForm.getFieldValue('timeRange')[1]).format('YYYY-MM-DD HH:mm:ss')
      })
      setConfirmBookingLoading(false)
      message.success('预定会议成功')
      setOpenBooking(false)
    }).catch(() => {
      setConfirmBookingLoading(false)
    })
  }

  const handleBookingCancel = () => {
    bookingForm.resetFields()
    setOpenBooking(false)
  }

  useEffect(() => {
    searchTableData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pageSize])

  return (
    <div className="room-list">
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
              <Form.Item<SearchUser> label="会议室名称" name="name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<SearchUser> label="容纳人数" name="capacity">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<SearchUser> label="设备" name="equipment">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label=" " colon={false} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">搜索</Button>
                <Button htmlType="submit" onClick={onReset}>重置</Button>
                <Button type="primary" onClick={addMeetingRoom}>添加</Button>
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
      <Modal
        title={modelStatus === 'add' ? '新增会议室' : '修改会议室'}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={(handleCancel)}
      >
        <Form
          labelCol={{ span: 5 }}
          form={meetingRoomForm}
          name="model"
        >
          <Form.Item<ReqAddMeetingRoom> label="会议室名称" name="name" rules={[{ required: true, message: 'Please input!' }]}>
            <Input />
          </Form.Item>
          <Form.Item<ReqAddMeetingRoom> label="位置" name="location" rules={[{ required: true, message: 'Please input!' }]}>
            <Input />
          </Form.Item>
          <Form.Item<ReqAddMeetingRoom> label="容纳人数" name="capacity" rules={[{ required: true, message: 'Please input!' }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item<ReqAddMeetingRoom> label="设备" name="equipment">
            <Input />
          </Form.Item>
          <Form.Item<ReqAddMeetingRoom> label="描述" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={'预定会议'}
        open={openBooking}
        onOk={handleBookingOk}
        confirmLoading={confirmBookingLoading}
        onCancel={handleBookingCancel}
      >
        <Form
          labelCol={{ span: 5 }}
          form={bookingForm}
          name="model"
        >
          <Form.Item<ReqAddBooking> label="会议时间" name="timeRange">
            <RangePicker showTime />
          </Form.Item>
          <Form.Item<ReqAddBooking> label="备注" name="note">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}