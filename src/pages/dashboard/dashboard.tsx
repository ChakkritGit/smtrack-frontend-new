import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import HospitalAndWard from '../../components/filter/hospitalAndWard'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { AxiosError } from 'axios'
import { DeviceLogsType } from '../../types/smtrack/devices/deviceType'
import axiosInstance from '../../constants/axios/axiosInstance'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import CardInFoComponent from '../../components/pages/dashboard/cardInfo'
import CardStatus from '../../components/pages/dashboard/cardStatus'
import DeviceList from '../../components/filter/deviceList'
import Loading from '../../components/skeleton/table/loading'
import ChartSwiperWrapper from '../../components/pages/dashboard/chartSwiperWrapper'
import DataTableWrapper from '../../components/pages/dashboard/dataTableWrapper'

const Dashboard = () => {
  const { deviceId } = useSelector((state: RootState) => state.utils)
  const [deviceLogs, setDeviceLogs] = useState<DeviceLogsType>()
  const [loading, setLoading] = useState(false)
  const modalRef = useRef<HTMLDialogElement>(null)

  const fetchDeviceLogs = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get<responseType<DeviceLogsType>>(
        `/devices/device/${deviceId}`
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
  }, [deviceId])

  useEffect(() => {
    fetchDeviceLogs()
  }, [deviceId])

  const CardInfoComponent = useMemo(() => {
    return <CardInFoComponent deviceData={deviceLogs} />
  }, [deviceId, deviceLogs])

  const CardStatusComponent = useMemo(() => {
    return <CardStatus deviceData={deviceLogs} />
  }, [deviceId, deviceLogs])

  useEffect(() => {
    if (!deviceId) {
      modalRef.current?.showModal()
    } else {
      modalRef.current?.close()
    }
  }, [deviceId])

  return (
    <div className='p-3 px-[16px]'>
      <dialog ref={modalRef} className='modal'>
        <div className='modal-box h-[500px]'>
          <h2 className='text-xl mb-4'>Select a Device</h2>
          <DeviceList />
        </div>
      </dialog>
      {deviceId && (
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
