import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { setDeviceId, setSearch } from '../../redux/actions/utilsActions'
import { DeviceCountType } from '../../types/smtrack/devices/deviceCount'
import { AxiosError } from 'axios'
import axiosInstance from '../../constants/axios/axiosInstance'
import HomeCount from '../../components/pages/home/homeCount'
import { useTranslation } from 'react-i18next'
import { RiLayoutGridLine, RiListUnordered } from 'react-icons/ri'
import DataTable, { TableColumn } from 'react-data-table-component'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'
import { useNavigate } from 'react-router-dom'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { DeviceResponseType } from '../../types/global/deviceResponseType'
import { DeviceType } from '../../types/smtrack/devices/deviceType'
import DataTableLoading from '../../components/skeleton/table/loading'
import HospitalAndWard from '../../components/filter/hospitalAndWard'
import { columnData } from '../../components/pages/home/column'
import { GlobalContext } from '../../contexts/globalContext'
import { GlobalContextType } from '../../types/global/globalContext'

const Home = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    globalSearch,
    cookieDecode,
    userProfile,
    hosId,
    wardId,
    tokenDecode
  } = useSelector((state: RootState) => state.utils)
  const { hospital, ward } = useContext(GlobalContext) as GlobalContextType
  const [deviceCount, setDeviceCount] = useState<DeviceCountType>()
  const [devices, setDevices] = useState<DeviceType[]>([])
  const [devicesFiltered, setDevicesFiltered] = useState<DeviceType[]>([])
  const [countFilter, setCountFilter] = useState('')
  const [listAndGrid, setListandGrid] = useState(
    Number(localStorage.getItem('listGrid') ?? 1)
  )
  const [deviceConnect, setDeviceConnect] = useState('')
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const { token } = cookieDecode || {}
  const { role } = tokenDecode || {}

  const fetchDeviceCount = useCallback(
    async (page: number, size = perPage) => {
      try {
        const response = await axiosInstance(
          `/dashboard/count?${
            wardId ? `ward=${wardId}&` : ''
          }page=${page}&perpage=${size}`
        )
        setDeviceCount(response.data.data)
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error.response?.data.message)
        } else {
          console.error(error)
        }
      }
    },
    [perPage, wardId]
  )

  const fetchDevices = useCallback(
    async (page: number, size = perPage) => {
      try {
        setLoading(true)
        const response = await axiosInstance.get<
          responseType<DeviceResponseType>
        >(
          `/devices/device?${
            wardId ? `ward=${wardId}&` : ''
          }page=${page}&perpage=${size}`
        )
        setDevices(response.data.data.devices)
        setTotalRows(response.data.data.total)
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error.message)
        } else {
          console.error(error)
        }
      } finally {
        setLoading(false)
      }
    },
    [perPage, wardId]
  )

  const changListAndGrid = (selected: number) => {
    localStorage.setItem('listGrid', String(selected))
    setListandGrid(selected)
  }

  const handlePageChange = (page: number) => {
    fetchDevices(page)
    fetchDeviceCount(page)
    setCurrentPage(page)
  }

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setPerPage(newPerPage)
    fetchDeviceCount(newPerPage)
    fetchDevices(page, newPerPage)
  }

  const handleRowClicked = (row: DeviceType) => {
    cookies.set('deviceId', row.id, cookieOptions) // it's mean setSerial
    dispatch(setDeviceId(row.id))
    navigate('/dashboard')
    window.scrollTo(0, 0)
  }

  const openmodal = (deviceData: DeviceType) => {
    console.log(deviceData)
  }

  const handleFilterConnect = (status: string) => {
    if (deviceConnect === status) {
      setDeviceConnect('')
    } else {
      setDeviceConnect(status)
    }
  }

  useEffect(() => {
    const filter = devices.filter(f => {
      const matchesSearch =
        f.id?.toLocaleLowerCase().includes(globalSearch.toLocaleLowerCase()) ||
        f.name
          ?.toLocaleLowerCase()
          .includes(globalSearch.toLocaleLowerCase()) ||
        f.location
          ?.toLocaleLowerCase()
          .includes(globalSearch.toLocaleLowerCase())

      const matchesConnection =
        deviceConnect === '' ||
        (deviceConnect === 'online' && f.online === true) ||
        (deviceConnect === 'offline' && f.online === false)

      return matchesSearch && matchesConnection
    })

    setDevicesFiltered(filter)
  }, [devices, globalSearch, deviceConnect])

  useEffect(() => {
    if (!token) return
    fetchDevices(1)
    fetchDeviceCount(1)
  }, [token, wardId])

  useEffect(() => {
    return () => {
      dispatch(setSearch(''))
    }
  }, [])

  const columns: TableColumn<DeviceType>[] = useMemo(
    () => columnData(t, handleRowClicked, openmodal),
    [t, navigate]
  )

  return (
    <div className='p-3 px-[16px]'>
      <div className='flex items-center justify-between mt-[16px]'>
        <span className='font-bold text-[20px]'>{t('showAllBox')}</span>
        {role === 'SUPER' && (
          <span className='bg-base-300 p-2 px-3 rounded-btn'>
            {`${
              hospital.filter(f => f.id?.includes(hosId))[0]?.hosName ??
              userProfile?.ward.hospital.hosName
            } - ${
              ward?.filter(w => w.id?.includes(wardId))[0]?.wardName ?? 'ALL'
            }`}
          </span>
        )}
      </div>
      <HomeCount
        deviceCount={deviceCount}
        countFilter={countFilter}
        setCountFilter={setCountFilter}
      />
      <div className='flex items-center justify-between my-4'>
        <span className='font-bold text-[20px]'>{t('detailAllBox')}</span>
        <div className='flex items-center gap-3 h-[40px]'>
          <div className='flex items-center gap-3'>
            <button
              className={`flex items-center justify-center btn w-max h-[36px] min-h-0 p-2 font-normal ${
                deviceConnect === 'online'
                  ? 'btn-primary text-white'
                  : 'btn-ghost border border-gray-500 text-gray-500'
              }`}
              onClick={() => handleFilterConnect('online')}
            >
              <div className='w-[10px] h-[10px] bg-green-500 rounded-btn'></div>
              <span>{t('deviceOnline')}</span>
            </button>
            <button
              className={`flex items-center justify-center btn w-max h-[36px] min-h-0 p-2 font-normal ${
                deviceConnect === 'offline'
                  ? 'btn-primary text-white'
                  : 'btn-ghost border border-gray-500 text-gray-500'
              }`}
              onClick={() => handleFilterConnect('offline')}
            >
              <div className='w-[10px] h-[10px] bg-red-500 rounded-btn'></div>
              <span>{t('deviceOffline')}</span>
            </button>
          </div>
          <div className='divider divider-horizontal mx-0 py-2'></div>
          <HospitalAndWard />
          <div className='flex items-center gap-2'>
            <button
              className={`flex items-center justify-center btn ${
                listAndGrid === 1
                  ? 'btn-primary text-white'
                  : 'btn-ghost border border-primary text-primary'
              } w-[36px] h-[36px] min-h-0 p-2 tooltip tooltip-top`}
              onClick={() => changListAndGrid(1)}
              data-tip={t('list')}
            >
              <RiListUnordered size={20} />
            </button>
            <button
              className={`flex items-center justify-center btn ${
                listAndGrid === 2
                  ? 'btn-primary text-white'
                  : 'btn-ghost border border-primary text-primary'
              } w-[36px] h-[36px] min-h-0 p-2 tooltip tooltip-top`}
              onClick={() => changListAndGrid(2)}
              data-tip={t('grid')}
            >
              <RiLayoutGridLine size={20} />
            </button>
          </div>
        </div>
      </div>
      {listAndGrid === 1 ? (
        <div className='dataTableWrapper bg-base-100 rounded-btn p-3 duration-300'>
          <DataTable
            responsive
            fixedHeader
            pagination
            paginationServer
            pointerOnHover
            columns={columns}
            data={devicesFiltered}
            paginationTotalRows={totalRows}
            paginationDefaultPage={currentPage}
            progressPending={loading}
            progressComponent={<DataTableLoading />}
            noDataComponent={<div>No data!</div>}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            onRowClicked={handleRowClicked}
            paginationRowsPerPageOptions={[10, 20, 50, 100, 150, 200]}
            fixedHeaderScrollHeight='calc(100dvh - 490px)'
          />
        </div>
      ) : (
        <div>card</div>
      )}
    </div>
  )
}

export default Home
