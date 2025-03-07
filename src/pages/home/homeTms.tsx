import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { GlobalContextType } from '../../types/global/globalContext'
import { GlobalContext } from '../../contexts/globalContext'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import axiosInstance from '../../constants/axios/axiosInstance'
import { AxiosError } from 'axios'
import DataTable, { TableColumn } from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
import { setDeviceKey, setSearch, setTokenExpire } from '../../redux/actions/utilsActions'
import HospitalAndWard from '../../components/filter/hospitalAndWard'
import Loading from '../../components/skeleton/table/loading'
import DataTableNoData from '../../components/skeleton/table/noData'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'
import {
  CountTms,
  DeviceTmsType,
  TmsLogType
} from '../../types/tms/devices/deviceType'
import HomeCountTms from '../../components/pages/home/homeCountTms'
import { columnTms, subColumnData } from '../../components/pages/home/columnTms'

const HomeTms = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    userProfile,
    hosId,
    wardId,
    tokenDecode,
    globalSearch,
    cookieDecode
  } = useSelector((state: RootState) => state.utils)
  const { hospital, ward } = useContext(GlobalContext) as GlobalContextType
  const { role } = tokenDecode || {}
  const { token } = cookieDecode || {}
  const [deviceCount, setDeviceCount] = useState<CountTms>()
  const [devices, setDevices] = useState<DeviceTmsType[]>([])
  const [devicesFiltered, setDevicesFiltered] = useState<DeviceTmsType[]>([])

  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(cookies.get('homeRowPerPageTms') ?? 10)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchDeviceCount = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/legacy/templog/dashboard/count${wardId ? `?ward=${wardId}&` : ''}`
      )
      setDeviceCount(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    }
  }, [perPage, wardId])

  const fetchDevices = useCallback(
    async (page: number, size = perPage) => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(
          `/legacy/device?${
            wardId ? `ward=${wardId}&` : ''
          }page=${page}&perpage=${size}`
        )
        setDevices(response.data.data?.devices)
        setTotalRows(response.data.data?.total)
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setTokenExpire(true))
          }
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

  const handlePageChange = (page: number) => {
    fetchDevices(page)
    fetchDeviceCount()
    setCurrentPage(page)
  }

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setPerPage(newPerPage)
    fetchDeviceCount()
    fetchDevices(page, newPerPage)
    cookies.set('homeRowPerPageTms', newPerPage, cookieOptions)
  }

  const handleRowClicked = (row: DeviceTmsType) => {
    cookies.set('deviceKey', row.sn, cookieOptions) // it's mean setSerial
    dispatch(setDeviceKey(row.sn))
    navigate('/dashboard')
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    const filter = devices?.filter(f => {
      const matchesSearch =
        f.id?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        f.name?.toLowerCase().includes(globalSearch.toLowerCase())

      return matchesSearch
    })

    setDevicesFiltered(filter)
  }, [devices, globalSearch])

  useEffect(() => {
    if (!token) return
    fetchDevices(1)
    fetchDeviceCount()
  }, [token, wardId])

  useEffect(() => {
    return () => {
      dispatch(setSearch(''))
    }
  }, [])

  const columns: TableColumn<DeviceTmsType>[] = useMemo(
    () => columnTms(t, handleRowClicked),
    [t, navigate]
  )

  const subColumns: TableColumn<TmsLogType>[] = useMemo(
    () => subColumnData(t),
    [t, devicesFiltered]
  )

  const ExpandedComponent = ({ data }: { data: DeviceTmsType }) => {
    const { log } = data
    const filtered = Object.values(
      log.reduce<Record<string, TmsLogType>>((acc, item) => {
        if (!acc[item.mcuId] || acc[item.mcuId].updatedAt < item.updatedAt) {
          acc[item.mcuId] = item
        }
        return acc
      }, {})
    )

    return (
      <div className='dataTableSubWrapper bg-base-100 rounded-btn duration-300'>
        <DataTable
          responsive
          columns={subColumns}
          data={filtered}
          noDataComponent={<DataTableNoData />}
        />
      </div>
    )
  }

  return (
    <div className='p-3 px-[16px]'>
      <div className='flex items-center justify-between mt-[16px]'>
        <span className='font-bold text-[20px]'>{t('showAllBox')}</span>
        {role === 'SUPER' && (
          <span className='bg-base-300 p-2 px-3 rounded-btn'>
            {`${
              hospital?.filter(f => f.id?.includes(hosId))[0]?.hosName ??
              userProfile?.ward?.hospital?.hosName
            } - ${
              ward?.filter(w => w.id?.includes(wardId))[0]?.wardName ?? 'ALL'
            }`}
          </span>
        )}
      </div>
      <HomeCountTms deviceCount={deviceCount} />
      <div className='flex lg:items-center justify-between flex-col lg:flex-row gap-3 lg:gap-0 my-4'>
        <span className='font-bold text-[20px]'>{t('detailAllBox')}</span>
        <div className='flex items-end lg:items-center gap-3 flex-col lg:flex-row lg:h-[40px]'>
          <HospitalAndWard />
        </div>
      </div>
      <div className='dataTableWrapper bg-base-100 rounded-btn p-3 duration-300'>
        <DataTable
          responsive
          fixedHeader
          pagination
          paginationServer
          pointerOnHover
          expandableRows
          columns={columns}
          data={devicesFiltered}
          paginationTotalRows={totalRows}
          paginationDefaultPage={currentPage}
          paginationPerPage={perPage}
          progressPending={loading}
          progressComponent={<Loading />}
          noDataComponent={<DataTableNoData />}
          expandableRowsComponent={ExpandedComponent}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          onRowClicked={handleRowClicked}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 150, 200]}
          fixedHeaderScrollHeight='calc(100dvh - 490px)'
        />
      </div>
    </div>
  )
}

export default HomeTms
