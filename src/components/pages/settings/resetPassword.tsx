import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { setSubmitLoading } from '../../../redux/actions/utilsActions'
import { AxiosError } from 'axios'
import axiosInstance from '../../../constants/axios/axiosInstance'
import {
  responseType,
  UserProfileType
} from '../../../types/smtrack/utilsRedux/utilsReduxType'

const ResetPassword = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [userPassword, setUserPassword] = useState('')
  const [onEdit, setOnEdit] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (userPassword !== '') {
      try {
        await axiosInstance.put<responseType<UserProfileType>>(
          `/auth/user/${''}`,
          {
            password: userPassword
          }
        )
        resetForm()
        setOnEdit(false)
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: t('submitSuccess'),
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
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500
      })
      dispatch(setSubmitLoading())
    }
  }

  const resetForm = () => {
    setUserPassword('')
    setOnEdit(false)
  }

  return (
    <div className='mt-3'>
      <div className='divider divider-vertical my-2 before:h-[1px] after:h-[1px]'></div>
      <h3 className='font-bold text-base'>{t('titleSecurity')}</h3>

      {onEdit ? (
        <div className='mt-3'>
          <form onSubmit={handleSubmit}>
            <div className='form-control'>
              <label className='input input-bordered flex items-center gap-2'>
                <span className='opacity-50'>{t('titlePassword')}</span>
                <input
                  type='text'
                  name='userPassword'
                  autoComplete='off'
                  onChange={e => setUserPassword(e.target.value)}
                  value={userPassword}
                  className='grow caret-primary w-[100px] md:w-auto'
                  autoFocus
                  maxLength={80}
                />
              </label>
            </div>
            {/* Modal Actions */}
            <div className='modal-action mt-6'>
              <button type='button' className='btn' onClick={() => resetForm()}>
                {t('cancelButton')}
              </button>
              <button type='submit' className='btn btn-primary'>
                {t('submitButton')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className='flex items-center justify-between mt-3'>
          <span className='ml-5'>{t('titlePassword')}</span>
          <button
            onClick={() => setOnEdit(true)}
            className='w-[50px] h-[35px] md:w-[70px] md:h-[40px] font-bold rounded-btn border-[2px] border-base-content text-[14px] md:text-base-content hover:opacity-50 duration-300'
          >
            {t('changPassword')}
          </button>
        </div>
      )}
    </div>
  )
}

export default ResetPassword
