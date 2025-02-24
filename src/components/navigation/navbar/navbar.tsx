import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  RiSearchLine,
  RiArrowDownSLine,
  RiLayoutLeftLine,
  RiLayoutRightLine,
  RiCloseLine,
  RiHistoryLine,
  RiDeviceLine
} from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'
import {
  setCookieEncode,
  setDeviceKey,
  setIsExpand,
  setSearch
} from '../../../redux/actions/utilsActions'
import DefaultPic from '../../../assets/images/default-pic.png'
import { UAParser } from 'ua-parser-js'
import {
  cookieOptions,
  cookies,
  getRoleLabel
} from '../../../constants/utils/utilsConstants'
import { useTranslation } from 'react-i18next'
import ThemeList from '../../theme/themeList'
import LanguageList from '../../language/languageList'
import { menuDataArraySmtrack } from '../../../constants/utils/dataSearch'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../../constants/axios/axiosInstance'
import { responseType } from '../../../types/smtrack/utilsRedux/utilsReduxType'
import { DeviceListTmsType } from '../../../types/tms/devices/deviceType'
import { AxiosError } from 'axios'
import { DeviceListType } from '../../../types/smtrack/devices/deviceType'
import Notifications from '../../notifications/notifications'
import ProfileComponent from '../../settings/profileComponent'
import SoundAndNotificationComponents from '../../settings/soundAndNotificationComponents'

type SearchType = {
  text: string
  path: string
  tag: string
}

interface FormState {
  imagePreview: string | null
}

