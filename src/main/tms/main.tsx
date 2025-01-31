import { Outlet } from 'react-router-dom'
import { RootState } from '../../redux/reducers/rootReducer'
import { useDispatch, useSelector } from 'react-redux'
import { SubmitLoading } from '../../components/loading/submitLoading'
import { useEffect } from 'react'
import axiosInstance from '../../constants/axios/axiosInstance'
import {
  responseType,
  UserProfileType
} from '../../types/smtrack/utilsRedux/utilsReduxType'
import { setSocketData, setUserProfile } from '../../redux/actions/utilsActions'
import { AxiosError } from 'axios'
import { socket } from '../../services/websocket'
import { SocketResponseType } from '../../types/global/socketType'
import Navbar from '../../components/navigation/navbar/navbar'
import Sidebar from '../../components/navigation/sidebar/tsm/sidebar'
import toast, { ToastOptions, useToasterStore } from 'react-hot-toast'
import { RiCloseLargeFill } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import { changIcon, changText } from '../../constants/utils/webSocket'
import notificationSound from '../../assets/sounds/notification.mp3'

const MainTms = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { toasts } = useToasterStore()
  const {
    submitLoading,
    cookieDecode,
    tokenDecode,
    socketData,
    soundMode,
    popUpMode
  } = useSelector((state: RootState) => state.utils)
  const { token } = cookieDecode || {}
  const { id, hosId, role } = tokenDecode || {}
  const notiSound = new Audio(notificationSound)
  let isFirstLoad = true
  let isPlaying = false
  const toastLimit = 5

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
          } else {
            console.error('Something wrong' + error)
          }
        } else {
          console.error('Uknown error: ', error)
        }
      }
    }
  }

  const handleConnect = () => {}
  const handleDisconnect = (reason: any) =>
    console.error('Disconnected from Socket server:', reason)
  const handleError = (error: any) => console.error('Socket error:', error)
  const handleMessage = (response: SocketResponseType) => {
    if (!role && !hosId) return

    if (
      role === 'LEGACY_ADMIN' ||
      role === 'LEGACY_USER' ||
      role === 'SUPER' ||
      role === 'SERVICE' ||
      hosId === response.hospital
    ) {
      dispatch(setSocketData(response))
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

  useEffect(() => {
    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('error', handleError)
    socket.on('receive_message', handleMessage)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('error', handleError)
      socket.off('receive_message', handleMessage)
    }
  }, [hosId, role])

  useEffect(() => {
    toasts
      .filter(toasts => toasts.visible)
      .filter((_, index) => index >= toastLimit)
      .forEach(toasts => toast.dismiss(toasts.id))
  }, [toasts])

  useEffect(() => {
    const isMessageValid = socketData?.message?.toLowerCase()
    if (
      socketData &&
      !popUpMode &&
      !soundMode &&
      isMessageValid &&
      !isMessageValid.includes('device offline') &&
      !isMessageValid.includes('device online')
    ) {
      if (!isPlaying) {
        notiSound.play()
        isPlaying = true

        setTimeout(() => {
          isPlaying = false
        }, 3000)
      }
    }

    if (
      socketData &&
      !popUpMode &&
      !socketData.message.includes('Device offline') &&
      !socketData.message.includes('Device online')
    ) {
      toast(
        (_t: ToastOptions) => (
          <div className='flex items-center gap-4 rounded-full min-w-[280px]'>
            <div className='flex flex-col'>
              <span className='text-sm font-bold'>
                {socketData.device ? socketData.device : '- -'}
              </span>
              <span className='text-sm'>
                {changText(socketData.message, t)}
              </span>
              <span className='text-sm'>
                {new Date(socketData.time).toLocaleString('th-TH', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  timeZone: 'UTC'
                })}
              </span>
            </div>
            <button
              className='flex items-center justify-center bg-base-300/30 text-base-content/50 border-none rounded-full p-2 cursor-pointer hover:opacity-50 duration-300'
              onClick={() => toast.dismiss(_t.id)}
            >
              <RiCloseLargeFill size={24} />
            </button>
          </div>
        ),
        {
          icon: changIcon(socketData.message),
          duration: 10000,
          style: {
            backgroundColor:
              'var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity, 1)))',
            borderRadius: 'var(--rounded-btn, 0.5rem)',
            padding: '.5rem .7rem',
            backdropFilter:
              'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)',
            WebkitBackdropFilter:
              'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)',
            width: 'max-content'
          }
        }
      )
    }
  }, [socketData, soundMode, popUpMode])

  return (
    <main>
      <div className='drawer lg:drawer-open w-auto'>
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

export default MainTms
