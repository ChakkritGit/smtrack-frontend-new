import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../../components/navigation/navbar/navbar'
import Sidebar from '../../components/navigation/sidebar/sidebar'
import { useEffect } from 'react'
import { RootState } from '../../redux/reducers/rootReducer'
import { useDispatch, useSelector } from 'react-redux'
import axiosInstance from '../../constants/axios/axiosInstance'
import {
  responseType,
  UserProfileType
} from '../../types/smtrack/utilsRedux/utilsReduxType'
import { setUserProfile } from '../../redux/actions/utilsActions'
import { AxiosError } from 'axios'

const MainSmtrack = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { cookieDecode, tokenDecode } = useSelector(
    (state: RootState) => state.utils
  )
  const { token } = cookieDecode || {}
  const { id } = tokenDecode || {}
  let isFirstLoad = true

  const fetchUserProfile = async () => {
    if (id) {
      try {
        const response = await axiosInstance.get<responseType<UserProfileType>>(
          `${
            import.meta.env.VITE_APP_NODE_ENV === 'development'
              ? import.meta.env.VITE_APP_AUTH
              : ''
          }/auth/user/${id}`
        )
        dispatch(setUserProfile(response.data.data))
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            // dispatch(setShowAlert(true))
          } else {
            console.error('Something wrong' + error)
          }
        } else {
          console.error('Uknown error: ', error)
        }
      }
    }
  }

  useEffect(() => {
    if (!token) return
    if (location.pathname !== '/login') {
      window.scrollTo(0, 0)

      if (isFirstLoad) {
        fetchUserProfile()
        isFirstLoad = false
        return
      }

      const timer = setTimeout(() => {
        fetchUserProfile()
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [location, token, tokenDecode])


  return (
    <main className='h-full bg-base-200 duration-300'>
      <div className='drawer lg:drawer-open w-auto'>
        <input id='my-drawer-2' type='checkbox' className='drawer-toggle' />
        <div className='drawer-content'>
          <Navbar />
          <Outlet />
        </div>
        <Sidebar />
      </div>
    </main>
  )
}

export default MainSmtrack
