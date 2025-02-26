import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import HospitalAndWard from '../../../components/filter/hospitalAndWard'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'
import { AxiosError } from 'axios'
import { DeviceLogsType } from '../../../types/smtrack/devices/deviceType'
import axiosInstance from '../../../constants/axios/axiosInstance'
import { responseType } from '../../../types/smtrack/utilsRedux/utilsReduxType'
import DeviceList from '../../../components/filter/deviceList'
import Loading from '../../../components/skeleton/table/loading'
import CardInFoComponent from '../../../components/pages/dashboard/smtrack/cardInfo'
import CardStatus from '../../../components/pages/dashboard/smtrack/cardStatus'
import ChartSwiperWrapper from '../../../components/pages/dashboard/smtrack/chartSwiperWrapper'
import DataTableWrapper from '../../../components/pages/dashboard/smtrack/dataTableWrapper'
import { useTranslation } from 'react-i18next'
import { RiCloseLargeLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { deviceKey } = useSelector((state: RootState) => state.utils)
  const [deviceLogs, setDeviceLogs] = useState<DeviceLogsType>()
  const [loading, setLoading] = useState(false)
  const modalRef = useRef<HTMLDialogElement>(null)

  const fetchDeviceLogs = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get<responseType<DeviceLogsType>>(
        `/devices/device/${deviceKey}`
      )
      setDeviceLogs(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    } finally {
      setLoading(false)
    }
  }, [deviceKey])

  useEffect(() => {
    fetchDeviceLogs()
  }, [deviceKey])

  const CardInfoComponent = useMemo(() => {
    return (
      <CardInFoComponent
        deviceData={deviceLogs}
        fetchDevices={fetchDeviceLogs}
      />
    )
  }, [deviceKey, deviceLogs])

  const CardStatusComponent = useMemo(() => {
    return <CardStatus deviceData={deviceLogs} />
  }, [deviceKey, deviceLogs])

  useEffect(() => {
    if (!deviceKey) {
      modalRef.current?.showModal()
    } else {
      modalRef.current?.close()
    }
  }, [deviceKey])

  return (
    <div className='p-3 px-[16px]'>
      <dialog ref={modalRef} className='modal'>
        <div className='modal-box h-[500px]'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl mb-0'>{t('selectDeviceDrop')}</h2>
            <button
              type='button'
              className='btn btn-ghost outline-none flex p-0 min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] duration-300'
              onClick={() => navigate('/')}
            >
              <RiCloseLargeLine size={20} />
            </button>
          </div>
          <DeviceList />
        </div>
      </dialog>
      {deviceKey && (
        <>
          <div className='flex items-center justify-between flex-wrap lg:flex-nowrap xl:flex-nowrap gap-3 mt-[16px]'>
            <DeviceList />
            <HospitalAndWard />
          </div>
          {loading ? (
            <div className='flex items-center justify-center loading-hieght-full'>
              <Loading />
            </div>
          ) : (
            <>
              <div className='flex items-center gap-4 mt-4 flex-wrap lg:flex-wrap xl:flex-nowrap'>
                <div className='w-full xl:w-[35%] lg:h-[295px] bg-base-100 rounded-btn overflow-hidden'>
                  {CardInfoComponent}
                </div>
                <div className='grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 w-full xl:w-[65%] justify-items-center'>
                  {CardStatusComponent}
                </div>
              </div>
              <div className='grid grid-cols-1 lg:grid-cols-2 mt-4 gap-3'>
                <div className='w-full h-[435px]'>
                  <ChartSwiperWrapper deviceLogs={deviceLogs} />
                </div>
                <div className='w-full h-[435px]'>
                  <DataTableWrapper deviceLogs={deviceLogs} />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard
