import { useTranslation } from 'react-i18next'
import HospitalAndWard from '../../components/filter/hospitalAndWard'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  ChangeEvent
} from 'react'
import { AxiosError } from 'axios'
import { UsersType } from '../../types/smtrack/users/usersType'
import axiosInstance from '../../constants/axios/axiosInstance'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { RiDeleteBin7Line, RiEditLine, RiMore2Line } from 'react-icons/ri'
import defaultPic from '../../assets/images/default-user.jpg'
import { RootState } from '../../redux/reducers/rootReducer'
import { useDispatch, useSelector } from 'react-redux'
import { getRoleLabel } from '../../constants/utils/utilsConstants'
import UserPagination from '../../components/pagination/userPagination'
import { setSubmitLoading } from '../../redux/actions/utilsActions'
import Swal from 'sweetalert2'
import { resizeImage } from '../../constants/utils/image'

type FormState = {
  id?: string
  username: string
  password?: string
  display: string
  role: string
  status: boolean
  wardId: string
  imageFile: File | null
  imagePreview: string | null
}

const Users = () => {
  const dispatch = useDispatch()
  const { globalSearch, wardId, tokenDecode } = useSelector(
    (state: RootState) => state.utils
  )
  const { t } = useTranslation()
  const { role } = tokenDecode || {}
  const [users, setUsers] = useState<UsersType[]>([])
  const [usersFilter, setUsersFilter] = useState<UsersType[]>([])
  const [imageProcessing, setImageProcessing] = useState(false)

  const [formData, setFormData] = useState<FormState>({
    username: '',
    password: '',
    display: '',
    role: 'USER',
    status: true,
    wardId: '',
    imageFile: null,
    imagePreview: null
  })

  const addModalRef = useRef<HTMLDialogElement>(null)
  const editModalRef = useRef<HTMLDialogElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get<responseType<UsersType[]>>(
        '/auth/user'
      )
      setUsers(response.data.data)
    } catch (error) {
      handleApiError(error)
    }
  }, [])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    let parsedValue: string | boolean = value
    if (name === 'status') {
      parsedValue = value === 'true'
    }

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }))
  }

  const createFormData = () => {
    const formDataObj = new FormData()

    const keyMapping: Record<string, string> = {
      imageFile: 'image',
      username: 'username',
      role: 'userLevel',
      display: 'displayName'
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === undefined || key === 'imagePreview')
        return

      const mappedKey = keyMapping[key as keyof typeof keyMapping] || key

      if (value instanceof File) {
        formDataObj.append(mappedKey, value)
      } else if (typeof value === 'boolean') {
        formDataObj.append(mappedKey, value.toString())
      } else {
        formDataObj.append(mappedKey, value as string)
      }
    })

    return formDataObj
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageProcessing(true)
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
      username: '',
      password: '',
      display: '',
      role: 'USER',
      status: true,
      wardId: '',
      imageFile: null,
      imagePreview: null
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    try {
      const formDataObj = createFormData()

      await axiosInstance.post('/auth/register', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      addModalRef.current?.close()
      resetForm()
      await fetchUsers()
    } catch (error) {
      handleApiError(error)
    } finally {
      dispatch(setSubmitLoading())
    }
  }

  const openEditModal = (user: UsersType) => {
    setFormData({
      id: user.id,
      username: user.username,
      display: user.display || '',
      role: user.role,
      status: user.status,
      wardId: user.ward?.id || '',
      imageFile: null,
      imagePreview: user.pic || null
    })
    editModalRef.current?.showModal()
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())
    await new Promise(resolve => setTimeout(resolve, 5000))
    try {
      const formDataObj = createFormData()
      await axiosInstance.put(`/auth/user/${formData.id}`, formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      editModalRef.current?.close()
      resetForm()
      await fetchUsers()
    } catch (error) {
      handleApiError(error)
    } finally {
      dispatch(setSubmitLoading())
    }
  }

  const deleteUser = async (id: string) => {
    const result = await Swal.fire({
      title: t('deleteConfirmation'),
      text: t('deleteConfirmationText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'oklch(79% 0.1305 238 / var(--tw-text-opacity, 1))',
      cancelButtonColor: 'oklch(72% 0.1938 31 / var(--tw-text-opacity, 1))',
      confirmButtonText: t('confirmDelete'),
      cancelButtonText: t('cancel')
    })

    if (result.isConfirmed) {
      dispatch(setSubmitLoading())
      try {
        await axiosInstance.delete(`/auth/user/${id}`)
        await fetchUsers()
        Swal.fire(t('deleteSuccess'), '', 'success')
      } catch (error) {
        handleApiError(error)
        Swal.fire(t('error'), t('deleteError'), 'error')
      } finally {
        dispatch(setSubmitLoading())
      }
    }
  }

  const handleApiError = (error: unknown) => {
    if (error instanceof AxiosError) {
      console.error(error.response?.data.message)
    } else {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filterUsers = users?.filter(item =>
      wardId
        ? (item.ward?.id?.toLowerCase().includes(wardId.toLowerCase()) &&
            item.display?.toLowerCase().includes(globalSearch.toLowerCase())) ||
          item.username?.toLowerCase().includes(globalSearch.toLowerCase())
        : item.display?.toLowerCase().includes(globalSearch.toLowerCase()) ||
          item.username?.toLowerCase().includes(globalSearch.toLowerCase())
    )
    setUsersFilter(filterUsers)
  }, [users, globalSearch, wardId])

  const UserCard = useMemo(() => {
    if (usersFilter?.length > 0) {
      return (
        <UserPagination
          data={usersFilter}
          initialPerPage={10}
          itemPerPage={[10, 30, 50, 100]}
          renderItem={(item, index) => (
            <div
              className='min-h-[240px] max-h-[270px] sm:w-[300px] lg:w-full w-full bg-base-100 rounded-btn'
              key={index}
            >
              <div
                className='h-full flex flex-col items-center gap-4 px-3 py-4'
                key={item.id}
              >
                <div className='flex items-center justify-between w-full'>
                  <span
                    className={`badge bg-opacity-15 border-1 font-bold h-[25px] ${
                      item.role
                        ? item.role === 'SUPER'
                          ? 'badge-super'
                          : item.role === 'SERVICE'
                          ? 'badge-service'
                          : item.role === 'ADMIN'
                          ? 'badge-admin'
                          : item.role === 'USER'
                          ? 'badge-user'
                          : 'badge-guest'
                        : ''
                    }`}
                  >
                    {item.role ? getRoleLabel(item.role, t) : '—'}
                  </span>
                  <div className='dropdown dropdown-end'>
                    <button
                      tabIndex={0}
                      role='button'
                      data-tip={t('menuButton')}
                      className='btn btn-ghost flex p-0 max-w-[30px] min-w-[30px] max-h-[30px] min-h-[30px] tooltip tooltip-left'
                    >
                      <RiMore2Line size={20} />
                    </button>
                    <ul
                      tabIndex={0}
                      className='dropdown-content menu bg-base-100 rounded-box z-[1] max-w-[180px] w-[140px] p-2 shadow'
                    >
                      <li onClick={() => openEditModal(item)}>
                        <div className='flex items-center gap-3 text-[16px]'>
                          <RiEditLine size={20} />
                          <a>{t('editButton')}</a>
                        </div>
                      </li>
                      {(role === 'SUPER' || role === 'ADMIN') && (
                        <>
                          <div className='divider my-1 h-2 before:h-[1px] after:h-[1px]'></div>
                          <li onClick={() => deleteUser(item.id)}>
                            <div className='flex items-center gap-3 text-[16px] text-red-500 hover:bg-red-500 hover:text-white'>
                              <RiDeleteBin7Line size={20} />
                              <a>{t('deleteButton')}</a>
                            </div>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
                <div className='flex items-center justify-center'>
                  <div className='avatar'>
                    <div className='w-24 rounded-btn'>
                      <img src={item.pic ? item.pic : defaultPic} alt='user' />
                    </div>
                  </div>
                </div>
                <div className='flex flex-col items-center justify-center'>
                  <label
                    htmlFor='span'
                    className='tooltip tooltip-top'
                    data-tip={item.display ?? '—'}
                  >
                    <span className='truncate block max-w-[180px] text-[20px]'>
                      {item.display ?? '—'}
                    </span>
                  </label>
                  <label
                    htmlFor='span'
                    className='tooltip tooltip-bottom'
                    data-tip={item.username ?? '—'}
                  >
                    <span className='truncate block max-w-[180px] text-base-content/50 text-[16px]'>
                      @{item.username ?? '—'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        />
      )
    } else {
      return (
        <div className='flex items-center justify-center loading-hieght-full'>
          <div>{t('nodata')}</div>
        </div>
      )
    }
  }, [usersFilter, role, t])

  return (
    <div className='p-3 px-[16px]'>
      {/* Header Section */}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between mt-3'>
        <span className='text-[28px] font-medium'>{t('sidePermission')}</span>
        <div className='flex flex-col lg:flex-row mt-3 lg:mt-0 lg:items-center items-end gap-4'>
          <HospitalAndWard />
          <button
            className='btn btn-primary max-w-[130px]'
            onClick={() => addModalRef.current?.showModal()}
          >
            {t('addUserButton')}
          </button>
        </div>
      </div>

      {UserCard}

      {/* Add User Modal */}
      <dialog ref={addModalRef} className='modal'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>{t('addUserButton')}</h3>
          <form onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div className='form-control w-full mt-4'>
              <label className='label'>
                <span className='label-text'>{t('image')}</span>
              </label>
              <label className='cursor-pointer flex justify-center'>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='hidden'
                />
                {imageProcessing ? (
                  <div className='mt-4 flex justify-center'>
                    <span className='loading loading-ring loading-md'></span>
                  </div>
                ) : (
                  <div className='mt-4'>
                    <img
                      src={formData.imagePreview || defaultPic}
                      alt='Preview'
                      className={`w-32 h-32 rounded-btn object-cover border-2 border-dashed border-base-300 ${
                        formData.imagePreview || defaultPic
                          ? ' border-none'
                          : ''
                      }`}
                    />
                  </div>
                )}
              </label>
            </div>

            {/* Username */}
            <div className='form-control w-full mt-4'>
              <label className='label'>
                <span className='label-text'>{t('username')}</span>
              </label>
              <input
                name='username'
                type='text'
                required
                value={formData.username}
                onChange={handleChange}
                className='input input-bordered'
              />
            </div>

            {/* Password */}
            <div className='form-control w-full mt-4'>
              <label className='label'>
                <span className='label-text'>{t('password')}</span>
              </label>
              <input
                name='password'
                type='password'
                required
                value={formData.password}
                onChange={handleChange}
                className='input input-bordered'
              />
            </div>

            {/* Modal Actions */}
            <div className='modal-action'>
              <button
                type='button'
                className='btn'
                onClick={() => {
                  addModalRef.current?.close()
                  resetForm()
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
              >
                {t('cancel')}
              </button>
              <button type='submit' className='btn btn-primary'>
                {t('submit')}
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Edit User Modal */}
      <dialog ref={editModalRef} className='modal'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>{t('editUser')}</h3>
          <form onSubmit={handleUpdate}>
            <div className='form-control w-full mt-4'>
              <label className='label'>
                <span className='label-text'>{t('image')}</span>
              </label>
              <label className='cursor-pointer flex justify-center'>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='hidden'
                />
                {imageProcessing ? (
                  <div className='mt-4 flex justify-center'>
                    <span className='loading loading-ring loading-md'></span>
                  </div>
                ) : (
                  <div className='mt-4'>
                    <img
                      src={formData.imagePreview || defaultPic}
                      alt='Preview'
                      className={`w-32 h-32 rounded-btn object-cover border-2 border-dashed border-base-300 ${
                        formData.imagePreview || defaultPic
                          ? ' border-none'
                          : ''
                      }`}
                    />
                  </div>
                )}
              </label>
            </div>

            <div className='form-control w-full mt-4'>
              <label className='label'>
                <span className='label-text'>{t('displayName')}</span>
              </label>
              <input
                type='text'
                name='display'
                value={formData.display}
                onChange={handleChange}
                className='input input-bordered'
              />
            </div>

            <div className='form-control w-full mt-4'>
              <label className='label'>
                <span className='label-text'>{t('username')}</span>
              </label>
              <input
                type='text'
                name='username'
                required
                value={formData.username}
                onChange={handleChange}
                className='input input-bordered'
              />
            </div>

            <div className='form-control w-full mt-4'>
              <label className='label'>
                <span className='label-text'>{t('role')}</span>
              </label>
              <select
                name='role'
                className='select select-bordered'
                value={formData.role}
                onChange={handleChange}
              >
                <option value='SUPER'>Super Admin</option>
                <option value='ADMIN'>Admin</option>
                <option value='USER'>User</option>
              </select>
            </div>

            <div className='form-control w-full mt-4'>
              <label className='label'>
                <span className='label-text'>{t('status')}</span>
              </label>
              <select
                name='status'
                className='select select-bordered'
                value={formData.status.toString()}
                onChange={handleChange}
              >
                <option value='true'>{t('active')}</option>
                <option value='false'>{t('inactive')}</option>
              </select>
            </div>

            <div className='form-control w-full mt-4'>
              <label className='label'>
                <span className='label-text'>{t('ward')}</span>
              </label>
              <input
                type='text'
                name='wardId'
                className='input input-bordered'
                value={formData.wardId}
                onChange={handleChange}
              />
            </div>

            <div className='modal-action'>
              <button
                type='button'
                className='btn'
                onClick={() => {
                  editModalRef.current?.close()
                  resetForm()
                }}
              >
                {t('cancel')}
              </button>
              <button type='submit' className='btn btn-primary'>
                {t('submit')}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  )
}

export default Users
