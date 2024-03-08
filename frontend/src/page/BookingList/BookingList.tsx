import { Button, Card, Col, DatePicker, Form, Input, Row, Table, message } from 'antd'
import './bookingList.css'
import dayjs from 'dayjs';
import { Booking } from '@/api/interface/bookingList';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { changeBookingStatus, getBookingList } from '@/api/modules/booking';
import { StatusEnum } from '@/api/interface/bookingList';

const { RangePicker } = DatePicker;

interface SearchBooking {
  username: string
  meetingRoomName: string
  meetingRoomLocation: string
  bookingTime: string[]
}

const StatusMapping = {
  [StatusEnum.APPLYING]: '申请中',
  [StatusEnum.APPROVED]: '审批通过',
  [StatusEnum.REJECTED]: '审批驳回',
  [StatusEnum.REMOVED]: '已解除'
}

export function BookingList() {
  const [form] = Form.useForm()
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState(0)
  const [data, setData] = useState<Booking[]>()

  const columns: ColumnsType<Booking> = [
    {
      title: '会议室名称',
      dataIndex: 'room',
      key: 'roomName',
      render: (_, record) => {
        return record.room.name
      }
    },
    {
      title: '会议室位置',
      dataIndex: 'room',
      key: 'roomLocation',
      render: (_, record) => {
        return record.room.location
      }
    },
    {
      title: '预定人',
      dataIndex: 'user',
      key: 'userName',
      render: (_, record) => {
        return record.user.username
      }
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (_, record) => {
        return dayjs(new Date(record.startTime)).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (_, record) => {
        return dayjs(new Date(record.endTime)).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        return StatusMapping[record.status]
      }
    },
    {
      title: '预定时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (_, record) => {
        return dayjs(new Date(record.createTime)).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '备注',
      dataIndex: 'note',
      key: 'note'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record) => {
        return <div style={{ display: 'flex' }}>
          <Button type="primary" onClick={() => { _changeBookingStatus(record.id, StatusEnum.APPROVED) }}>通过</Button>
          <Button danger style={{ marginLeft: '10px' }} onClick={() => { _changeBookingStatus(record.id, StatusEnum.REJECTED) }}>驳回</Button>
          <Button danger style={{ marginLeft: '10px' }} onClick={() => { _changeBookingStatus(record.id, StatusEnum.REMOVED) }}>解除</Button>
        </div>
      }
    }
  ]

  const _changeBookingStatus = async(id: number, status: StatusEnum) => {
    await changeBookingStatus({ id, status })
    message.success('预定状态修改成功')
    searchTableData()
  }

  const handlePaginationChanged = (page: number, pageSize: number) => {
    setPageSize(pageSize)
    setCurrent(page)
  }

  const onFinish = () => {
    searchTableData()
  }
  
  const onReset = () => {
    form.setFieldValue('username', '')
    form.setFieldValue('meetingRoomName', '')
    form.setFieldValue('meetingRoomLocation', '')
    form.setFieldValue('bookingTime', ['', ''])
    setCurrent(1)
    setPageSize(5)
  }

  const searchTableData = async() => {
    const { data } = await getBookingList({
      ...form.getFieldsValue(),
      pageNo: current,
      pageSize,
      bookingStartTime: (!form.getFieldValue('bookingTime') || form.getFieldValue('bookingTime')[0] === '') ? '' : dayjs(form.getFieldValue('bookingTime')[0]).format('YYYY-MM-DD HH:mm:ss'),
      bookingEndTime: (!form.getFieldValue('bookingTime') || form.getFieldValue('bookingTime')[1] === '') ? '' : dayjs(form.getFieldValue('bookingTime')[1]).format('YYYY-MM-DD HH:mm:ss')
    })
    setTotal(data.totalCount)
    setData(data.bookings)
  }

  useEffect(() => {
    searchTableData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pageSize])

  return (
    <div className="booking-list">
      <Card bordered={false} style={{ width: '100%' }}>
        <Form
          form={form}
          name="search"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
        >
          <Row>
            <Col span={8}>
              <Form.Item<SearchBooking> label="预定人" name="username">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<SearchBooking> label="会议室名称" name="meetingRoomName">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<SearchBooking> label="会议室位置" name="meetingRoomLocation">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<SearchBooking> label="预定时间" name="bookingTime">
                <RangePicker showTime />
              </Form.Item>
            </Col>
            <Col span={8} offset={8}>
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