import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cookieOptions, cookies } from '../../../constants/utils/utilsConstants'
import { useDispatch, useSelector } from 'react-redux'
import { setSearch } from '../../../redux/actions/utilsActions'
import { RootState } from '../../../redux/reducers/rootReducer'
import ManageDeviceSkeleton from '../../../components/skeleton/manage/manageDeviceSkeleton'
import ManageHospitalSkeleton from '../../../components/skeleton/manage/manageHospitalSkeleton'
const ManageDevice = lazy(() => import('./manageDevice'))
const ManageProbe = lazy(() => import('./manageProbe'))

const ManageDeviceAndProbe = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [tab, setTab] = useState(cookies.get('manageDeviceTab') ?? 1)
  const { tokenDecode } = useSelector((state: RootState) => state.utils)
  const { role } = tokenDecode || {}

  useEffect(() => {
    return () => {
      dispatch(setSearch(''))
    }
  }, [])

  const manageMenu = useMemo(
    () => (
      <div role='tablist' className='tabs tabs-bordered w-72 md:w-max mt-3'>
        <a
          role='tab'
          className={`tab text-sm md:text-base ${
            tab === 1 ? 'tab-active font-bold' : ''
          }`}
          onClick={() => {
            cookies.set('manageDeviceTab', 1, cookieOptions)
            setTab(1)
          }}
        >
          {t('subTabDevice')}
        </a>
        {(role === 'SUPER' || role === 'SERVICE') && (
          <a
            role='tab'
            className={`tab text-sm md:text-base ${
              tab === 2 ? 'tab-active font-bold' : ''
            }`}
            onClick={() => {
              cookies.set('manageDeviceTab', 2, cookieOptions)
              setTab(2)
            }}
          >
            {t('subTabProbe')}
          </a>
        )}
      </div>
    ),
    [tab, role, t]
  )

  return (
    <div>
      {manageMenu}
      <div className='mt-3'>
        {tab === 1 ? (
          <Suspense fallback={<ManageDeviceSkeleton />}>
            <ManageDevice />
          </Suspense>
        ) : (
          <Suspense fallback={<ManageHospitalSkeleton />}>
            <ManageProbe />
          </Suspense>
        )}
      </div>
    </div>
  )
}

export default ManageDeviceAndProbe
