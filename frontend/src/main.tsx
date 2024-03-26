import ReactDOM from 'react-dom/client'
import './reset.css'
import { Login } from './page/login/Login'
import { Register } from './page/register/Register'
import { UpdatePassword } from './page/updatePassword/UpdatePassword'
import { IndexPage } from './page/index/Index'
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { UpdateInfo } from './page/updateInfo/UpdateInfo'
import { UserList } from './page/userList/UserList'
import { RoomList } from './page/roomList/RoomList'
import { BookingList } from './page/BookingList/BookingList'
import { Learn } from './page/Learn/Learn'
import { Provider } from 'react-redux'
import store from './store'

const routes = [
  {
    path: '/',
    element: (
      <>
        <IndexPage />
        <Navigate to='/user' />
      </>
    ),
    children: [
      {
        path: 'user',
        element: (
          <>
            <Outlet />
            <Navigate to='/user/user-list' />
          </>
        ),
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
  {
    path: 'learn',
    element: <Learn />
  }
]

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={ router } />
  </Provider>
)
