import { useTranslation } from 'react-i18next'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import {
  DeviceLogTms,
  LogChartTms
} from '../../../types/tms/devices/deviceType'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import axiosInstance from '../../../constants/axios/axiosInstance'
import { responseType } from '../../../types/smtrack/utilsRedux/utilsReduxType'
import { cookies } from '../../../constants/utils/utilsConstants'
import { AxiosError } from 'axios'
import { RiDashboardLine, RiTableFill } from 'react-icons/ri'
import FullTableTmsComponent from '../../../components/pages/dashboard/tms/fullTableTms'

const FullTableTms = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation() as Location<{ deviceLogs: DeviceLogTms }>
  const { deviceLogs } = location.state ?? {
    deviceLogs: { sn: '', minTemp: 0, maxTemp: 0 }
  }
  const { sn, minTemp, maxTemp } = deviceLogs
  const [pageNumber, setPagenumber] = useState(1)
  const [dataLog, setDataLog] = useState<LogChartTms[]>([])
  const [filterDate, setFilterDate] = useState({
    startDate: '',
    endDate: ''
  })

  const logDay = async () => {
    setPagenumber(1)
    setDataLog([])
    try {
      const response = await axiosInstance.get<responseType<LogChartTms[]>>(
        `/legacy/graph?filter=day&sn=${sn ? sn : cookies.get('deviceKey')}`
      )
      setDataLog(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data?.message)
      } else {
        console.error(error)
      }
    }
  }

  const logWeek = async () => {
    setPagenumber(2)
    setDataLog([])
    try {
      const response = await axiosInstance.get<responseType<LogChartTms[]>>(
        `/legacy/graph?filter=week&sn=${sn ? sn : cookies.get('deviceKey')}`
      )
      setDataLog(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data?.message)
      } else {
        console.error(error)
      }
    }
  }

  const logMonth = async () => {
    setPagenumber(3)
    setDataLog([])
    try {
      const response = await axiosInstance.get<responseType<LogChartTms[]>>(
        `/legacy/graph?filter=month&sn=${sn ? sn : cookies.get('deviceKey')}`
      )
      setDataLog(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data?.message)
      } else {
        console.error(error)
      }
    }
  }

  const Logcustom = async () => {
    const { endDate, startDate } = filterDate
    let startDateNew = new Date(filterDate.startDate)
    let endDateNew = new Date(filterDate.endDate)
    let timeDiff = Math.abs(endDateNew.getTime() - startDateNew.getTime())
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    if (startDate !== '' && endDate !== '') {
      if (diffDays <= 31) {
        try {
          setDataLog([])
          const responseData = await axiosInstance.get<
            responseType<LogChartTms[]>
          >(
            `/legacy/graph?filter=${filterDate.startDate},${
              filterDate.endDate
            }&sn=${sn ? sn : cookies.get('deviceKey')}`
          )
          setDataLog(responseData.data.data)
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
      } else {
        Swal.fire({
          title: t('alertHeaderWarning'),
          text: t('customMessageLogData'),
          icon: 'warning',
          timer: 3000,
          showConfirmButton: false
        })
      }
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: 'warning',
        timer: 2000,
        showConfirmButton: false
      })
    }
  }

  useEffect(() => {
    logDay()
  }, [])

  useEffect(() => {
    if (sn === '') {
      navigate('/dashboard')
    }
  }, [sn])

  return (
    <div className='container mx-auto p-3'>
      <div className='breadcrumbs text-sm mt-3'>
        <ul>
          <li>
            <a onClick={() => navigate('/dashboard')}>
              <RiDashboardLine size={16} className='mr-1' />
              {t('sideDashboard')}
            </a>
          </li>
          <li>
            <span className='inline-flex items-center gap-2'>
              <RiTableFill size={16} className='mr-1' />
              {t('fullTable')}
            </span>
          </li>
        </ul>
      </div>
      <div className='flex items-center justify-between flex-col md:flex-row gap-3 mt-2'>
        <div role='tablist' className='tabs tabs-bordered justify-start w-full'>
          <a
            role='tab'
            className={`tab ${pageNumber === 1 ? 'tab-active' : ''}`}
            onClick={() => logDay()}
          >
            {t('chartDay')}
          </a>
          <a
            role='tab'
            className={`tab ${pageNumber === 2 ? 'tab-active' : ''}`}
            onClick={() => logWeek()}
          >
            {t('chartWeek')}
          </a>
          <a
            role='tab'
            className={`tab ${pageNumber === 3 ? 'tab-active' : ''}`}
            onClick={() => logMonth()}
          >
            {t('month')}
          </a>
          <a
            role='tab'
            className={`tab ${pageNumber === 4 ? 'tab-active' : ''}`}
            onClick={() => setPagenumber(4)}
          >
            {t('chartCustom')}
          </a>
        </div>
        <div className='flex items-center justify-end w-full'>export</div>
      </div>
      {pageNumber === 4 && (
        <div className='flex items-end justify-center flex-col md:items-center md:flex-row gap-3 mt-3'>
          <input
            type='date'
            className='input input-bordered w-full md:max-w-xs'
            onChange={e =>
              setFilterDate({ ...filterDate, startDate: e.target.value })
            }
          />
          <input
            type='date'
            className='input input-bordered w-full md:max-w-xs'
            onChange={e =>
              setFilterDate({ ...filterDate, endDate: e.target.value })
            }
          />
          <button className='btn btn-primary' onClick={() => Logcustom()}>
            Search
          </button>
        </div>
      )}
      <FullTableTmsComponent
        dataLog={dataLog}
        tempMin={minTemp}
        tempMax={maxTemp}
      />
    </div>
  )
}

export default FullTableTms