const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { isExpand, userProfile, globalSearch, tmsMode } = useSelector(
    (state: RootState) => state.utils
  )
  const { pic, display, role } = userProfile || {}
  const searchRef = useRef<HTMLInputElement | null>(null)
  const searchWrapperRef = useRef<HTMLInputElement | null>(null)
  const profileModalRef = useRef<HTMLDialogElement>(null)
  const settingModalRef = useRef<HTMLDialogElement>(null)
  const parser = new UAParser()
  const os = parser.getOS().name
  const isMac = os === 'mac os'
  const clearText = globalSearch === ''
  const [isFocused, setIsFocused] = useState(false)
  const [deviceList, setDeviceList] = useState<
    DeviceListType[] | DeviceListTmsType[]
  >([])
  const [image, setImage] = useState<FormState>({
    imagePreview: userProfile?.pic ?? null
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [searchHistory, setSearchHistory] = useState<SearchType[]>(() => {
    const storedHistory = cookies.get('searchHistory')
    return storedHistory ? storedHistory : []
  })

  const updateSearchHistory = (item: SearchType) => {
    setSearchHistory(prev => {
      let updatedHistory = [item, ...prev.filter(i => i.path !== item.path)]
      if (updatedHistory.length > 7) updatedHistory = updatedHistory.slice(0, 7)
      cookies.set('searchHistory', updatedHistory, cookieOptions)

      return updatedHistory
    })
  }
  const removeHistoryItem = (path: string) => {
    setSearchHistory(prev => {
      const updatedHistory = prev.filter(item => item.path !== path)
      cookies.set('searchHistory', updatedHistory, cookieOptions)
      return updatedHistory
    })
  }

  const fetchDeviceList = useCallback(async () => {
    try {
      const response = await axiosInstance.get<
        responseType<DeviceListTmsType[] | DeviceListTmsType[]>
      >(!tmsMode ? '/devices/dashboard/device' : '/legacy/device/devices/list')
      setDeviceList(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    }
  }, [])

  useEffect(() => {
    fetchDeviceList()
  }, [])

  useEffect(() => {
    localStorage.setItem('expandaside', isExpand.toString())
  }, [isExpand])

  useEffect(() => {
    const handleCk = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key?.toLowerCase() === 'k') {
          e.preventDefault()
          searchRef.current?.focus()
        }
      } else if (e.key?.toLowerCase() === 'escape') {
        e.preventDefault()
        if (isFocused) {
          searchRef.current?.blur()
          setIsFocused(false)
        }
      }
    }

    window.addEventListener('keydown', handleCk)

    return () => {
      window.removeEventListener('keydown', handleCk)
    }
  }, [isFocused])

  useEffect(() => {
    function handleClickOutside (event: any) {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target)
      ) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const searchRecommend = useMemo(() => {
    if (!isFocused) return null

    const filter = menuDataArraySmtrack(t).filter(
      f =>
        f.text?.toLowerCase().includes(globalSearch?.toLowerCase()) ||
        f.tag?.toLowerCase().includes(globalSearch?.toLowerCase())
    )

    const devive = deviceList
      .filter(
        f =>
          f.name?.toLowerCase().includes(globalSearch?.toLowerCase()) ||
          f.id?.toLowerCase().includes(globalSearch?.toLowerCase()) ||
          f.sn?.toLowerCase().includes(globalSearch?.toLowerCase())
      )
      .slice(0, 6)

    return (
      <div
        className='search-anim absolute min-w-[450px] min-h-[50px] max-w-[500px]
      max-h-[400px] bg-base-100 backdrop-blur transition-shadow shadow-sm duration-300
      border-base-content/15 border-[1px] py-3 pl-4 pr-1 top-[60px] overflow-y-scroll
      rounded-btn'
      >
        <div className='p-1 flex items-center gap-3 opacity-70 mb-1'>
          <span>{t('pressPre1')}</span>
          <kbd className='kbd kbd-sm'>Esc</kbd>
          <span>{t('pressPre2')}</span>
        </div>
        {searchHistory.length > 0 ? (
          <>
            {searchHistory.map((item, index) => (
              <div
                key={index}
                className={`${
                  index !== 0 ? 'mt-1' : ''
                } flex items-center justify-between p-2 rounded-btn cursor-pointer hover:bg-primary/30 duration-300`}
                onClick={() => {
                  updateSearchHistory(item)

                  if (item.tag === 'menu') {
                    navigate(item.path)
                    dispatch(setSearch(t(item.text)))
                    setIsFocused(false)
                  } else if (item.tag === 'device') {
                    cookies.set('deviceKey', item.path, cookieOptions) // it's mean setSerial
                    dispatch(setDeviceKey(item.path))
                    dispatch(setSearch(t(item.text)))
                    navigate('/dashboard')
                    window.scrollTo(0, 0)
                    setIsFocused(false)
                  }
                }}
              >
                <div className='flex items-center gap-3'>
                  <div>
                    <RiHistoryLine size={18} />
                  </div>
                  <span className='truncate  max-w-[300px]'>
                    {t(item.text)}
                  </span>
                </div>
                <button
                  className='p-1 rounded-full hover:bg-red-500 hover:text-white duration-300'
                  onClick={e => {
                    e.stopPropagation()
                    removeHistoryItem(item.path)
                  }}
                >
                  <RiCloseLine size={18} />
                </button>
              </div>
            ))}
          </>
        ) : (
          <div className='flex items-center justify-center py-5'>
            <span className='opacity-70'>{t('noHistory')}</span>
          </div>
        )}

        {globalSearch && (
          <div>
            <div className='divider text-[12px] opacity-50'>
              {t('countDeviceUnit')}
            </div>
            <div
              className={`grid grid-cols-1 ${
                devive.length > 0 ? 'md:grid-cols-2' : ''
              } gap-2`}
            >
              {devive.length > 0 ? (
                devive.map((item, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-3 p-2 rounded-btn cursor-pointer hover:bg-primary/30 duration-300'
                    onClick={() => {
                      const newItem = {
                        text: item.name,
                        path: !tmsMode ? item.id : String(item.sn),
                        tag: 'device'
                      }
                      dispatch(setSearch(item.name))
                      setIsFocused(false)
                      updateSearchHistory(newItem)
                      cookies.set(
                        'deviceKey',
                        !tmsMode ? item.id : item.sn,
                        cookieOptions
                      ) // it's mean setSerial
                      dispatch(
                        setDeviceKey(!tmsMode ? item.id : String(item.sn))
                      )
                      navigate('/dashboard')
                      window.scrollTo(0, 0)
                    }}
                  >
                    <div>
                      <RiDeviceLine size={18} />
                    </div>
                    <span className='truncate max-w-[150px]'>{item.name}</span>
                  </div>
                ))
              ) : (
                <div className='flex items-center justify-center py-3'>
                  <span className='opacity-70'>{t('nodata')}</span>
                </div>
              )}
            </div>
            <div className='divider text-[12px] opacity-50'>
              {t('menuButton')}
            </div>
            <div
              className={`grid grid-cols-1 ${
                filter.length > 0 ? 'md:grid-cols-2' : ''
              } gap-2`}
            >
              {filter.length > 0 ? (
                filter.map((item, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-3 p-2 rounded-btn cursor-pointer hover:bg-primary/30 duration-300'
                    onClick={() => {
                      const newItem = {
                        text: item.text,
                        path: item.path,
                        tag: 'menu'
                      }
                      dispatch(setSearch(t(item.text)))
                      navigate(item.path)
                      setIsFocused(false)
                      updateSearchHistory(newItem)
                    }}
                  >
                    <div>{item.icon}</div>
                    <span className='truncate max-w-[150px]'>
                      {t(item.text)}
                    </span>
                  </div>
                ))
              ) : (
                <div className='flex items-center justify-center py-3'>
                  <span className='opacity-70'>{t('nodata')}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }, [
    isFocused,
    searchHistory,
    menuDataArraySmtrack,
    t,
    globalSearch,
    navigate,
    dispatch
  ])

  return (
    <div className='bg-base-100 text-base-content sticky top-0 z-[80] flex h-16 w-full justify-center bg-opacity-80 backdrop-blur transition-shadow duration-300 [transform:translate3d(0,0,0)] shadow-sm'>
      <div className='navbar'>
        <div className='flex-1 lg:gap-3'>
          <label
            htmlFor='my-drawer-2'
            className='btn btn-ghost drawer-button lg:hidden'
          >
            <RiLayoutLeftLine size={24} />
          </label>
          <label
            htmlFor='my-drawer-2'
            className='btn btn-ghost drawer-button hidden lg:flex tooltip tooltip-right'
            onClick={() => dispatch(setIsExpand())}
            data-tip={t('expandSide')}
          >
            {isExpand ? (
              <RiLayoutRightLine size={24} />
            ) : (
              <RiLayoutLeftLine size={24} />
            )}
          </label>
          <div ref={searchWrapperRef} className='relative'>
            <div className='form-control'>
              <label className='input input-bordered bg-base-200/50 hidden border-none h-10 w-[250px] items-center gap-2 lg:flex duration-300'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 16 16'
                  fill='currentColor'
                  className='h-5 w-5 opacity-50'
                >
                  <path
                    fillRule='evenodd'
                    d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
                    clipRule='evenodd'
                  />
                </svg>
                <input
                  name='Search'
                  onFocus={() => setIsFocused(true)}
                  onChange={e => dispatch(setSearch(e.target.value))}
                  value={globalSearch}
                  type='text'
                  className='grow !w-28 md:w-auto caret-primary placeholder:text-base-content/50'
                  placeholder='Search'
                  autoComplete='off'
                  ref={searchRef}
                />
                {clearText ? (
                  <>
                    <kbd className='kbd kbd-sm'>{isMac ? '⌘' : 'Ctrl'}</kbd>
                    <kbd className='kbd kbd-sm'>K</kbd>
                  </>
                ) : (
                  <kbd
                    className='kbd kbd-sm'
                    onClick={() => dispatch(setSearch(''))}
                  >
                    X
                  </kbd>
                )}
              </label>
            </div>
            {searchRecommend}
          </div>
          <div className='btn btn-ghost lg:hidden'>
            <RiSearchLine size={24} />
          </div>
        </div>
        <Notifications />
        <ThemeList />
        <LanguageList />
        {/* <div className='lg:divider lg:divider-horizontal lg:!mx-2'></div> */}
        <div className='flex-none gap-2 hidden lg:block'>
          <div className='dropdown dropdown-end'>
            <div
              tabIndex={0}
              role='button'
              className='btn btn-ghost gap-3 px-2'
            >
              <div className='avatar'>
                <div className='w-10 rounded-btn'>
                  <img src={pic ? pic : DefaultPic} alt='User-img' />
                </div>
              </div>
              <div className='flex flex-col items-start gap-1'>
                <span className='font-normal text-[17px]'>
                  {display ? display : '—'}
                </span>
                <span className='text-[12px]'>
                  {role ? getRoleLabel(role, t) : '—'}
                </span>
              </div>
              <RiArrowDownSLine size={18} />
            </div>
            <ul
              tabIndex={0}
              className='menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-32 p-2 shadow'
            >
              <li>
                <a
                  onClick={() => profileModalRef?.current?.showModal()}
                  className='justify-between'
                >
                  {t('profile')}
                </a>
              </li>
              <li>
                <a onClick={() => settingModalRef?.current?.showModal()}>
                  {t('sideSetting')}
                </a>
              </li>
              <li
                onClick={() => {
                  cookies.remove('tokenObject', cookieOptions)
                  dispatch(setCookieEncode(undefined))
                }}
              >
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <dialog ref={profileModalRef} className='modal overflow-y-scroll py-10'>
        <div className='modal-box max-w-[50rem] h-max max-h-max'>
          <ProfileComponent
            userProfile={userProfile}
            profileModalRef={profileModalRef}
            fileInputRef={fileInputRef}
            image={image}
            setImage={setImage}
          />
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button
            onClick={() => {
              setImage({
                imagePreview: userProfile?.pic ?? null
              })
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
          >
            close
          </button>
        </form>
      </dialog>

      <dialog ref={settingModalRef} className='modal overflow-y-scroll py-10'>
        <div className='modal-box max-w-[50rem] h-max max-h-max'>
          <SoundAndNotificationComponents />
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button
            onClick={() => {
              setImage({
                imagePreview: userProfile?.pic ?? null
              })
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
          >
            close
          </button>
        </form>
      </dialog>
    </div>
  )
}

export default Navbar
