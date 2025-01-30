import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ManageHospital from './manageHospital'
import ManageDevice from './manageDevice'

const ManagementTms = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(1)

  return (
    <div className='p-3 px-[16px]'>
      <div role='tablist' className='tabs tabs-bordered w-72 md:w-max mt-5'>
        <a
          role='tab'
          className={`tab text-sm md:text-lg ${tab === 1 ? 'tab-active' : ''}`}
          onClick={() => setTab(1)}
        >
          {t('tabManageDevice')}
        </a>
        <a
          role='tab'
          className={`tab text-sm md:text-lg ${tab === 2 ? 'tab-active' : ''}`}
          onClick={() => setTab(2)}
        >
          {t('tabManageHospitals')}
        </a>
      </div>
      <div className='mt-3'>
        {tab === 1 ? <ManageDevice /> : <ManageHospital />}
      </div>
    </div>
  )
}

export default ManagementTms
