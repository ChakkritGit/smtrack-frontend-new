import { AxiosError } from 'axios'
import { FormEvent, useRef, useState } from 'react'
import axiosInstance from '../../constants/axios/axiosInstance'
import {
  accessToken,
  cookieOptions,
  cookies
} from '../../constants/utils/utilsConstants'
import { setCookieEncode } from '../../redux/actions/utilsActions'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// import AlertModal from '../../components/modal/alertModal';
import { useTranslation } from 'react-i18next'
import LanguageList from '../../components/language/languageList'

const Login = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const modalRef = useRef<HTMLDialogElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [alertMessage, setAlertMessage] = useState('')

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    const username = usernameRef.current?.value || ''
    const password = passwordRef.current?.value || ''

    const alertWarningElement = document.querySelector('[role="alert-warning"]')
    const alertErrorElement = document.querySelector('[role="alert-error"]')
    if (alertWarningElement) {
      alertWarningElement.classList.add('hidden')
    }
    if (alertErrorElement) {
      alertErrorElement.classList.add('hidden')
    }

    if (username === '' || password === '') {
      if (alertWarningElement) {
        alertWarningElement.classList.remove('hidden')
      }
      return
    }

    try {
      const response = await axiosInstance.post('/auth/login', {
        username,
        password
      })
      const { hosId, token, refreshToken, id, wardId } = response.data.data
      const tokenObject = {
        hosId,
        refreshToken,
        token,
        id,
        wardId
      }
      cookies.set(
        'tokenObject',
        String(accessToken(tokenObject)),
        cookieOptions
      )
      dispatch(setCookieEncode(String(accessToken(tokenObject))))
      navigate(`/`)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (alertErrorElement) {
          setAlertMessage(error.response?.data.message)
          alertErrorElement.classList.remove('hidden')
        }
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    }
  }

  return (
    <div className='h-dvh flex items-center justify-center'>
      <div className='card bg-base-100 w-[350px] sm:w-[500px] md:w-[500px] lg:w-[500px] h-max shadow-xl'>
        <div className='px-5 pt-5'>
          <div className='text-end'>
            <LanguageList />
          </div>
          <h1 className='text-[38px] font-bold text-primary'>SMTrack+</h1>
          <span>
            Real-time temperature monitoring with alerts for exceeding limits
          </span>
          <div
            role='alert-error'
            className='alert alert-error mt-4 hidden animate-transition-pop'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 shrink-0 stroke-current'
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span>{`${t('alertHeaderError')} ${
              alertMessage ?? t('descriptionErrorWrong')
            }`}</span>
          </div>
          <div
            role='alert-warning'
            className={`alert alert-warning mt-4 hidden animate-transition-pop`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 shrink-0 stroke-current'
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
            <div>
              <span>{`${t('alertHeaderWarning')} ${t('completeField')}`}</span>
            </div>
          </div>
        </div>
        <div className='card-body px-5'>
          <form onSubmit={handleLogin} className='flex flex-col gap-4'>
            <label className='input input-bordered flex items-center gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 16 16'
                fill='currentColor'
                className='h-4 w-4 opacity-70'
              >
                <path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z' />
              </svg>
              <input
                ref={usernameRef}
                type='text'
                className='grow'
                placeholder={t('userNameForm')}
                autoComplete='username'
                autoFocus
              />
            </label>
            <label className='input input-bordered flex items-center gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 16 16'
                fill='currentColor'
                className='h-4 w-4 opacity-70'
              >
                <path
                  fillRule='evenodd'
                  d='M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z'
                  clipRule='evenodd'
                />
              </svg>
              <input
                ref={passwordRef}
                type='password'
                className='grow'
                placeholder={t('userPassword')}
                autoComplete='current-password'
              />
            </label>
            <div className='card-actions'>
              <button
                type='submit'
                className='btn btn-primary w-full text-[16px]'
              >
                {t('loginButton')}
              </button>
            </div>
          </form>
          <div className='divider'>{t('contactUs')}</div>
        </div>
      </div>
    </div>
  )
}

export default Login
