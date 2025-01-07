import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import HospitalAndWard from '../../components/filter/hospitalAndWard'
import Select from 'react-select'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { AxiosError } from 'axios'
import { DeviceLogsType } from '../../types/smtrack/devices/deviceType'
import axiosInstance from '../../constants/axios/axiosInstance'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import CardInFoComponent from '../../components/pages/dashboard/cardInfo'

const Dashboard = () => {
  const { deviceId } = useSelector((state: RootState) => state.utils)
  const [deviceLogs, setDeviceLogs] = useState<DeviceLogsType>()
  const modalRef = useRef<HTMLDialogElement>(null)

  const fetchDeviceLogs = useCallback(async () => {
    try {
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
    }
  }, [deviceId])

  useEffect(() => {
    fetchDeviceLogs()
  }, [deviceId])

  const CardInfo = useMemo(
    () => <CardInFoComponent deviceData={deviceLogs} />,
    [deviceId, deviceLogs]
  )

  useEffect(() => {
    if (deviceId) {
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
          <Select
            options={[
              { value: 'chocolate', label: 'Chocolate' },
              { value: 'strawberry', label: 'Strawberry' },
              { value: 'vanilla', label: 'Vanilla' }
            ]}
            autoFocus={false}
            className='react-select-container z-[75] min-w-full md:min-w-[315px]'
            classNamePrefix='react-select'
            menuIsOpen
          />
        </div>
      </dialog>
      {!deviceId && (
        <>
          <div className='flex items-center justify-between flex-wrap lg:flex-nowrap xl:flex-nowrap gap-3 mt-[16px]'>
            <Select
              options={[
                { value: 'chocolate', label: 'Chocolate' },
                { value: 'strawberry', label: 'Strawberry' },
                { value: 'vanilla', label: 'Vanilla' }
              ]}
              autoFocus={false}
              className='react-select-container z-[75] min-w-full md:min-w-[315px]'
              classNamePrefix='react-select'
            />
            <HospitalAndWard />
          </div>
          <div className='flex items-center gap-4 mt-4 flex-wrap lg:flex-wrap xl:flex-nowrap'>
            <div className='w-full xl:w-[40%] h-[295px] bg-base-100 rounded-btn'>
              {CardInfo}
            </div>
            <div className='grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 w-full xl:w-[60%] justify-items-center'>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
            </div>
          </div>
          <div className='flex items-center flex-wrap xl:flex-nowrap gap-4 mt-4'>
            <div className='w-full xl:w-[50%] h-[400px]'>chart</div>
            <div className='w-full xl:w-[50%] h-[400px]'>table</div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
