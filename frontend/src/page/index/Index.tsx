import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './index.css'
import { Menu, MenuProps } from 'antd'
import { UserOutlined, ScheduleOutlined, HomeOutlined } from '@ant-design/icons'

export function IndexPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    navigate('/' + e.keyPath.reverse().join('/'))
  };
  const items = [
    {
      label: '首页',
      key: 'home',
      icon: <HomeOutlined />
    },
    {
      label: '用户',
      key: 'user',
      icon: <UserOutlined />,
      children: [
        {
          label: '用户列表',
          key: 'user-list',
        },
        {
          label: '修改个人信息',
          key: 'update-info',
        }
      ]
    },
    {
      label: '会议室',
      key: 'meeting-room',
      icon: <ScheduleOutlined />,
      children: [
        {
          label: '会议室列表',
          key: 'room-list',
        },
        {
          label: '预定历史',
          key: 'booking-list',
        }
      ]
    }
  ]

  const getMenuSelectedKeys = () => {
    return [location.pathname.split('/')[location.pathname.split('/').length - 1]]
  }

  return (
    <div className="index-wrapper">
      <div className='nav'>
        <Menu
          onClick={onClick}
          style={{ width: 256 }}
          defaultSelectedKeys={getMenuSelectedKeys()}
          defaultOpenKeys={['user', 'meeting-room']}
          mode="inline"
          items={items}
        />
      </div>
      <div className='main'>
        <div className='header'>
          <h2>会议室预订系统</h2>
        </div>
        <div className='page'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}