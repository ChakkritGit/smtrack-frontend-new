import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import axiosInstance from '../../../constants/axios/axiosInstance'
import { responseType } from '../../../types/smtrack/utilsRedux/utilsReduxType'
import { FirmwareListType } from '../../../types/smtrack/devices/deviceType'
import { AxiosError } from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import {
  setSubmitLoading,
  setTokenExpire
} from '../../../redux/actions/utilsActions'
import FirmwarePagination from '../../../components/pagination/firmwarePagination'
import { RootState } from '../../../redux/reducers/rootReducer'
import FirmwareIcon from '../../../assets/images/bin-icon.png'
import {
  RiCloseCircleLine,
  RiCloseLargeLine,
  RiDeleteBin7Line,
  RiDragDropLine,
  RiFileCheckLine,
  RiMore2Line
} from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import { FileUploader } from 'react-drag-drop-files'
import { filesize } from 'filesize'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import Swal from 'sweetalert2'

type selectFirmwareOption = {
  fileName: string
  filePath: string
  fileSize: string
  createDate: string
}

const ManageFirmware = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { globalSearch } = useSelector((state: RootState) => state.utils)
  const [firmwareList, setFirmwareList] = useState<FirmwareListType[]>([])
  const [firmwareListFilter, setFirmwareListFilter] = useState<
    FirmwareListType[]
  >([])
  const [file, setFile] = useState<File | undefined>(undefined)
  const [dragChang, setDragChang] = useState<boolean>(false)
  const [submit, setSubmit] = useState(false)
  const [error, setError] = useState(false)
  const [progress, setProgress] = useState(0)
  const uploadModalRef = useRef<HTMLDialogElement>(null)
  const fileTypes = ['BIN']

  const fetchFirmware = useCallback(async () => {
    try {
      const response = await axiosInstance.get<
        responseType<FirmwareListType[]>
      >('https://drive.siamatic.co.th/api/drive')

      const versionCompare = (
        a: selectFirmwareOption,
        b: selectFirmwareOption
      ) => {
        const versionA = a.fileName.match(/(\d+)\.(\d+)\.(\d+)/)
        const versionB = b.fileName.match(/(\d+)\.(\d+)\.(\d+)/)

        if (a.fileName.startsWith('i-TeM') && !b.fileName.startsWith('i-TeM'))
          return 1
        if (b.fileName.startsWith('i-TeM') && !a.fileName.startsWith('i-TeM'))
          return -1

        if (versionA && versionB) {
          const majorA = parseInt(versionA[1], 10)
          const minorA = parseInt(versionA[2], 10)
          const patchA = parseInt(versionA[3], 10)

          const majorB = parseInt(versionB[1], 10)
          const minorB = parseInt(versionB[2], 10)
          const patchB = parseInt(versionB[3], 10)

          return majorA - majorB || minorA - minorB || patchA - patchB
        }
        return 0
      }

      const combinedList = response.data.data
        .filter(
          filter =>
            !filter.fileName.startsWith('bootloader') &&
            !filter.fileName.startsWith('partition')
        )
        .sort(versionCompare)

      setFirmwareList(combinedList)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        console.error(error.message)
      } else {
        console.error(error)
      }
    }
  }, [])

  const handleChange = (files: File) => {
    if (files) {
      setFile(undefined)
      setSubmit(false)
      setError(false)
      setFile(files)
    }
  }

  const handleDrag = (dragging: boolean) => {
    setDragChang(dragging)
    if (dragging) {
      setFile(undefined)
      setSubmit(false)
      setError(false)
    }
  }

  const handleError = (_error: string) => {
    Swal.fire({
      title: t('alertHeaderError'),
      text: t('uploadLabelNotSupport'),
      icon: 'error',
      timer: 2000,
      showConfirmButton: false
    })
  }

  const closeModal = () => {
    setFile(undefined)
    setSubmit(false)
    setError(false)
    setProgress(0)
    uploadModalRef.current?.close()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (file) {
      const formData = new FormData()
      formData.append('file', file as Blob)
      try {
        setSubmit(true)
        const response = await axiosInstance.post<responseType<string>>(
          `https://drive.siamatic.co.th/api/drive`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: progressEvent => {
              const { progress } = progressEvent
              setProgress(Number(progress) * 100)
            }
          }
        )
        closeModal()
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setTokenExpire(true))
          } else {
            uploadModalRef.current?.close()
            Swal.fire({
              title: t('alertHeaderError'),
              text: error.response?.data.message,
              icon: 'error',
              timer: 2000,
              showConfirmButton: false
            }).finally(() => uploadModalRef.current?.showModal())
          }
          setError(true)
        } else {
          uploadModalRef.current?.close()
          Swal.fire({
            title: t('alertHeaderError'),
            text: 'Uknown Error',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
          }).finally(() => uploadModalRef.current?.showModal())
          setError(true)
        }
      } finally {
        fetchFirmware()
      }
    } else {
      uploadModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('selectedFile'),
        icon: 'warning',
        timer: 2000,
        showConfirmButton: false
      }).finally(() => uploadModalRef.current?.showModal())
    }
  }

  const deleteFirmware = async (fileName: string) => {
    const result = await Swal.fire({
      title: t('deleteFirmware'),
      text: t('deleteFirmwareText'),
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: t('cancelButton'),
      confirmButtonText: t('confirmButton'),
      customClass: {
        actions: 'custom-action',
        confirmButton: 'custom-confirmButton',
        cancelButton: 'custom-cancelButton'
      }
    })

    if (result.isConfirmed) {
      dispatch(setSubmitLoading())

      try {
        const response = await axiosInstance.delete<
          responseType<FirmwareListType>
        >(`https://drive.siamatic.co.th/api/drive/${fileName}`)
        await fetchFirmware()
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        })
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setTokenExpire(true))
          }
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: 'error',
            showConfirmButton: false,
            timer: 2500
          })
        }
        console.error(error)
      } finally {
        dispatch(setSubmitLoading())
      }
    }
  }

  useEffect(() => {
    fetchFirmware()
  }, [])

  useEffect(() => {
    const filter = firmwareList.filter(
      f =>
        f.fileName?.toLowerCase()?.includes(globalSearch?.toLowerCase()) ||
        f.createDate?.toLowerCase()?.includes(globalSearch?.toLowerCase())
    )
    setFirmwareListFilter(filter)
  }, [firmwareList, globalSearch])

  const firmwareComponent = useMemo(
    () => (
      <FirmwarePagination
        data={firmwareListFilter}
        initialPerPage={10}
        itemPerPage={[10, 30, 50, 100]}
        renderItem={(item, index) => (
          <div
            key={index}
            className='p-3 bg-base-100 w-full h-[120px] rounded-btn flex items-center justify-between gap-4'
          >
            <div className='flex items-center gap-4 ml-3'>
              <div className='avatar'>
                <div className='w-10 rounded'>
                  <img src={FirmwareIcon} alt='Icon' />
                </div>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='text-base font-medium'>{item.fileName}</span>
                <span className='text-sm'>{item.fileSize}</span>
                <div className='flex items-center gap-2'>
                  <span className='text-sm'>
                    {new Date(item.createDate).toLocaleString('th-TH', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      timeZone: 'UTC'
                    })}
                  </span>
                  <span className='text-sm'>
                    {new Date(item.createDate).toLocaleString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZone: 'UTC'
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className='h-full'>
              <div className='dropdown dropdown-end'>
                <div
                  tabIndex={0}
                  role='button'
                  data-tip={t('menuButton')}
                  className='btn btn-ghost flex p-0 max-w-[30px] min-w-[30px] max-h-[30px] min-h-[30px] tooltip tooltip-left'
                >
                  <RiMore2Line size={20} />
                </div>
                <ul
                  tabIndex={0}
                  className='dropdown-content menu bg-base-100 rounded-box z-[1] w-36 p-2 shadow'
                >
                  <li onClick={() => deleteFirmware(item.fileName)}>
                    <div className='flex items-center gap-3 text-[16px] text-red-500 hover:bg-red-500 hover:text-white'>
                      <RiDeleteBin7Line size={20} />
                      <a>{t('deleteButton')}</a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      />
    ),
    [firmwareListFilter]
  )

  const uploadJSXStyle = useMemo(() => {
    return (
      <div
        className={`flex items-center justify-center h-[25rem] border-2 border-dashed rounded-btn ${
          error
            ? 'border-error bg-error/15'
            : file
            ? 'border-primary bg-primary/15'
            : 'border-base-content/50'
        }`}
      >
        {file ? (
          <div>
            <div className='flex items-center justify-center'>
              {submit ? (
                error ? (
                  <RiCloseCircleLine size={84} className='text-error' />
                ) : (
                  <CircularProgressbar
                    value={progress}
                    text={`${progress.toFixed()}%`}
                    className='w-[13rem] h-[13rem]'
                    strokeWidth={6}
                    styles={buildStyles({
                      strokeLinecap: 'round',
                      textSize: '18px',
                      pathTransition: 'stroke-dashoffset 0.5s ease 0s',
                      pathTransitionDuration: 0.5,
                      pathColor: `var(--fallback-p,oklch(var(--p)/var(--tw-bg-opacity, 1)))`,
                      textColor:
                        'var(--fallback-p,oklch(var(--p)/var(--tw-text-opacity, 1)))',
                      trailColor: 'var(--fallback-p,oklch(var(--p)/0.15))',
                      backgroundColor:
                        'var(--fallback-p,oklch(var(--p)/var(--tw-bg-opacity, 1)))'
                    })}
                  />
                )
              ) : (
                <RiFileCheckLine size={84} className='text-primary' />
              )}
            </div>
            <div className='flex flex-col items-center justify-center gap-1 mt-3'>
              <span
                className={`text-base font-medium ${
                  error
                    ? 'text-error'
                    : file
                    ? 'text-primary'
                    : 'text-base-content/50'
                }`}
              >
                {file?.name}
              </span>
              <span
                className={`text-sm ${
                  error
                    ? 'text-error'
                    : file
                    ? 'text-primary'
                    : 'text-base-content/50'
                }`}
              >
                {filesize(file?.size, { standard: 'jedec' })}
              </span>
            </div>
          </div>
        ) : !dragChang ? (
          <div className='flex flex-col items-center justify-center gap-4'>
            <RiDragDropLine
              size={84}
              className={`${
                error
                  ? 'text-error'
                  : file
                  ? 'text-primary'
                  : 'text-base-content/50'
              }
              `}
            />
            <span
              className={`text-lg font-medium ${
                error
                  ? 'text-error'
                  : file
                  ? 'text-primary'
                  : 'text-base-content/70'
              }
              `}
            >
              {t('uploadLabel')}
            </span>
          </div>
        ) : null}
      </div>
    )
  }, [file, error, submit, progress, dragChang])

  const uploadModalComponent = useMemo(
    () => (
      <dialog ref={uploadModalRef} className='modal overflow-y-scroll py-10'>
        <div className='modal-box md:w-[40rem] max-w-3xl h-max max-h-max'>
          <div className='flex items-center justify-between gap-2'>
            <h3 className='font-bold text-lg'>{t('uploadButton')}</h3>
            <button
              type='button'
              className='btn btn-ghost outline-none flex p-0 min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] duration-300'
              onClick={closeModal}
            >
              <RiCloseLargeLine size={20} />
            </button>
          </div>
          <div className='my-3'>
            <FileUploader
              handleChange={handleChange}
              onTypeError={handleError}
              name={file?.name}
              types={fileTypes}
              label={t('uploadLabel')}
              children={uploadJSXStyle}
              dropMessageStyle={{
                backgroundColor: 'oklch(0% 0 0 / 30%)',
                color: 'white'
              }}
              onDraggingStateChange={handleDrag}
            />
          </div>
          <div className='modal-action'>
            <form onSubmit={handleSubmit}>
              <button className='btn btn-primary'>{t('uploadButton')}</button>
            </form>
          </div>
        </div>
      </dialog>
    ),
    [uploadModalRef, file, error, submit, progress]
  )

  return (
    <div>
      <div className='flex items-center justify-end gap-3'>
        <button className='btn btn-primary'>{t('selectToUpdateButton')}</button>
        <button
          className='btn btn-primary'
          onClick={() => uploadModalRef.current?.showModal()}
        >
          {t('uploadButton')}
        </button>
      </div>
      {firmwareComponent}
      {uploadModalComponent}
    </div>
  )
}

export default ManageFirmware
