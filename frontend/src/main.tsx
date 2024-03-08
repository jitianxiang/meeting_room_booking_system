import ReactDOM from 'react-dom/client'
import './reset.css'
import { Login } from './page/login/Login'
import { Register } from './page/register/Register'
import { UpdatePassword } from './page/updatePassword/UpdatePassword'
import { IndexPage } from './page/index/Index'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { UpdateInfo } from './page/updateInfo/UpdateInfo'
import { UserList } from './page/userList/UserList'
import { RoomList } from './page/roomList/RoomList'
import { BookingList } from './page/BookingList/BookingList'

const routes = [
  {
    path: '/',
    element: <IndexPage />,
    children: [
      {
        path: 'user',
        element: <Outlet />,
        children: [
          {
            path: 'update-info',
            element: <UpdateInfo />
          },
          {
            path: 'user-list',
            element: <UserList />
          }
        ]
      },
      {
        path: 'home',
        element: <h2>Welcom!</h2>
      },
      {
        path: 'meeting-room',
        element: <Outlet />,
        children: [
          {
            path: 'room-list',
            element: <RoomList />
          },
          {
            path: 'booking-list',
            element: <BookingList />
          }
        ]
      }
    ]
  },
  {
    path: 'login',
    element: <Login />
  },
  {
    path: 'register',
    element: <Register />
  },
  {
    path: 'update-password',
    element: <UpdatePassword />
  },
]

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={ router } />
)
