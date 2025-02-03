import { useTranslation } from 'react-i18next'
import {
  ChangeEvent,
  FormEvent,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { AxiosError } from 'axios'
import axiosInstance from '../../constants/axios/axiosInstance'
import {
  HospitalsType,
  WardType
} from '../../types/global/hospitals/hospitalType'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import DataTable, { TableColumn } from 'react-data-table-component'
import DataTableNoData from '../../components/skeleton/table/noData'
import { RiDeleteBin7Line, RiEditLine } from 'react-icons/ri'
import { resizeImage } from '../../constants/utils/image'
import { FormAddHospitalState } from '../../types/smtrack/users/usersType'
import defaultPic from '../../assets/images/default-pic.png'
import Swal from 'sweetalert2'
import { setSubmitLoading } from '../../redux/actions/utilsActions'
import { GlobalContextType } from '../../types/global/globalContext'
import { GlobalContext } from '../../contexts/globalContext'

const ManageHospital = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { fetchHospital, setWard } = useContext(
    GlobalContext
  ) as GlobalContextType
  const { globalSearch } = useSelector((state: RootState) => state.utils)
  const [hospitalData, setHospitalData] = useState<HospitalsType[]>([])
  const [filterHospital, setFilterHospital] = useState<HospitalsType[]>([])
  const [imageProcessing, setImageProcessing] = useState(false)
  const [hospitalForm, setHospitalForm] = useState<FormAddHospitalState>({
    hosAddress: '',
    hosLatitude: '',
    hosLongitude: '',
    hosName: '',
    hosPic: null,
    hosTel: '',
    userContact: '',
    userTel: '',
    imagePreview: null
  })

  const addHosModalRef = useRef<HTMLDialogElement>(null)
  const editHosModalRef = useRef<HTMLDialogElement>(null)
  const addWardModalRef = useRef<HTMLDialogElement>(null)
  const editWardModalRef = useRef<HTMLDialogElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchHospitals = useCallback(async () => {
    try {
      const response = await axiosInstance.get<responseType<HospitalsType[]>>(
        '/auth/hospital'
      )
      setHospitalData(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    }
  }, [])

  const resetForm = () => {
    setHospitalForm({
      hosAddress: '',
      hosLatitude: '',
      hosLongitude: '',
      hosName: '',
      hosPic: null,
      hosTel: '',
      userContact: '',
      userTel: '',
      imagePreview: null
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmitHospital = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (
      hospitalForm.hosName !== '' &&
      hospitalForm.hosAddress !== '' &&
      hospitalForm.hosTel !== '' &&
      hospitalForm.userTel !== ''
    ) {
      try {
        const formDataObj = createFormData()
        await axiosInstance.post<responseType<FormAddHospitalState>>(
          '/auth/hospital',
          formDataObj,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        )

        addHosModalRef.current?.close()
        resetForm()
        await fetchHospitals()
        await fetchHospital()
        Swal.fire({
          title: t('alertHeaderError'),
          text: t('submitSuccess'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        })
      } catch (error) {
        addHosModalRef.current?.close()
        if (error instanceof AxiosError) {
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: 'error',
            showConfirmButton: false,
            timer: 2500
          }).finally(() => addHosModalRef.current?.showModal())
        } else {
          console.error(error)
        }
      } finally {
        dispatch(setSubmitLoading())
      }
    } else {
      addHosModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500
      }).finally(() => addHosModalRef.current?.showModal())
      dispatch(setSubmitLoading())
    }
  }

  const handleSubmitWard = async (e: FormEvent) => {
    e.preventDefault()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageProcessing(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      const reSized = await resizeImage(file)
      setHospitalForm(prev => ({
        ...prev,
        hosPic: reSized,
        imagePreview: URL.createObjectURL(file)
      }))
      setImageProcessing(false)
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setHospitalForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const createFormData = () => {
    const formDataObj = new FormData()

    const keyMapping: Record<string, string> = {
      hosPic: 'image'
    }

    Object.entries(hospitalForm).forEach(([key, value]) => {
      if (value === null || value === undefined || key === 'imagePreview')
        return

      const mappedKey = keyMapping[key as keyof typeof keyMapping] || key

      if (value instanceof File) {
        formDataObj.append(mappedKey, value)
      } else {
        formDataObj.append(mappedKey, value as string)
      }
    })

    return formDataObj
  }

  useEffect(() => {
    fetchHospitals()
  }, [])

  useEffect(() => {
    const filter = hospitalData?.filter(
      item =>
        item.hosName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        item.hosTel?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        item.userTel?.toLowerCase().includes(globalSearch.toLowerCase())
    )
    setFilterHospital(filter)
  }, [hospitalData, globalSearch])

  const columns: TableColumn<HospitalsType>[] = [
    {
      name: t('noNumber'),
      cell: (_, index) => {
        return <div>{index + 1}</div>
      },
      sortable: false,
      center: true
    },
    {
      name: t('hosPicture'),
      cell: item => (
        <div className='avatar'>
          <div className='w-11 rounded'>
            <img src={item.hosPic ? item.hosPic : defaultPic} alt='hos-logo' />
          </div>
        </div>
      ),
      center: true,
      sortable: false
    },
    {
      name: t('hosName'),
      cell: item => item.hosName,
      center: true,
      sortable: false
    },
    {
      name: t('hosAddress'),
      cell: item => item.hosAddress ?? '—',
      center: true,
      sortable: false
    },
    {
      name: t('hosTel'),
      cell: item => item.hosTel ?? '—',
      center: true,
      sortable: false
    },
    {
      name: t('action'),
      cell: (item, index) => (
        <div className='flex items-center justify-center gap-3 p-3'>
          <button className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-red-500'>
            <RiDeleteBin7Line size={20} />
          </button>
          <button className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-primary'>
            <RiEditLine size={20} />
          </button>
        </div>
      ),
      center: true,
      sortable: false
    }
  ]

  const subWardColumns: TableColumn<WardType>[] = [
    {
      name: t('noNumber'),
      cell: (_, index) => {
        return <div>{index + 1}</div>
      },
      sortable: false,
      center: true
    },
    {
      name: t('wardName'),
      cell: item => item.wardName,
      center: true,
      sortable: false
    },
    {
      name: t('action'),
      cell: (item, index) => (
        <div className='flex items-center justify-center gap-3 p-3'>
          <button className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-red-500'>
            <RiDeleteBin7Line size={20} />
          </button>
          <button className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-primary'>
            <RiEditLine size={20} />
          </button>
        </div>
      ),
      center: true,
      sortable: false
    }
  ]

  const ExpandedComponent = memo(({ data }: { data: HospitalsType }) => (
    <div className='dataTableSubWrapper duration-300'>
      <DataTable
        columns={subWardColumns}
        data={data.ward}
        noDataComponent={<DataTableNoData />}
        responsive
      />
    </div>
  ))

  return (
    <div>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between mt-3'>
        <span></span>
        <div className='flex flex-col lg:flex-row mt-3 lg:mt-0 lg:items-center items-end gap-3'>
          <button
            className='btn btn-primary'
            onClick={() => addHosModalRef.current?.showModal()}
          >
            {t('addHos')}
          </button>
          <button className='btn btn-primary'>{t('addWard')}</button>
        </div>
      </div>
      <div className='dataTableWrapper bg-base-100 rounded-btn p-3 mt-5 duration-300'>
        <DataTable
          columns={columns}
          data={filterHospital}
          expandableRows
          expandOnRowClicked
          expandableRowsComponent={ExpandedComponent}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 40, 60, 80, 100]}
          noDataComponent={<DataTableNoData />}
          pagination
          responsive
          fixedHeader
          fixedHeaderScrollHeight='calc(100dvh - 350px)'
        />
      </div>

      <dialog ref={addHosModalRef} className='modal'>
        <form
          onSubmit={handleSubmitHospital}
          className='modal-box w-11/12 max-w-5xl md:overflow-y-visible'
        >
          <h3 className='font-bold text-lg'>{t('addHos')}</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full'>
            <div className='col-span-1 flex justify-center'>
              <div className='form-control'>
                <label className='label cursor-pointer image-hover flex flex-col justify-center'>
                  <span className='label-text'>{t('hosPicture')}</span>
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
                        src={hospitalForm.imagePreview || defaultPic}
                        alt='Preview'
                        className={`w-32 h-32 md:w-48 md:h-48 rounded-btn object-cover border-2 border-dashed border-base-300 ${
                          hospitalForm.imagePreview || defaultPic
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

            {/* Right Column - 2/3 of the grid (70%) */}
            <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
              {/* Hospital name */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start'>
                  <span className='label-text mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('hosName')}
                  </span>
                  <input
                    name='hosName'
                    type='text'
                    value={hospitalForm.hosName}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                  />
                </label>
              </div>

              {/* Address */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start'>
                  <span className='label-text mb-2'>{t('hosAddress')}</span>
                  <input
                    name='hosAddress'
                    type='text'
                    value={hospitalForm.hosAddress}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                  />
                </label>
              </div>

              {/* tel */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start'>
                  <span className='label-text mb-2'>{t('hosTel')}</span>
                  <input
                    name='hosTel'
                    type='tel'
                    value={hospitalForm.hosTel}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                  />
                </label>
              </div>

              {/* hosLatitude */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start'>
                  <span className='label-text mb-2'>{t('hosLatitude')}</span>
                  <input
                    name='hosLatitude'
                    type='text'
                    value={hospitalForm.hosLatitude}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                  />
                </label>
              </div>

              {/* hosLongitude */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start'>
                  <span className='label-text mb-2'>{t('hosLongitude')}</span>
                  <input
                    name='hosLongitude'
                    type='text'
                    value={hospitalForm.hosLongitude}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                  />
                </label>
              </div>

              {/* userContact */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start'>
                  <span className='label-text mb-2'>{t('userContact')}</span>
                  <input
                    name='userContact'
                    type='text'
                    value={hospitalForm.userContact}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                  />
                </label>
              </div>

              {/* userTel */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start'>
                  <span className='label-text mb-2'>{t('userTel')}</span>
                  <input
                    name='userTel'
                    type='tel'
                    value={hospitalForm.userTel}
                    onChange={handleChange}
                    className='input input-bordered w-full'
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
                addHosModalRef.current?.close()
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

export default ManageHospital
