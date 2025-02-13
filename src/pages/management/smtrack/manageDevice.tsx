import { useTranslation } from 'react-i18next'
import HospitalAndWard from '../../../components/filter/hospitalAndWard'
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import Loading from '../../../components/skeleton/table/loading'
import DataTableNoData from '../../../components/skeleton/table/noData'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'
import { AxiosError } from 'axios'
import { DevicesType } from '../../../types/smtrack/devices/deviceType'
import axiosInstance from '../../../constants/axios/axiosInstance'
import {
  RiEditLine,
  RiFileCopyLine,
  RiShutDownLine,
  RiTimeLine
} from 'react-icons/ri'
import { setHosId, setSubmitLoading } from '../../../redux/actions/utilsActions'
import toast from 'react-hot-toast'
import { socket } from '../../../services/websocket'
import Swal from 'sweetalert2'
import { AddDeviceForm } from '../../../types/tms/devices/deviceType'
import { responseType } from '../../../types/smtrack/utilsRedux/utilsReduxType'
import { swalWithBootstrapButtons } from '../../../constants/utils/utilsConstants'

const ManageDevice = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { wardId, globalSearch, cookieDecode, tokenDecode } = useSelector(
    (state: RootState) => state.utils
  )
  const [devices, setDevices] = useState<DevicesType[]>([])
  const [devicesFiltered, setDevicesFiltered] = useState<DevicesType[]>([])
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const addModalRef = useRef<HTMLDialogElement>(null)
  const editModalRef = useRef<HTMLDialogElement>(null)
  const { token } = cookieDecode || {}
  const { role } = tokenDecode || {}
  const [formData, setFormData] = useState<AddDeviceForm>({
    id: '',
    name: ''
  })

  const fetchDevices = useCallback(
    async (page: number, size = perPage) => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(
          `/devices/device?${
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (formData.id !== '' && formData.name !== '') {
      const body = {
        id: formData.id,
        name: formData.name
      }
      try {
        await axiosInstance.post<responseType<DevicesType>>(
          '/devices/device',
          body
        )
        addModalRef.current?.close()
        resetForm()
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: t('submitSuccess'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        }).finally(async () => {
          await fetchDevices(1)
        })
      } catch (error) {
        addModalRef.current?.close()
        if (error instanceof AxiosError) {
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: 'error',
            showConfirmButton: false,
            timer: 2500
          }).finally(() => addModalRef.current?.showModal())
        } else {
          console.error(error)
        }
      } finally {
        dispatch(setSubmitLoading())
      }
    } else {
      addModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500
      }).finally(() => addModalRef.current?.showModal())
      dispatch(setSubmitLoading())
    }
  }

  const formatId = (value: string) => {
    value = value.replace(/[^a-zA-Z0-9]/g, '')

    const part1 = value.slice(0, 5)
    const part2 = value.slice(5, 7)
    const part3 = value.slice(7, 12)
    const part4 = value.slice(12, 16)
    const part5 = value.slice(16, 19)

    let formatted = ''
    if (part1) formatted += part1
    if (part2) formatted += `-${part2}`
    if (part3) formatted += `-${part3}`
    if (part4) formatted += `-${part4}`
    if (part5) formatted += `-${part5}`

    return formatted
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'id') {
      const formattedValue = formatId(value)
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const resetForm = () => {
    setFormData({
      id: '',
      name: ''
    })
  }

  const openEditModal = (device: DevicesType) => {
    dispatch(setHosId(device.hospital))
    setFormData({
      id: device.id,
      name: device.name
    })
    editModalRef.current?.showModal()
  }

  const deactiveDevices = async (id: string, status: boolean) => {
    dispatch(setSubmitLoading())
    try {
      const response = await axiosInstance.put<responseType<DevicesType>>(
        `/devices/device/${id}`,
        { status }
      )
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: response.data.message,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      fetchDevices(1)
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          title: t('alertHeaderError'),
          text: error.response?.data.message,
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        Swal.fire({
          title: t('alertHeaderError'),
          text: 'Uknown Error',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        })
      }
    } finally {
      dispatch(setSubmitLoading())
    }
  }

  useEffect(() => {
    if (!token) return
    fetchDevices(1)
  }, [token, wardId])

  useEffect(() => {
    const filter = devices?.filter(f => {
      const matchesSearch =
        f.id?.toLocaleLowerCase().includes(globalSearch.toLocaleLowerCase()) ||
        f.name?.toLocaleLowerCase().includes(globalSearch.toLocaleLowerCase())

      return matchesSearch
    })

    setDevicesFiltered(filter)
  }, [devices, globalSearch])

  const columns: TableColumn<DevicesType>[] = [
    {
      name: t('deviceSerialTb'),
      cell: item => (
        <div
          className='flex items-center gap-1 cursor-pointer hover:opacity-50 duration-300'
          onClick={() => {
            try {
              navigator.clipboard.writeText(item.id)
              toast.success(t('copyToClip'))
            } catch (error) {
              console.error('Failed to copy: ', error)
              toast.error(t('copyToClipFaile'))
            }
          }}
        >
          <span>{item.id}</span>
          <RiFileCopyLine size={18} className='text-base-content/70' />
        </div>
      ),
      sortable: false,
      center: true,
      width: '225px'
    },
    {
      name: t('deviceNameBox'),
      cell: item => (
        <span className='truncate max-w-[80px]'>
          {item.name ? item.name : '—'}
        </span>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('deviceLocationTb'),
      cell: item => (item.location ? item.location : '—'),
      sortable: false,
      center: true
    },
    {
      name: t('hospitals'),
      cell: item => (item.hospital ? item.hospital : '—'),
      sortable: false,
      center: true
    },
    {
      name: t('ward'),
      cell: item => (item.ward ? item.ward : '—'),
      sortable: false,
      center: true
    },
    {
      name: t('firmWareVer'),
      selector: item => (item.firmware ? item.firmware : '—'),
      sortable: false,
      center: true
    },
    {
      name: t('status'),
      cell: item => {
        if (!item.status) {
          return (
            <span className='badge border-red-500 badge-outline text-red-500 truncate max-w-[80px]'>
              {t('userInactive')}
            </span>
          )
        } else {
          return (
            <span className='badge badge-primary badge-outline text-primary max-w-[80px]'>
              {t('userActive')}
            </span>
          )
        }
      },
      sortable: false,
      center: true
    },
    {
      name: t('action'),
      cell: item => (
        <div className='flex items-center justify-center gap-3 p-3'>
          {role === 'SUPER' &&
            (item.status ? (
              <button
                data-tip={t('deviceInactive')}
                className='btn btn-ghost tooltip tooltip-left flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-red-500'
                onClick={() =>
                  swalWithBootstrapButtons
                    .fire({
                      title: t('deactivateDevice'),
                      text: t('deactivateDeviceText'),
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonText: t('confirmButton'),
                      cancelButtonText: t('cancelButton'),
                      reverseButtons: false
                    })
                    .then(result => {
                      if (result.isConfirmed) {
                        deactiveDevices(item.id, false)
                      }
                    })
                }
              >
                <RiShutDownLine size={20} />
              </button>
            ) : (
              <button
                data-tip={t('deviceActive')}
                className='btn btn-primary tooltip tooltip-left flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0'
                onClick={() =>
                  swalWithBootstrapButtons
                    .fire({
                      title: t('deactivateDevice'),
                      text: t('deactivateDeviceText'),
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonText: t('confirmButton'),
                      cancelButtonText: t('cancelButton'),
                      reverseButtons: false
                    })
                    .then(result => {
                      if (result.isConfirmed) {
                        deactiveDevices(item.id, true)
                      }
                    })
                }
              >
                <RiShutDownLine size={20} />
              </button>
            ))}
          <button
            className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-primary'
            onClick={() => openEditModal(item)}
          >
            <RiEditLine size={20} />
          </button>
        </div>
      ),
      sortable: false,
      center: true
    }
  ]

  return (
    <div>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between mt-3'>
        <span className='text-[20px] font-medium'></span>
        <div className='flex flex-col lg:flex-row mt-3 lg:mt-0 lg:items-center items-end gap-4'>
          <HospitalAndWard />
          <button
            className='btn btn-primary max-w-[130px]'
            onClick={() => addModalRef.current?.showModal()}
          >
            {t('addDeviceButton')}
          </button>
          <div className='divider divider-horizontal mx-0 py-1'></div>
          <button
            className='btn flex btn-primary p-0 w-[48px] h-[48px] min-w-[48px] min-h-[48px] tooltip tooltip-left'
            data-tip={'Sync Device Time'}
            onClick={() => {
              try {
                socket.emit('send_schedule', 'time', (val: any) => {
                  if (val === 'OK')
                    Swal.fire({
                      title: t('alertHeaderSuccess'),
                      text: t('adjustTime'),
                      icon: 'success',
                      timer: 2000,
                      showConfirmButton: false
                    })
                })
              } catch (error) {
                Swal.fire({
                  title: t('alertHeaderError'),
                  text: t('descriptionErrorWrong'),
                  icon: 'success',
                  timer: 2000,
                  showConfirmButton: false
                })
              }
            }}
          >
            <RiTimeLine size={24} />
          </button>
        </div>
      </div>

      <div className='dataTableWrapper bg-base-100 rounded-btn p-3 mt-5 duration-300'>
        <DataTable
          responsive
          fixedHeader
          pagination
          paginationServer
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

      <dialog ref={addModalRef} className='modal'>
        <form
          onSubmit={handleSubmit}
          className='modal-box w-5/6 max-w-2xl md:overflow-y-visible'
        >
          <h3 className='font-bold text-lg'>{t('addDeviceButton')}</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full'>
            {/* Right Column - 2/3 of the grid (70%) */}
            <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
              {/* sn */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start'>
                  <span className='label-text mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('deviceSerialTb')}
                  </span>
                  <input
                    name='id'
                    type='text'
                    value={formData.id}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={23}
                  />
                </label>
              </div>

              {/* name */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start'>
                  <span className='label-text mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('deviceNameTb')}
                  </span>
                  <input
                    name='name'
                    type='text'
                    value={formData.name}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={80}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className='modal-action mt-6'>
            <button
              type='button'
              className='btn'
              onClick={() => {
                addModalRef.current?.close()
                resetForm()
              }}
            >
              {t('cancelButton')}
            </button>
            <button type='submit' className='btn btn-primary'>
              {t('submitButton')}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  )
}

export default ManageDevice
