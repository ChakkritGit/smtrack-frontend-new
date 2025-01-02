import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/reducers/rootReducer"
import { useCallback, useEffect, useMemo, useState } from "react"
import { setSearch } from "../../redux/actions/utilsActions"
import { DeviceCountType } from "../../types/smtrack/devices/deviceCount"
import { AxiosError } from "axios"
import axiosInstance from "../../constants/axios/axiosInstance"
import HomeCount from "../../components/pages/home/homeCount"
import { useTranslation } from "react-i18next"
import { RiLayoutGridLine, RiListUnordered } from "react-icons/ri"
import DataTable, { TableColumn } from "react-data-table-component"
import { cookieOptions, cookies } from "../../constants/utils/utilsConstants"
import { useNavigate } from "react-router-dom"
import { responseType } from "../../types/smtrack/utilsRedux/utilsReduxType"
import { DeviceResponseType } from "../../types/global/deviceResponseType"
import { DeviceType } from "../../types/smtrack/devices/deviceType"
import DataTableLoading from "../../components/skeleton/table/loading"

const Home = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { globalSearch, cookieDecode, wardId } = useSelector((state: RootState) => state.utils)
  const [deviceCount, setDeviceCount] = useState<DeviceCountType>()
  const [devices, setDevices] = useState<DeviceType[]>([])
  const [countFilter, setCountFilter] = useState('')
  const [listAndGrid, setListandGrid] = useState(Number(localStorage.getItem('listGrid') ?? 1))
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const { token } = cookieDecode || {}

  const fetchDeviceCount = useCallback(async (page: number, size = perPage) => {
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
  }, [perPage, wardId])

  const fetchDevices = useCallback(async (page: number, size = perPage) => {
    try {
      setLoading(true)
      const response = await axiosInstance.get<responseType<DeviceResponseType>>(`/devices/device?${wardId ? `ward=${wardId}&` : ''}page=${page}&perpage=${size}`)
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
  }, [perPage, wardId])

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
    // dispatch(setSerial(row.sn))
    navigate('/dashboard')
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    if (!token) return
    fetchDevices(1)
    fetchDeviceCount(1)
  }, [token])

  useEffect(() => {
    return () => {
      dispatch(setSearch(''))
    }
  }, [])

  const columns: TableColumn<DeviceType>[] = useMemo(
    () => [
      {
        name: 'Serial',
        selector: (item) => item.id,
        sortable: false,
        center: true
      },
      {
        name: 'Name',
        selector: (item) => item.name ?? "—",
        sortable: false,
        center: true
      },
    ], [])

  return (
    <div className="p-3 px-[16px]">
      <div className="flex items-center justify-between mt-[16px]">
        <span className="font-bold text-[20px]">{t('showAllBox')}</span>
        <span>Hospital name</span>
      </div>
      <HomeCount
        deviceCount={deviceCount}
        countFilter={countFilter}
        setCountFilter={setCountFilter}
      />
      <div className="flex items-center justify-between my-4">
        <span className="font-bold text-[20px]">{t('detailAllBox')}</span>
        <div className="flex items-center gap-3">
          <button className={`flex items-center justify-center btn ${listAndGrid === 1 ? "btn-primary" : "btn-ghost border border-primary text-primary"} w-[36px] h-[36px] min-h-0 p-2`} onClick={() => changListAndGrid(1)}>
            <RiListUnordered size={20} />
          </button>
          <button className={`flex items-center justify-center btn ${listAndGrid === 2 ? "btn-primary" : "btn-ghost border border-primary text-primary"} w-[36px] h-[36px] min-h-0 p-2`} onClick={() => changListAndGrid(2)}>
            <RiLayoutGridLine size={20} />
          </button>
        </div>
      </div>
      {
        listAndGrid === 1 ?
          <div className="dataTableWrapper">
            <DataTable
              columns={columns}
              data={devices}
              progressComponent={<DataTableLoading />}
              progressPending={true}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationDefaultPage={currentPage}
              paginationRowsPerPageOptions={[10, 20, 50, 100, 150, 200]}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              onRowClicked={handleRowClicked}
              noDataComponent={<div>No data!</div>}
              responsive
              pointerOnHover
              fixedHeader
              fixedHeaderScrollHeight="calc(100dvh - 490px)"
            />
          </div>
          :
          <div>
            card
          </div>
      }
    </div>
  )
}

export default Home