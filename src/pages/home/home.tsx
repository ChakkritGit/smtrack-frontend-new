import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/reducers/rootReducer"
import { useEffect, useState } from "react"
import { setSearch } from "../../redux/actions/utilsActions"
import { DeviceCountType } from "../../types/smtrack/devices/deviceCount"
import { AxiosError } from "axios"
import axiosInstance from "../../constants/axios/axiosInstance"
import HomeCount from "../../components/pages/home/homeCount"

const Home = () => {
  const dispatch = useDispatch()
  const { globalSearch, cookieDecode } = useSelector((state: RootState) => state.utils)
  const [deviceCount, setDeviceCount] = useState<DeviceCountType>()
  const [countFilter, setCountFilter] = useState('')
  const { token } = cookieDecode || {}

  const fetchDeviceCount = async () => {
    try {
      const response = await axiosInstance("/dashboard/count")
      setDeviceCount(response.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    if (!token) return
    fetchDeviceCount()
  }, [token])

  useEffect(() => {
    return () => {
      dispatch(setSearch(''))
    }
  }, [])

  return (
    <div className="p-3 px-[16px]">
      <div className="flex items-center justify-between mt-[16px]">
        <span className="font-bold text-[20px]">Event of day</span>
        <span>Hospital name</span>
      </div>
      <HomeCount
        deviceCount={deviceCount}
        countFilter={countFilter}
        setCountFilter={setCountFilter}
      />
    </div>
  )
}

export default Home