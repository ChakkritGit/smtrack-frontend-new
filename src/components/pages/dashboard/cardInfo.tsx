import { useTranslation } from 'react-i18next'
import { DeviceLogsType } from '../../../types/smtrack/devices/deviceType'

type PropsType = {
  deviceData: DeviceLogsType | undefined
}

const CardInFoComponent = (props: PropsType) => {
  const { t } = useTranslation()

  const { deviceData } = props
  return (
    <div className='py-5 px-4'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <p className='font-bold'>{t('deviceNameBox')} • </p>
            <p
              className='truncate max-w-[150px] lg:max-w-[300px]'
              title={deviceData?.name ?? '—'}
            >
              {deviceData?.name ?? '—'}
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <p className='font-bold'>{t('deviceSnBox')} • </p>
            <p
              className='truncate max-w-[150px] lg:max-w-[300px]'
              title={deviceData?.id ?? '—'}
            >
              {deviceData?.id ?? '—'}
            </p>
          </div>
        </div>
        <div>Adj</div>
      </div>
    </div>
  )
}

export default CardInFoComponent
