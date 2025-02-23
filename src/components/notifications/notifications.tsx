import { useEffect, useState } from 'react'
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
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { AxiosError } from 'axios'
import Loading from '../skeleton/table/loading'
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
import { useSelector } from 'react-redux'

const Notifications = () => {
  const { tokenDecode, tmsMode } = useSelector(
    (state: RootState) => state.utils
  )
  const { t } = useTranslation()
  const [notificationList, setNotification] = useState<NotificationType[]>([])
  const [loading, setLoading] = useState(false)
  const { role = 'USER' } = tokenDecode || {}

  const fetchNotificaton = async () => {
    try {
      setLoading(true)
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
        console.error(error.message)
      } else {
        console.error(error)
      }
    } finally {
      setLoading(false)
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

  useEffect(() => {
    fetchNotificaton()
  }, [])

  return (
    <div className='dropdown dropdown-end'>
      <div
        tabIndex={0}
        role='button'
        className='indicator btn btn-ghost justify-end'
      >
        {notificationList.length > 0 && (
          <span className='indicator-item badge badge-secondary px-1 top-2 right-4 lg:right-3'>
            {notificationList.length > 99 ? '99+' : notificationList.length}
          </span>
        )}
        <RiNotification4Line size={24} />
      </div>
      <ul
        tabIndex={0}
        className='dropdown-content bg-base-100 text-base-content rounded-box top-px mt-16 max-h-[520px] w-[480px] overflow-y-auto border border-white/5 shadow-2xl outline outline-1 outline-black/5'
      >
        <div className='flex items-center justify-between p-2 h-[49px]'>
          <span className='text-base ml-2'>{t('titleNotification')}</span>
          <button
            className='btn btn-ghost border border-base-content/20 flex p-0 duration-300 max-h-[34px] min-h-[34px] max-w-[34px] min-w-[34px] tooltip tooltip-left'
            data-tip={t('isExapndText')}
          >
            <RiArrowRightUpLine size={20} />
          </button>
        </div>
        <div className='divider divider-vertical before:h-[1px] after:h-[1px] m-0 h-0'></div>
        {role === 'LEGACY_ADMIN' || role === 'LEGACY_USER' || tmsMode ? (
          <div>
            {!loading ? (
              notificationList.length > 0 ? (
                notificationList.map((item, index) => (
                  <li
                    className='flex items-center gap-3 bg-primary/5 py-2 px-3'
                    key={index}
                  >
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
              )
            ) : (
              <Loading />
            )}
          </div>
        ) : (
          <div>
            {!loading ? (
              notificationList.length > 0 ? (
                notificationList.map((item, index) => (
                  <li
                    className='flex items-center gap-3 bg-primary/5 py-2 px-3'
                    key={index}
                  >
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
              )
            ) : (
              <Loading />
            )}
          </div>
        )}
      </ul>
    </div>
  )
}

export default Notifications
