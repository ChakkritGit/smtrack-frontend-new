import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../../components/navigation/navbar/navbar'
import { useEffect, useState } from 'react'
import { RootState } from '../../redux/reducers/rootReducer'
import { useDispatch, useSelector } from 'react-redux'
import axiosInstance from '../../constants/axios/axiosInstance'
import {
  responseType,
  UserProfileType
} from '../../types/smtrack/utilsRedux/utilsReduxType'
import { setUserProfile } from '../../redux/actions/utilsActions'
import { AxiosError } from 'axios'
import { SubmitLoading } from '../../components/loading/submitLoading'
import Sidebar from '../../components/navigation/sidebar/smtrack/sidebar'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'

const MainSmtrack = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { cookieDecode, tokenDecode, submitLoading, userProfile } = useSelector(
    (state: RootState) => state.utils
  )
  const { token } = cookieDecode || {}
  const { id } = tokenDecode || {}
  const [isFirstLoad, setIsFirstLoad] = useState(true)

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
        if (!userProfile) {
          cookies.set('userProfile', response.data.data, cookieOptions)
          dispatch(setUserProfile(response.data.data))
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
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
        setIsFirstLoad(false)
        return
      }

      const timer = setTimeout(() => {
        fetchUserProfile()
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [location, token, tokenDecode, isFirstLoad])

  return (
    <main>
      <div className='drawer lg:drawer-open w-auto duration-300'>
        <input id='my-drawer-2' type='checkbox' className='drawer-toggle' />
        <div className='drawer-content'>
          <Navbar />
          <Outlet />
        </div>
        <Sidebar />
      </div>
      {submitLoading && <SubmitLoading submitLoading={submitLoading} />}
    </main>
  )
}

export default MainSmtrack
