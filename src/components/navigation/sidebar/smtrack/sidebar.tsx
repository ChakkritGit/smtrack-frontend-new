import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/reducers/rootReducer'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  RiDashboardFill,
  RiDashboardLine,
  RiFileSettingsFill,
  RiFileSettingsLine,
  RiHome3Fill,
  RiHome3Line,
  RiListSettingsFill,
  RiListSettingsLine,
  RiSettings3Fill,
  RiSettings3Line,
  RiShieldCheckFill,
  RiShieldCheckLine,
  RiUser6Fill,
  RiUser6Line
} from 'react-icons/ri'
import {
  setDeviceKey,
  setTmsMode
} from '../../../../redux/actions/utilsActions'
import DefaultPic from '../../../../assets/images/default-pic.png'
import { useTranslation } from 'react-i18next'
import {
  cookieOptions,
  cookies
} from '../../../../constants/utils/utilsConstants'

const Sidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const location = useLocation()
  const { isExpand, userProfile, tmsMode, tokenDecode } = useSelector(
    (state: RootState) => state.utils
  )
  const { ward } = userProfile || {}
  const { role } = tokenDecode || {}

  return (
    <div
      className={`drawer-side shadow-sm z-[90] ${
        isExpand ? '!overflow-visible' : ''
      }`}
    >
      <label
        htmlFor='my-drawer-2'
        aria-label='close sidebar'
        className='drawer-overlay'
      ></label>
      <ul
        className={`menu bg-base-100 text-base-content min-h-full flex flex-col !items-center justify-between !transition-all !ease-in-out !duration-300 ${
          isExpand ? 'w-[100px]' : 'w-[235px]'
        }`}
      >
        <div>
          <div className='flex items-center justify-center flex-col gap-5 p-3'>
            <img
              onClick={() => navigate('/')}
              src={ward?.hospital.hosPic ? ward.hospital.hosPic : DefaultPic}
              alt='Hospital-img'
              className={`btn btn-ghost rounded-box transition-all ease-in-out duration-300 ${
                isExpand ? 'w-24 h-max' : 'w-32 h-28'
              } object-contain p-0 hover:bg-transparent`}
            />
            <h3 className='text-[24px]'>
              {ward?.hospital.hosName
                ? isExpand
                  ? ward?.hospital.hosName[0]
                  : ward?.hospital.hosName
                : '—'}
            </h3>
          </div>
          <div className='divider mt-0 mb-0'></div>
          <div className='flex items-center justify-center flex-col gap-2 p-3'>
            <Link
              to={'/'}
              className={`btn font-normal flex-nowrap justify-start w-full ${
                location.pathname === '/' ? 'btn-primary' : 'btn-ghost'
              } flex ${isExpand ? 'tooltip tooltip-right z-50' : ''}`}
              data-tip={t('sideShowAllBox')}
            >
              {location.pathname === '/' ? (
                <RiHome3Fill size={24} />
              ) : (
                <RiHome3Line size={24} />
              )}
              {!isExpand && (
                <span className='text-[16px] leading-normal truncate'>
                  {t('sideShowAllBox')}
                </span>
              )}
            </Link>
            <Link
              to={'/dashboard'}
              className={`btn font-normal flex-nowrap justify-start w-full ${
                location.pathname === '/dashboard' ||
                location.pathname.split('/')[2] === 'chart' ||
                location.pathname.split('/')[2] === 'table' ||
                location.pathname === '/dashboard/chart/compare'
                  ? 'btn-primary'
                  : 'btn-ghost'
              } flex ${isExpand ? 'tooltip tooltip-right z-50' : ''}`}
              data-tip={t('sideDashboard')}
            >
              {location.pathname === '/dashboard' ||
              location.pathname.split('/')[2] === 'chart' ||
              location.pathname.split('/')[2] === 'table' ||
              location.pathname === '/dashboard/chart/compare' ? (
                <RiDashboardFill size={24} />
              ) : (
                <RiDashboardLine size={24} />
              )}
              {!isExpand && (
                <span className='text-[16px] leading-normal truncate'>
                  {t('sideDashboard')}
                </span>
              )}
            </Link>
            <Link
              to={'/permission'}
              className={`btn font-normal flex-nowrap justify-start w-full ${
                location.pathname === '/permission'
                  ? 'btn-primary'
                  : 'btn-ghost'
              } flex ${isExpand ? 'tooltip tooltip-right z-50' : ''}`}
              data-tip={t('sidePermission')}
            >
              {location.pathname === '/permission' ? (
                <RiUser6Fill size={24} />
              ) : (
                <RiUser6Line size={24} />
              )}
              {!isExpand && (
                <span className='text-[16px] leading-normal truncate'>
                  {t('sidePermission')}
                </span>
              )}
            </Link>
            <Link
              to={'/management'}
              className={`btn font-normal flex-nowrap justify-start w-full ${
                location.pathname === '/management' ||
                location.pathname === '/management/logadjust' ||
                location.pathname === '/management/flasher'
                  ? 'btn-primary'
                  : 'btn-ghost'
              } flex ${isExpand ? 'tooltip tooltip-right z-50' : ''}`}
              data-tip={t('sideManage')}
            >
              {location.pathname === '/management' ||
              location.pathname === '/management/logadjust' ||
              location.pathname === '/management/flasher' ? (
                <RiListSettingsFill size={24} />
              ) : (
                <RiListSettingsLine size={24} />
              )}
              {!isExpand && (
                <span className='text-[16px] leading-normal truncate'>{t('sideManage')}</span>
              )}
            </Link>
          </div>
          <div className='divider mb-0'></div>
          <div className='flex items-center justify-center flex-col gap-2 p-3'>
            <Link
              to={'/repair'}
              className={`btn font-normal flex-nowrap justify-start w-full ${
                location.pathname === '/repair' ? 'btn-primary' : 'btn-ghost'
              } flex ${isExpand ? 'tooltip tooltip-right z-50' : ''}`}
              data-tip={t('sideRepair')}
            >
              {location.pathname === '/repair' ? (
                <RiFileSettingsFill size={24} />
              ) : (
                <RiFileSettingsLine size={24} />
              )}
              {!isExpand && (
                <span className='text-[16px] leading-normal truncate'>{t('sideRepair')}</span>
              )}
            </Link>
            <Link
              to={'/warranty'}
              className={`btn font-normal flex-nowrap justify-start w-full ${
                location.pathname === '/warranty' ? 'btn-primary' : 'btn-ghost'
              } flex ${isExpand ? 'tooltip tooltip-right z-50' : ''}`}
              data-tip={t('sideWarranty')}
            >
              {location.pathname === '/warranty' ? (
                <RiShieldCheckFill size={24} />
              ) : (
                <RiShieldCheckLine size={24} />
              )}
              {!isExpand && (
                <span className='text-[16px] leading-normal truncate'>
                  {t('sideWarranty')}
                </span>
              )}
            </Link>
          </div>
        </div>
        <div className='w-full'>
          <div className='divider mb-0'></div>
          <div className='flex justify-center flex-col gap-3 p-3'>
            {(role === 'SUPER' || role === 'SERVICE') && (
              <div className='flex flex-col items-center gap-2'>
                {!isExpand && (
                  <span className='text-[12px] truncate'>
                    *Switch mode eTEMP and TMS
                  </span>
                )}
                <div className='flex items-center justify-center gap-2'>
                  <input
                    type='checkbox'
                    className='toggle toggle-md'
                    checked={tmsMode}
                    onClick={async () => {
                      navigate('/')
                      dispatch(setTmsMode())

                      await new Promise(resolve => setTimeout(resolve, 500))

                      dispatch(setDeviceKey(''))
                      cookies.set('tmsMode', !tmsMode, cookieOptions)
                      cookies.remove('deviceKey', cookieOptions)
                    }}
                  />
                </div>
              </div>
            )}
            <Link
              to={'/settings'}
              className={`btn font-normal flex-nowrap justify-start w-full ${
                location.pathname === '/settings' ? 'btn-primary' : 'btn-ghost'
              } flex ${isExpand ? 'tooltip tooltip-right z-50' : ''}`}
              data-tip={t('sideSetting')}
            >
              {location.pathname === '/settings' ? (
                <RiSettings3Fill size={24} />
              ) : (
                <RiSettings3Line size={24} />
              )}
              {!isExpand && (
                <span className='text-[16px] leading-normal truncate'>{t('sideSetting')}</span>
              )}
            </Link>
            <Link
              to={'/log'}
              className={`text-[12px] ${
                isExpand ? 'text-center' : 'text-right'
              } hover:underline cursor-pointer`}
            >
              {import.meta.env.VITE_APP_VERSION}
            </Link>
          </div>
        </div>
      </ul>
    </div>
  )
}

export default Sidebar
