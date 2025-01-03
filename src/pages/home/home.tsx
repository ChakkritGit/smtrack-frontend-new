import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { setDeviceId, setSearch } from '../../redux/actions/utilsActions'
import { DeviceCountType } from '../../types/smtrack/devices/deviceCount'
import { AxiosError } from 'axios'
import axiosInstance from '../../constants/axios/axiosInstance'
import HomeCount from '../../components/pages/home/homeCount'
import { useTranslation } from 'react-i18next'
import {
  RiDoorClosedLine,
  RiDoorOpenLine,
  RiErrorWarningLine,
  RiLayoutGridLine,
  RiListUnordered,
  RiSettings3Line,
  RiTempColdLine
} from 'react-icons/ri'
import DataTable, { TableColumn } from 'react-data-table-component'
import {
  calulateDate,
  cookieOptions,
  cookies
} from '../../constants/utils/utilsConstants'
import { useNavigate } from 'react-router-dom'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { DeviceResponseType } from '../../types/global/deviceResponseType'
import { DeviceType } from '../../types/smtrack/devices/deviceType'
import DataTableLoading from '../../components/skeleton/table/loading'
import { DoorKey } from '../../types/global/doorQty'

const Home = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { globalSearch, cookieDecode, wardId } = useSelector(
    (state: RootState) => state.utils
  )
  const [deviceCount, setDeviceCount] = useState<DeviceCountType>()
  const [devices, setDevices] = useState<DeviceType[]>([])
  const [devicesFiltered, setDevicesFiltered] = useState<DeviceType[]>([])
  const [countFilter, setCountFilter] = useState('')
  const [listAndGrid, setListandGrid] = useState(
    Number(localStorage.getItem('listGrid') ?? 1)
  )
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const { token } = cookieDecode || {}

  const fetchDeviceCount = useCallback(
    async (page: number, size = perPage) => {
      try {
        const response = await axiosInstance(
          `/dashboard/count?${
            wardId ? `ward=${wardId}&` : ''
          }page=${page}&perpage=${size}`
        )
        setDeviceCount(response.data)
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

  useEffect(() => {
    const filter = devices.filter(
      f =>
        f.id.toLocaleLowerCase().includes(globalSearch.toLocaleLowerCase()) ||
        f.name
          ?.toLocaleLowerCase()
          .includes(globalSearch.toLocaleLowerCase()) ||
        f.location
          ?.toLocaleLowerCase()
          .includes(globalSearch.toLocaleLowerCase())
    )
    setDevicesFiltered(filter)
  }, [devices, globalSearch])

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
        name: t('deviceSerialTb'),
        cell: item => (
          <span
            className='tooltip'
            data-tip={item.id}
            onClick={() => handleRowClicked(item)}
          >
            {item.id}
          </span>
        ),
        sortable: false,
        center: true,
        width: '200px'
      },
      {
        name: t('deviceNameTb'),
        cell: item => (
          <div
            className='tooltip'
            data-tip={item.name ?? '—'}
            onClick={() => handleRowClicked(item)}
          >
            <span className='truncate max-w-[150px]'>{item.name ?? '—'}</span>
          </div>
        ),
        sortable: false,
        center: true
      },
      {
        name: t('deviceLocationTb'),
        cell: item => (
          <div
            className='tooltip'
            data-tip={item.location ?? '—'}
            onClick={() => handleRowClicked(item)}
          >
            <span className='truncate max-w-[100px]'>
              {item.location ?? '—'}
            </span>
          </div>
        ),
        sortable: false,
        center: true
      },
      {
        name: t('devicTemperatureTb'),
        selector: item =>
          item.log[0]?.tempDisplay
            ? `${item.log[0]?.tempDisplay.toFixed(2)}°C`
            : '—',
        sortable: false,
        center: true
      },
      {
        name: t('deviceHumiTb'),
        selector: item =>
          item.log[0]?.humidityDisplay
            ? `${item.log[0]?.humidityDisplay.toFixed(2)}%`
            : '—',
        sortable: false,
        center: true
      },
      {
        name: t('deviceProbeTb'),
        cell: item => {
          const [temp] = item.log.filter(log => log.serial === item.id)
          const [probe] = item.probe.filter(probe => probe.sn === item.id)
          const isTempOutOfRange =
            temp?.tempDisplay >= probe?.tempMax ||
            temp?.tempDisplay <= probe?.tempMin

          return (
            <div
              className={`w-[24px] h-[24px] flex items-center justify-center rounded-btn ${
                isTempOutOfRange
                  ? 'bg-red-500 text-white'
                  : 'border border-primary text-primary'
              }`}
            >
              {isTempOutOfRange ? (
                <RiErrorWarningLine size={14} />
              ) : (
                <RiTempColdLine size={14} />
              )}
            </div>
          )
        },
        sortable: false,
        center: true
      },
      {
        name: t('deviceDoorTb'),
        cell: item => {
          const doorCount: number = item.probe[0]?.doorQty || 1
          const doors: DoorKey[] = ['door1', 'door2', 'door3']

          return (
            <>
              {doors.slice(0, doorCount).map(doorKey => (
                <div
                  key={doorKey}
                  className={`w-[24px] h-[24px] flex items-center justify-center rounded-btn ${
                    item.log[0]?.[doorKey]
                      ? 'bg-red-500 text-white'
                      : 'border border-primary text-primary'
                  }`}
                >
                  {item.log[0]?.[doorKey] ? (
                    <RiDoorOpenLine size={14} />
                  ) : (
                    <RiDoorClosedLine size={14} />
                  )}
                </div>
              ))}
            </>
          )
        },
        sortable: false,
        center: true
      },
      {
        name: t('deviceConnectTb'),
        cell: item => (
          <div
            className={`w-max h-[24px] px-2 flex items-center justify-center rounded-btn ${
              item.online ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {item.online ? t('deviceOnline') : t('deviceOffline')}
          </div>
        ),
        sortable: false,
        center: true
      },
      {
        name: t('devicePlugTb'),
        selector: item =>
          item.log[0]?.plug ? t('stateNormal') : t('stateProblem'),
        sortable: false,
        center: true
      },
      {
        name: t('deviceBatteryTb'),
        selector: item =>
          item.log[0]?.battery ? `${item.log[0].battery}%` : '- -',
        sortable: false,
        center: true
      },
      {
        name: t('deviceWarrantyTb'),
        cell: item => {
          return (
            <span
              className={`w-max max-w-[150px] h-[24px] px-2 flex items-center justify-center rounded-btn ${
                calulateDate(item).remainingDays <= 0 &&
                calulateDate(item).months <= 0 &&
                calulateDate(item).years <= 0
                  ? 'bg-red-500 text-white'
                  : ''
              }`}
            >
              {item.warranty[0]?.expire
                ? calulateDate(item).daysRemaining > 0
                  ? calulateDate(item).years > 0
                    ? `${calulateDate(item).years} ${t('year')} ${
                        calulateDate(item).months
                      } ${t('month')} ${calulateDate(item).remainingDays} ${t(
                        'day'
                      )}`
                    : calulateDate(item).months > 0
                    ? `${calulateDate(item).months} ${t('month')} ${
                        calulateDate(item).remainingDays
                      } ${t('day')}`
                    : `${calulateDate(item).remainingDays} ${t('day')}`
                  : t('tabWarrantyExpired')
                : t('notRegistered')}
            </span>
          )
        },
        sortable: false,
        center: true,
        width: '140px'
      },
      {
        name: t('deviceActionTb'),
        cell: item => (
          <RiSettings3Line
            size={24}
            className='hover:fill-primary duration-300'
            onClick={() => openmodal(item)}
          />
        ),
        sortable: false,
        center: true
      }
    ],
    [t, navigate]
  )

  return (
    <div className='p-3 px-[16px]'>
      <div className='flex items-center justify-between mt-[16px]'>
        <span className='font-bold text-[20px]'>{t('showAllBox')}</span>
        <span>Hospital name</span>
      </div>
      <HomeCount
        deviceCount={deviceCount}
        countFilter={countFilter}
        setCountFilter={setCountFilter}
      />
      <div className='flex items-center justify-between my-4'>
        <span className='font-bold text-[20px]'>{t('detailAllBox')}</span>
        <div className='flex items-center gap-2'>
          <button
            className={`flex items-center justify-center btn ${
              listAndGrid === 1
                ? 'btn-primary text-white'
                : 'btn-ghost border border-primary text-primary'
            } w-[36px] h-[36px] min-h-0 p-2`}
            onClick={() => changListAndGrid(1)}
          >
            <RiListUnordered size={20} />
          </button>
          <button
            className={`flex items-center justify-center btn ${
              listAndGrid === 2
                ? 'btn-primary text-white'
                : 'btn-ghost border border-primary text-primary'
            } w-[36px] h-[36px] min-h-0 p-2`}
            onClick={() => changListAndGrid(2)}
          >
            <RiLayoutGridLine size={20} />
          </button>
        </div>
      </div>
      {listAndGrid === 1 ? (
        <div className='dataTableWrapper rounded-btn p-3'>
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
