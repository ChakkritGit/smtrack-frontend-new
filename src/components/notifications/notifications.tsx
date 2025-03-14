import { useEffect, useMemo, useState } from 'react'
import {
  RiAlarmWarningFill,
  RiArrowRightUpLine,
  RiDoorClosedLine,
  RiDoorOpenLine,
  RiNotification4Line,
  RiSignalWifi3Line,
  RiSignalWifiErrorLine
} from 'react-icons/ri'
import axiosInstance from '../../constants/axios/axiosInstance'
import {
  responseType,
  UserProfileType
} from '../../types/smtrack/utilsRedux/utilsReduxType'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { NotificationType } from '../../types/global/notification'
import { FaTemperatureArrowDown, FaTemperatureArrowUp } from 'react-icons/fa6'
import {
  TbPlugConnected,
  TbPlugConnectedX,
  TbReportAnalytics
} from 'react-icons/tb'
import { MdOutlineSdCard, MdOutlineSdCardAlert } from 'react-icons/md'
import { extractValues } from '../../constants/utils/utilsConstants'
import { RootState } from '../../redux/reducers/rootReducer'
import { useDispatch, useSelector } from 'react-redux'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import { setTokenExpire } from '../../redux/actions/utilsActions'

const Notifications = () => {
  const dispatch = useDispatch()
  const { tokenDecode, tmsMode, userProfile, socketData } = useSelector(
    (state: RootState) => state.utils
  )
  const location = useLocation()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [notificationList, setNotification] = useState<NotificationType[]>([])
  const { role = 'USER' } = tokenDecode || {}

  const fetchNotificaton = async () => {
    try {
      const response = await axiosInstance.get<
        responseType<NotificationType[]>
      >(
        role === 'LEGACY_ADMIN' || role === 'LEGACY_USER' || tmsMode
          ? `/legacy/templog/alert/notification`
          : `/log/notification`
      )
      setNotification(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        console.error(error.message)
      } else {
        console.error(error)
      }
    }
  }

  const subTextNotiDetails = (text: string) => {
    if (text.split('/')[0] === 'PROBE1') {
      const probe = text.split('/')
      const probeNumber = probe[0].replace('PROBE', '')
      const doorNumber = probe[1].replace('DOOR', '')
      const status = probe[2] === 'ON' ? t('stateOn') : t('stateOff')
      return `${t('deviceProbeTb')} ${probeNumber} ${t(
        'doorNum'
      )} ${doorNumber} ${status}`
    } else if (text.split('/')[0] === 'TEMP') {
      if (text.split('/')[1] === 'OVER') {
        return t('tempHigherLimmit')
      } else if (text.split('/')[1] === 'LOWER') {
        return t('tempBelowLimmit')
      } else {
        return t('tempBackToNormal')
      }
    } else if (text.split('/')[0] === 'AC') {
      if (text.split('/')[1] === 'ON') {
        return t('plugBackToNormal')
      } else {
        return t('plugProblem')
      }
    } else if (text.split('/')[0] === 'SD') {
      if (text.split('/')[1] === 'ON') {
        return t('SdCardProblem')
      } else {
        return t('SdCardBackToNormal')
      }
    } else if (text.split('/')[0] === 'REPORT') {
      return `${t('reportText')}/ ${t('devicsmtrackTb')}: ${
        extractValues(text)?.temperature
          ? extractValues(text)?.temperature
          : '- -'
      }°C, ${t('deviceHumiTb')}: ${
        extractValues(text)?.humidity ? extractValues(text)?.humidity : '- -'
      }%`
    } else if (text.split('/')[0] === 'INTERNET') {
      if (text.split('/')[1] === 'ON') {
        return t('InternetProblem')
      } else {
        return t('InternetBackToNormal')
      }
    } else {
      return text
    }
  }

  const subTextNotiDetailsIcon = (text: string) => {
    if (text.split('/')[0] === 'PROBE1') {
      const probe = text.split('/')
      return probe[2] === 'ON' ? (
        <RiDoorOpenLine size={24} />
      ) : (
        <RiDoorClosedLine size={24} />
      )
    } else if (text.split('/')[0] === 'TEMP') {
      if (text.split('/')[1] === 'OVER') {
        return <FaTemperatureArrowUp size={24} />
      } else if (text.split('/')[1] === 'LOWER') {
        return <FaTemperatureArrowDown size={24} />
      } else {
        return <RiAlarmWarningFill size={24} />
      }
    } else if (text.split('/')[0] === 'AC') {
      if (text.split('/')[1] === 'ON') {
        return <TbPlugConnected size={24} />
      } else {
        return <TbPlugConnectedX size={24} />
      }
    } else if (text.split('/')[0] === 'SD') {
      if (text.split('/')[1] === 'ON') {
        return <MdOutlineSdCardAlert size={24} />
      } else {
        return <MdOutlineSdCard size={24} />
      }
    } else if (text.split('/')[0] === 'REPORT') {
      return <TbReportAnalytics size={24} />
    } else if (text.split('/')[0] === 'INTERNET') {
      if (text.split('/')[1] === 'ON') {
        return <RiSignalWifiErrorLine size={24} />
      } else {
        return <RiSignalWifi3Line size={24} />
      }
    } else {
      return <RiAlarmWarningFill size={24} />
    }
  }

  const changeFavicon = (
    href: string,
    notificationarray: NotificationType[],
    path: Location<any>,
    Profile: UserProfileType | undefined
  ) => {
    const pathSegment = path.pathname.split('/')[1]
    const capitalized =
      pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1)

    if (notificationarray.length > 0) {
      const link: HTMLLinkElement =
        document.querySelector("link[rel*='icon']") ||
        document.createElement('link')
      link.type = 'image/png'
      link.rel = 'icon'
      link.href = href

      document.getElementsByTagName('head')[0].appendChild(link)
      document.title =
        (notificationarray.length > 0 ? `(${notificationarray.length}) ` : '') +
        Profile?.ward.hospital.hosName +
        ' - ' +
        `${path.pathname.split('/')[1] !== '' ? capitalized : 'Home'}`
    } else {
      const link: HTMLLinkElement =
        document.querySelector("link[rel*='icon']") ||
        document.createElement('link')
      link.type = 'image/png'
      link.rel = 'icon'
      link.href = href

      document.getElementsByTagName('head')[0].appendChild(link)
      document.title =
        Profile?.ward.hospital.hosName +
        ' - ' +
        `${path.pathname.split('/')[1] !== '' ? capitalized : 'Home'}`
    }
  }

  useEffect(() => {
    if (notificationList.length > 0) {
      const baseImageSrc = `/api/proxy?url=${encodeURIComponent(
        userProfile?.ward.hospital.hosPic || 'app-logo.png'
      )}`

      const img = new Image()
      img.src = baseImageSrc
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        console.log('✅ Image loaded successfully:', img.src)

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          console.error('❌ Canvas context is null')
          return
        }

        const size = 64
        canvas.width = size
        canvas.height = size

        ctx.drawImage(img, 0, 0, size, size)

        const dotSize = 24
        const x = size - dotSize + 10
        const y = dotSize / 5 + 10
        ctx.fillStyle = '#e74c3c'
        ctx.beginPath()
        ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2)
        ctx.fill()

        console.log('🎨 Image drawn on canvas')

        changeFavicon(
          canvas.toDataURL('image/png'),
          [...notificationList],
          location,
          userProfile
        )
      }
    } else {
      if (userProfile?.ward.hospital.hosPic) {
        changeFavicon(
          `${userProfile?.ward.hospital.hosPic}`,
          [...notificationList],
          location,
          userProfile
        )
      }
    }
  }, [location, userProfile, notificationList])

  useEffect(() => {
    fetchNotificaton()
  }, [socketData])

  const NotificationList = useMemo(
    () => (
      <ul
        tabIndex={1}
        className='dropdown-content bg-base-100 text-base-content rounded-box top-px mt-16 right-0 max-h-[calc(100dvh-180px)]
        w-[360px] md:max-h-[520px] md:w-[480px] overflow-y-auto
        border border-white/5 shadow-2xl outline outline-1 outline-black/5'
      >
        <div className='flex items-center justify-between p-2 h-[54px] bg-base-100/70 backdrop-blur-md border-b border-base-content/10 shadow-sm sticky top-0 z-10'>
          <span className='text-base ml-2'>{t('titleNotification')}</span>
          <button
            className='btn btn-ghost border border-base-content/20 flex p-0 duration-300 max-h-[34px] min-h-[34px]
             max-w-[34px] min-w-[34px] tooltip tooltip-left'
            data-tip={t('isExapndText')}
            onClick={() => navigate('/notification')}
          >
            <RiArrowRightUpLine size={20} />
          </button>
        </div>
        {/* <div className='divider divider-vertical before:h-[1px] after:h-[1px] m-0 h-0'></div> */}
        {role === 'LEGACY_ADMIN' || role === 'LEGACY_USER' || tmsMode ? (
          <div>
            {notificationList.length > 0 ? (
              notificationList.map((item, index) => (
                <li className='flex items-center gap-3 py-2 px-3' key={index}>
                  <div className='bg-primary/10 text-primary/70 rounded-btn p-1'>
                    <RiAlarmWarningFill size={24} />
                  </div>
                  <div className='flex flex-col gap-1 w-full'>
                    <div className='flex items-center justify-between gap-3'>
                      <span>{item.message}</span>
                      <div className='flex flex-col items-end opacity-70'>
                        <span className='text-[14px]'>
                          {item.createdAt.substring(11, 16)}
                        </span>
                        <span className='w-max text-[14px]'>
                          {item.createdAt.substring(0, 10)}
                        </span>
                      </div>
                    </div>
                    <span className='text-[14px] opacity-70'>
                      {item?.mcuId}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <div className='flex items-center justify-center loading-hieght-full'>
                <div>{t('notificationEmpty')}</div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {notificationList.length > 0 ? (
              notificationList.map((item, index) => (
                <li className='flex items-center gap-3 py-2 px-3' key={index}>
                  <div className='bg-primary/10 text-primary/70 rounded-btn p-1'>
                    {subTextNotiDetailsIcon(item.message)}
                  </div>
                  <div className='flex flex-col gap-1 w-full'>
                    <div className='flex items-center justify-between gap-3'>
                      <span>{subTextNotiDetails(item.message)}</span>
                      <div className='flex flex-col items-end opacity-70'>
                        <span className='text-[14px]'>
                          {item.createAt.substring(11, 16)}
                        </span>
                        <span className='w-max text-[14px]'>
                          {item.createAt.substring(0, 10)}
                        </span>
                      </div>
                    </div>
                    <span className='text-[14px] opacity-70'>
                      {item.device.name}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <div className='flex items-center justify-center loading-hieght-full'>
                <div>{t('notificationEmpty')}</div>
              </div>
            )}
          </div>
        )}
      </ul>
    ),
    [notificationList]
  )

  return (
    <div className='dropdown dropdown-end'>
      <div
        tabIndex={0}
        role='button'
        className='indicator btn btn-ghost justify-end'
      >
        {notificationList.length > 0 && (
          <span className='indicator-item badge badge-secondary px-1 top-3 right-4 lg:right-3'>
            {notificationList.length > 99 ? '99+' : notificationList.length}
          </span>
        )}
        <RiNotification4Line size={24} />
      </div>
      {NotificationList}
    </div>
  )
}

export default Notifications
