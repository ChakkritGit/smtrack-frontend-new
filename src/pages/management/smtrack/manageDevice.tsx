import { useTranslation } from 'react-i18next'
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'
import { AxiosError } from 'axios'
import { DevicesType } from '../../../types/smtrack/devices/deviceType'
import axiosInstance from '../../../constants/axios/axiosInstance'
import {
  RiDeleteBin7Line,
  RiEditLine,
  RiFileCopyLine,
  RiShutDownLine,
  RiTimeLine
} from 'react-icons/ri'
import { setHosId, setSubmitLoading } from '../../../redux/actions/utilsActions'
import toast from 'react-hot-toast'
import { socket } from '../../../services/websocket'
import { AddDeviceForm } from '../../../types/tms/devices/deviceType'
import { responseType } from '../../../types/smtrack/utilsRedux/utilsReduxType'
import { swalWithBootstrapButtons } from '../../../constants/utils/utilsConstants'
import { resizeImage } from '../../../constants/utils/image'
import Swal from 'sweetalert2'
import defaultPic from '../../../assets/images/default-pic.png'
import WardSelectDevice from '../../../components/selects/wardSelectDevice'
import HopitalSelect from '../../../components/selects/hopitalSelect'
import HospitalAndWard from '../../../components/filter/hospitalAndWard'
import Loading from '../../../components/skeleton/table/loading'
import DataTableNoData from '../../../components/skeleton/table/noData'

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
  const [imageProcessing, setImageProcessing] = useState(false)
  const addModalRef = useRef<HTMLDialogElement>(null)
  const editModalRef = useRef<HTMLDialogElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { token } = cookieDecode || {}
  const { role } = tokenDecode || {}
  const [formData, setFormData] = useState<AddDeviceForm>({
    id: '',
    name: '',
    hospital: '',
    ward: '',
    location: '',
    position: '',
    remark: '',
    tag: '',
    image: null,
    imagePreview: null
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

  const createFormData = () => {
    const formDataObj = new FormData()

    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === undefined || key === 'imagePreview')
        return

      if (value instanceof File) {
        formDataObj.append(key, value)
      } else {
        if (key === 'remark' || key === 'tag') {
          formDataObj.append(key, value as string)
        } else {
          formDataObj.append(key, value as string)
        }
      }
    })

    return formDataObj
  }

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())
    if (formData.name && formData.location && formData.position) {
      try {
        const formDataObj = createFormData()
        formDataObj.delete('id')
        await axiosInstance.put<responseType<DevicesType>>(
          `/devices/device/${formData.id}`,
          formDataObj,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        )
        editModalRef.current?.close()
        resetForm()
        await fetchDevices(1)
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: t('submitSuccess'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        })
      } catch (error) {
        editModalRef.current?.close()
        if (error instanceof AxiosError) {
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: 'error',
            showConfirmButton: false,
            timer: 2500
          }).finally(() => editModalRef.current?.showModal())
        } else {
          console.error(error)
        }
      } finally {
        dispatch(setSubmitLoading())
      }
    } else {
      editModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500
      }).finally(() => editModalRef.current?.showModal())
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageProcessing(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      const reSized = await resizeImage(file)
      setFormData(prev => ({
        ...prev,
        imageFile: reSized,
        imagePreview: URL.createObjectURL(file)
      }))
      setImageProcessing(false)
    }
  }

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      hospital: '',
      ward: '',
      location: '',
      position: '',
      image: null,
      remark: '',
      tag: ''
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const openEditModal = (device: DevicesType) => {
    dispatch(setHosId(device.hospital))
    setFormData({
      id: device.id,
      name: device.name,
      hospital: device.hospital,
      ward: device.ward,
      location: device.location,
      position: device.position,
      remark: device.remark,
      tag: device.tag,
      image: null,
      imagePreview: device.positionPic || null
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
      await fetchDevices(1)
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: response.data.message,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
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

  const deleteDevices = async (id: string) => {
    dispatch(setSubmitLoading())
    try {
      const response = await axiosInstance.delete<responseType<DevicesType>>(
        `/devices/device/${id}`
      )
      await fetchDevices(1)
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: response.data.message,
        icon: 'success',
        showConfirmButton: false,
        timer: 2500
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          title: t('alertHeaderError'),
          text: error.response?.data.message,
          icon: 'error',
          showConfirmButton: false,
          timer: 2500
        })
      } else {
        console.error(error)
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
            <span className='badge bg-red-500 border-none px-2 badge-outline text-white'>
              {t('userInactive')}
            </span>
          )
        } else {
          return (
            <span className='badge bg-green-500 border-none px-2 badge-outline text-white'>
              {t('userActive')}
            </span>
          )
        }
      },
      sortable: false,
      center: true,
      width: '130px'
    },
    {
      name: t('token'),
      cell: item => (
        <div
          className='flex items-center gap-1 cursor-pointer hover:opacity-50 duration-300'
          onClick={() => {
            try {
              navigator.clipboard.writeText(item.token)
              toast.success(t('copyToClip'))
            } catch (error) {
              console.error('Failed to copy: ', error)
              toast.error(t('copyToClipFaile'))
            }
          }}
        >
          <span className='truncate max-w-[80px]'>{item.token}</span>
          <RiFileCopyLine size={18} className='text-base-content/70' />
        </div>
      ),
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
                      deleteDevices(item.id)
                    }
                  })
              }
            >
              <RiDeleteBin7Line size={20} />
            </button>
          )}
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
        <div className='flex flex-col lg:flex-row mt-3 lg:mt-0 lg:items-center items-end lg:gap-3'>
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
          fixedHeaderScrollHeight='calc(100dvh - 400px)'
        />
      </div>

      <dialog ref={addModalRef} className='modal overflow-y-scroll py-10'>
        <form
          onSubmit={handleSubmit}
          className='modal-box w-5/6 max-w-2xl h-max max-h-max'
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

      {/* Edit User Modal */}
      <dialog ref={editModalRef} className='modal overflow-y-scroll py-10'>
        <form
          onSubmit={handleUpdate}
          className='modal-box w-11/12 max-w-5xl h-max max-h-max'
        >
          <h3 className='font-bold text-lg'>{t('editDeviceButton')}</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full'>
            {/* Image Upload - Left Column (30%) */}
            <div className='col-span-1 flex justify-center'>
              <div className='form-control'>
                <label className='label cursor-pointer image-hover flex flex-col justify-center'>
                  <span className='label-text'>{t('userPicture')}</span>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                  />
                  {imageProcessing ? (
                    <div className='mt-4 flex justify-center w-32 h-32 md:w-48 md:h-48'>
                      <span className='loading loading-ring loading-md'></span>
                    </div>
                  ) : (
                    <div className='mt-4 relative'>
                      <img
                        src={formData.imagePreview || defaultPic}
                        alt='Preview'
                        className={`w-32 h-32 md:w-48 md:h-48 rounded-btn object-cover border-2 border-dashed border-base-300 ${
                          formData.imagePreview || defaultPic
                            ? 'border-none'
                            : ''
                        }`}
                      />
                      <div className='absolute edit-icon bottom-1 right-1 bg-base-100/50 backdrop-blur rounded-full p-2 shadow-sm'>
                        <RiEditLine size={20} />
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Right Column - Form Fields (70%) */}
            <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
              {/* Hospital */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start'>
                  <span className='label-text mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('hospitalsName')}
                  </span>
                  <HopitalSelect />
                </label>
              </div>

              {/* Ward */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start'>
                  <span className='label-text mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('ward')}
                  </span>
                  <WardSelectDevice
                    formData={formData}
                    setFormData={setFormData}
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
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={50}
                  />
                </label>
              </div>

              {/* location */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start'>
                  <span className='label-text mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('deviceLocationTb')}
                  </span>
                  <input
                    type='text'
                    name='location'
                    value={formData.location}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={80}
                  />
                </label>
              </div>

              {/* position */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start'>
                  <span className='label-text mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('deviceLocationDeviceTb')}
                  </span>
                  <input
                    type='text'
                    name='position'
                    value={formData.position}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={80}
                  />
                </label>
              </div>

              {/* remark */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start'>
                  <span className='label-text mb-2'>{t('remmark')}</span>
                  <input
                    type='text'
                    name='remark'
                    value={formData.remark}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={80}
                  />
                </label>
              </div>

              {/* tag */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start'>
                  <span className='label-text mb-2'>{t('tag')}</span>
                  <input
                    type='text'
                    name='tag'
                    value={formData.tag}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={80}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className='modal-action mt-4 md:mt-6'>
            <button
              type='button'
              className='btn'
              onClick={() => {
                editModalRef.current?.close()
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
