import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { setSearch } from '../../../redux/actions/utilsActions'
import { useDispatch, useSelector } from 'react-redux'
import { cookieOptions, cookies } from '../../../constants/utils/utilsConstants'
import { RootState } from '../../../redux/reducers/rootReducer'
import ManageDevice from './manageDevice'
import ManageHospital from '../manageHospital'

const ManagementTms = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { tokenDecode } = useSelector((state: RootState) => state.utils)
  const [tab, setTab] = useState(cookies.get('manageHospitalTab') ?? 1)
  const { role } = tokenDecode ?? {}

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
          className={`tab text-sm md:text-lg ${tab === 1 ? 'tab-active' : ''}`}
          onClick={() => {
            cookies.set('manageHospitalTab', 1, cookieOptions)
            setTab(1)
          }}
        >
          {t('tabManageDevice')}
        </a>
        {(role === 'SUPER' || role === 'SERVICE') && (
          <a
            role='tab'
            className={`tab text-sm md:text-lg ${
              tab === 2 ? 'tab-active' : ''
            }`}
            onClick={() => {
              cookies.set('manageHospitalTab', 2, cookieOptions)
              setTab(2)
            }}
          >
            {t('tabManageHospitals')}
          </a>
        )}
      </div>
    ),
    [tab, role, t]
  )

  return (
    <div className='p-3 px-[16px]'>
      {manageMenu}
      <div className='mt-3'>
        {tab === 1 ? (
          <ManageDevice />
        ) : (
          <ManageHospital />
        )}
      </div>
    </div>
  )
}

export default ManagementTms
