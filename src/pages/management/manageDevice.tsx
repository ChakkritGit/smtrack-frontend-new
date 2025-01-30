import { useTranslation } from 'react-i18next'
import HospitalAndWard from '../../components/filter/hospitalAndWard'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DeviceTmsType } from '../../types/tms/devices/deviceType'
import axiosInstance from '../../constants/axios/axiosInstance'
import { RootState } from '../../redux/reducers/rootReducer'
import { useDispatch, useSelector } from 'react-redux'
import { AxiosError } from 'axios'
import { setSearch } from '../../redux/actions/utilsActions'
import DataTable, { TableColumn } from 'react-data-table-component'
import Loading from '../../components/skeleton/table/loading'
import DataTableNoData from '../../components/skeleton/table/noData'
import { useNavigate } from 'react-router-dom'

const ManageDevice = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { wardId, globalSearch, cookieDecode } = useSelector(
    (state: RootState) => state.utils
  )
  const [devices, setDevices] = useState<DeviceTmsType[]>([])
  const [devicesFiltered, setDevicesFiltered] = useState<DeviceTmsType[]>([])
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const { token } = cookieDecode || {}

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
    setCurrentPage(page)
  }

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setPerPage(newPerPage)
    fetchDevices(page, newPerPage)
  }

  useEffect(() => {
    const filter = devices?.filter(f => {
      const matchesSearch =
        f.id?.toLocaleLowerCase().includes(globalSearch.toLocaleLowerCase()) ||
        f.name?.toLocaleLowerCase().includes(globalSearch.toLocaleLowerCase())

      return matchesSearch
    })

    setDevicesFiltered(filter)
  }, [devices, globalSearch])

  useEffect(() => {
    if (!token) return
    fetchDevices(1)
  }, [token, wardId])

  useEffect(() => {
    return () => {
      dispatch(setSearch(''))
    }
  }, [])

  // const columns: TableColumn<DeviceTmsType>[] = useMemo(() => [], [t, navigate])

  const columns: TableColumn<DeviceTmsType>[] = [
    {
      name: t('deviceSerialTb'),
      cell: item => <span title={item.sn}>{item.sn}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('deviceNameBox'),
      cell: item => item.name,
      sortable: false,
      center: true
    },
    {
      name: t('hospitalsName'),
      cell: item => item.hospital,
      sortable: false,
      center: true
    },
    {
      name: t('wardsName'),
      cell: item => item.ward,
      sortable: false,
      center: true
    }
  ]

  return (
    <div>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between mt-3'>
        <span className='text-[20px] font-medium'>
          {/* {t('tabManageDevice')} */}
        </span>
        <div className='flex flex-col lg:flex-row mt-3 lg:mt-0 lg:items-center items-end gap-4'>
          <HospitalAndWard />
          <button className='btn btn-primary max-w-[130px]'>
            {t('addDeviceButton')}
          </button>
        </div>
      </div>
      <div className='dataTableWrapper bg-base-100 rounded-btn p-3 mt-5 duration-300'>
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
          progressComponent={<Loading />}
          noDataComponent={<DataTableNoData />}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 150, 200]}
          fixedHeaderScrollHeight='calc(100dvh - 490px)'
        />
      </div>
    </div>
  )
}

export default ManageDevice
