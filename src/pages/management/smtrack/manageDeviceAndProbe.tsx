import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cookieOptions, cookies } from '../../../constants/utils/utilsConstants'
import { useDispatch, useSelector } from 'react-redux'
import { setSearch } from '../../../redux/actions/utilsActions'
import { RootState } from '../../../redux/reducers/rootReducer'
import ManageProbe from './manageProbe'
import ManageDevice from './manageDevice'
import { RiBox3Fill, RiBox3Line, RiSensorFill, RiSensorLine } from 'react-icons/ri'

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
            tab === 1 ? 'tab-active font-medium' : ''
          }`}
          onClick={() => {
            cookies.set('manageDeviceTab', 1, cookieOptions)
            setTab(1)
          }}
        >
          {tab === 1 ? <RiBox3Fill size={24} /> : <RiBox3Line size={24} />}
          <span className='hidden md:block md:ml-2'>{t('subTabDevice')}</span>
        </a>
        {(role === 'SUPER' || role === 'SERVICE') && (
          <a
            role='tab'
            className={`tab text-sm md:text-base ${
              tab === 2 ? 'tab-active font-medium' : ''
            }`}
            onClick={() => {
              cookies.set('manageDeviceTab', 2, cookieOptions)
              setTab(2)
            }}
          >
            {tab === 2 ? <RiSensorFill size={24} /> : <RiSensorLine size={24} />}
            <span className='hidden md:block md:ml-2'>{t('subTabProbe')}</span>
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
        {tab === 1 ? <ManageDevice /> : <ManageProbe />}
      </div>
    </div>
  )
}

export default ManageDeviceAndProbe
