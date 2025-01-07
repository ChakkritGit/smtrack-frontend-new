import Select from 'react-select'
import axiosInstance from '../../constants/axios/axiosInstance'
import { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { DeviceListType } from '../../types/smtrack/devices/deviceType'
import { Option } from '../../types/global/hospitalAndWard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { setDeviceId } from '../../redux/actions/utilsActions'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'

const DeviceList = () => {
  const dispatch = useDispatch()
  const { deviceId } = useSelector((state: RootState) => state.utils)
  const [deviceList, setDeviceList] = useState<DeviceListType[]>([])
  const fetchDeviceList = useCallback(async () => {
    try {
      const response = await axiosInstance.get<responseType<DeviceListType[]>>(
        '/devices/dashboard/device'
      )
      setDeviceList(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    }
  }, [])

  const mapOptions = <T, K extends keyof T>(
    data: T[],
    valueKey: K,
    labelKey: K
  ): Option[] =>
    data.map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))

  const mapDefaultValue = <T, K extends keyof T>(
    data: T[],
    id: string,
    valueKey: K,
    labelKey: K
  ): Option | undefined =>
    data
      .filter(item => item[valueKey] === id)
      .map(item => ({
        value: item[valueKey] as unknown as string,
        label: item[labelKey] as unknown as string
      }))[0]

  useEffect(() => {
    fetchDeviceList()
  }, [])

  return (
    <Select
      options={mapOptions<DeviceListType, keyof DeviceListType>(
        deviceList,
        'id',
        'name'
      )}
      value={mapDefaultValue<DeviceListType, keyof DeviceListType>(
        deviceList,
        deviceId,
        'id',
        'name'
      )}
      onChange={e => {
        cookies.set('deviceId', String(e?.value), cookieOptions)
        dispatch(setDeviceId(String(e?.value)))
      }}
      autoFocus={false}
      className='react-select-container z-[75] min-w-full md:min-w-[315px]'
      classNamePrefix='react-select'
    />
  )
}

export default DeviceList
