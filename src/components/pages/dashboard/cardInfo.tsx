import { useTranslation } from 'react-i18next'
import { DeviceLogsType } from '../../../types/smtrack/devices/deviceType'
import { RiSettings3Line } from 'react-icons/ri'
import DefaultPic from '../../../assets/images/default-pic.png'

type PropsType = {
  deviceData: DeviceLogsType | undefined
}

const CardInFoComponent = (props: PropsType) => {
  const { t } = useTranslation()
  const { deviceData } = props

  return (
    <div className='p-5 h-full'>
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
        <div>
          <RiSettings3Line
            size={24}
            className='cursor-pointer hover:fill-primary duration-300'
          />
        </div>
      </div>
      <div className='flex justify-between gap-3 mt-4 h-full'>
        <div className='flex justify-center items-center w-[35%] h-3/4'>
          <img
            src={deviceData?.positionPic ?? DefaultPic}
            alt='Device-image'
            className='rounded-btn w-max h-[85%] object-contain cursor-pointer hover:scale-95 duration-300'
          />
        </div>
        <div className='w-[60%] h-3/4 p-1'>
          <div className='flex items-center gap-3'>
            <p className='font-bold'>•</p>
            <p className='truncate max-w-[150px] lg:max-w-[300px]'>
              {deviceData?.location ?? '—'}
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <p className='font-bold'>• {t('tempValueUnit')}:</p>
            <p className='truncate max-w-[150px] lg:max-w-[300px]'>
              {deviceData?.probe[0]?.tempMin ?? '—'} -{' '}
              {deviceData?.probe[0]?.tempMax ?? '—'} °C
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <p className='font-bold'>• {t('humValueUnit')}:</p>
            <p className='truncate max-w-[150px] lg:max-w-[300px]'>
              {deviceData?.probe[0]?.humiMin ?? '—'} -{' '}
              {deviceData?.probe[0]?.humiMax ?? '—'} %
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <p className='font-bold'>• {t('ipAddress')}:</p>
            <p className='truncate max-w-[150px] lg:max-w-[300px]'>
              {deviceData?.config.ip ?? '—'}
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <p className='font-bold'>• {t('macAddress')}:</p>
            <p className='truncate max-w-[150px] lg:max-w-[300px]'>
              {deviceData?.config.mac ?? '—'}
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <p className='font-bold'>• {t('firmWareVer')}:</p>
            <p className='truncate max-w-[150px] lg:max-w-[300px]'>
              {deviceData?.firmware ?? '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardInFoComponent
