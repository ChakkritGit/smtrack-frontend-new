import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { setSearch } from '../../redux/actions/utilsActions'
import {
  handleApiError,
  swalWithBootstrapButtons
} from '../../constants/utils/utilsConstants'
import axiosInstance from '../../constants/axios/axiosInstance'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { WarrantiesType } from '../../types/smtrack/warranties/warranties'
import { RootState } from '../../redux/reducers/rootReducer'
import { RiDeleteBin7Line, RiEditLine } from 'react-icons/ri'
import DataTable, { TableColumn } from 'react-data-table-component'
import Loading from '../../components/skeleton/table/loading'
import DataTableNoData from '../../components/skeleton/table/noData'

interface dataTableProps {
  warrantyData: WarrantiesType[]
}

const Warranty = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { globalSearch, tokenDecode } = useSelector(
    (state: RootState) => state.utils
  )
  const [tab, setTab] = useState(1)
  const [warrantyData, setWarrantyData] = useState<WarrantiesType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { role } = tokenDecode || {}

  const fetchWarranty = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get<responseType<WarrantiesType[]>>(
        '/devices/warranty'
      )
      setWarrantyData(response.data.data)
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  }

  const manageMenu = useMemo(
    () => (
      <div role='tablist' className='tabs tabs-bordered w-72 md:w-max mt-3'>
        <a
          role='tab'
          className={`tab text-sm md:text-base ${tab === 1 ? 'tab-active' : ''}`}
          onClick={() => setTab(1)}
        >
          {t('tabWarrantyAfterSale')}
        </a>
        <a
          role='tab'
          className={`tab text-sm md:text-base ${tab === 2 ? 'tab-active' : ''}`}
          onClick={() => setTab(2)}
        >
          {t('tabWarrantyExpired')}
        </a>
        <a
          role='tab'
          className={`tab text-sm md:text-base ${tab === 3 ? 'tab-active' : ''}`}
          onClick={() => setTab(3)}
        >
          {t('tabWarrantyAll')}
        </a>
      </div>
    ),
    [tab, t]
  )

  useEffect(() => {
    dispatch(setSearch(''))

    return () => {
      dispatch(setSearch(''))
    }
  }, [tab])

  useEffect(() => {
    fetchWarranty()
  }, [])

  const devicesArray = warrantyData.filter(
    items =>
      items.device.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
      items.device.location
        ?.toLowerCase()
        .includes(globalSearch.toLowerCase()) ||
      items.device.location?.toLowerCase().includes(globalSearch.toLowerCase())
  )

  const expiredArray = devicesArray.filter(items => {
    const today = new Date()
    const expiredDate = new Date(items.expire)
    const timeDifference = expiredDate.getTime() - today.getTime()
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
    return daysRemaining <= 0
  })

  const onwarrantyArray = devicesArray.filter(items => {
    const today = new Date()
    const expiredDate = new Date(items.expire)
    const timeDifference = expiredDate.getTime() - today.getTime()
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
    return daysRemaining >= 0
  })

  const columns: TableColumn<WarrantiesType>[] = [
    {
      name: t('noNumber'),
      cell: (_, index) => {
        return <div>{index + 1}</div>
      },
      sortable: false,
      center: true
    },
    {
      name: t('deviceNameTb'),
      selector: item => item.device.location ?? '- -',
      sortable: false,
      center: true
    },
    {
      name: t('deviceSerialTb'),
      selector: item => item.device.id,
      sortable: false,
      center: true
    },
    {
      name: t('deviceDate'),
      selector: item =>
        `${new Date(String(item.installDate)).toLocaleString('th-TH', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC'
        })}`,
      sortable: false,
      center: true
    },
    {
      name: t('deviceWarrantyTb'),
      cell: item => {
        const today = new Date()
        const expiredDate = new Date(item.expire)
        const timeDifference = expiredDate.getTime() - today.getTime()
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

        let remainingDays = daysRemaining
        let years = 0
        let months = 0

        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

        while (remainingDays >= 365) {
          if (isLeapYear(today.getFullYear() + years)) {
            if (remainingDays >= 366) {
              remainingDays -= 366
              years++
            } else {
              break
            }
          } else {
            remainingDays -= 365
            years++
          }
        }

        let currentMonth = today.getMonth()
        while (remainingDays >= daysInMonth[currentMonth]) {
          if (currentMonth === 1 && isLeapYear(today.getFullYear() + years)) {
            if (remainingDays >= 29) {
              remainingDays -= 29
              months++
            } else {
              break
            }
          } else {
            remainingDays -= daysInMonth[currentMonth]
            months++
          }
          currentMonth = (currentMonth + 1) % 12
        }

        return (
          <span>
            {daysRemaining > 0
              ? years > 0
                ? `${years} ${t('year')} ${months} ${t(
                    'month'
                  )} ${remainingDays} ${t('day')}`
                : months > 0
                ? `${months} ${t('month')} ${remainingDays} ${t('day')}`
                : `${remainingDays} ${t('day')}`
              : t('tabWarrantyExpired')}
          </span>
        )
      },
      sortable: false,
      center: true
    },
    {
      name: t('action'),
      cell: item => {
        return (
          <div className='flex items-center justify-center gap-3 p-3'>
            <button
              className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-primary'
              onClick={() => {
                // openEditModal(item)
              }}
            >
              <RiEditLine size={20} />
            </button>
            {role === 'SUPER' && (
              <button
                className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-red-500'
                onClick={() =>
                  swalWithBootstrapButtons
                    .fire({
                      title: t('deleteDeviceTitle'),
                      text: t('notReverseText'),
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonText: t('confirmButton'),
                      cancelButtonText: t('cancelButton'),
                      reverseButtons: false
                    })
                    .then(result => {
                      if (result.isConfirmed) {
                        // deleteDevices(item.id)
                      }
                    })
                }
              >
                <RiDeleteBin7Line size={20} />
              </button>
            )}
          </div>
        )
      },
      sortable: false,
      center: true
    }
  ]

  const DataTableComponent = ({ warrantyData }: dataTableProps) => {
    return (
      <div className='dataTableWrapper bg-base-100 rounded-btn p-3 mt-5 duration-300'>
        <DataTable
          responsive
          fixedHeader
          pagination
          paginationServer
          columns={columns}
          data={warrantyData}
          progressPending={isLoading}
          progressComponent={<Loading />}
          noDataComponent={<DataTableNoData />}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 150, 200]}
          fixedHeaderScrollHeight='calc(100dvh - 490px)'
        />
      </div>
    )
  }

  return (
    <div className='p-3 px-[16px]'>
      {manageMenu}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between mt-3'>
        <span className='text-[20px] font-medium'></span>
        <div className='flex flex-col lg:flex-row mt-3 lg:mt-0 lg:items-center items-end lg:gap-3'>
          <button
            className='btn btn-primary max-w-[150px]'
            // onClick={() => addModalRef.current?.showModal()}
          >
            {t('addWarrantyButton')}
          </button>
        </div>
      </div>
      {
        tab === 1 ?
        <DataTableComponent warrantyData={expiredArray} />
        :
        tab === 2 ?
        <DataTableComponent warrantyData={onwarrantyArray} />
        :
        <DataTableComponent warrantyData={devicesArray} />
      }
    </div>
  )
}

export default Warranty
