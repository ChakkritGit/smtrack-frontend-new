import { useTranslation } from 'react-i18next'
import { DeviceLogTms } from '../../../types/tms/devices/deviceType'
import { RiFullscreenLine } from 'react-icons/ri'
import DataTableMiniTms from './dataTableMiniTms'

interface DataTableWrapperProps {
  deviceLogs: DeviceLogTms | undefined
}

const DataTableWrapperTms = (props: DataTableWrapperProps) => {
  const { t } = useTranslation()
  const { deviceLogs } = props

  return (
    <div className='flex flex-col gap-3 bg-base-100 w-full h-full rounded-btn p-3'>
      <div className='flex items-center justify-between px-3'>
        <div className='flex items-center gap-3'>
          <span className='text-[20px] font-bold'>{t('pageChart')}</span>
        </div>
        <button
          className='btn btn-ghost flex p-0 duration-300 max-h-[34px] min-h-[34px] max-w-[34px] min-w-[34px] tooltip tooltip-left'
          data-tip={t('fullTable')}
        >
          <RiFullscreenLine size={20} />
        </button>
      </div>
      <div className='h-full chart-h'>
        <DataTableMiniTms deviceLogs={deviceLogs} />
      </div>
    </div>
  )
}

export default DataTableWrapperTms
