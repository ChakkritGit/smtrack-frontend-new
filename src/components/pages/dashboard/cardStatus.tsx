import { useTranslation } from 'react-i18next'
import {
  RiAlertLine,
  RiBatteryChargeLine,
  RiCollageLine,
  RiDoorClosedLine,
  RiDoorOpenLine,
  RiErrorWarningLine,
  RiFolderSettingsLine,
  RiPlugLine,
  RiShieldCheckLine,
  RiSignalWifi1Line,
  RiSignalWifiOffLine,
  RiTempColdLine
} from 'react-icons/ri'
import { MdOutlineSdCard } from 'react-icons/md'
import { HiOutlineArrowsUpDown } from 'react-icons/hi2'
import {
  doorOpen,
  humiLimit,
  probeLimitIcon,
  tempLimit,
  unPlug
} from '../../../constants/utils/dashboardCardStatus'
import { DeviceLogsType } from '../../../types/smtrack/devices/deviceType'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectCreative } from 'swiper/modules'

type PropsType = {
  deviceData: DeviceLogsType | undefined
}

const CardStatus = (props: PropsType) => {
  const { t } = useTranslation()
  const { deviceData } = props

  return (
    <>
      <div className='bg-base-100 rounded-btn w-[170px] lg:w-[185px] h-[140px] overflow-hidden'>
        <Swiper
          slidesPerView={'auto'}
          spaceBetween={30}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 8000,
            disableOnInteraction: false
          }}
          pagination={{
            clickable: true
          }}
          effect={'creative'}
          creativeEffect={{
            prev: {
              shadow: false,
              translate: ['-120%', 0, -500]
            },
            next: {
              shadow: false,
              translate: ['120%', 0, -500]
            }
          }}
          modules={[Autoplay, Pagination, EffectCreative]}
          className='mySwiper h-full'
        >
          {deviceData?.probe.map((item, index) => {
            const findItem = deviceData.log.find(itemTwo =>
              itemTwo.probe.includes(item.channel)
            )
            return (
              <SwiperSlide className='p-3 h-full bg-base-100' key={index}>
                <div className='flex items-center gap-2 h-[30%]'>
                  <div className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${probeLimitIcon(
                      item.tempMin,
                      item.tempMax,
                      findItem?.tempDisplay,
                      item.humiMin,
                      item.humiMax,
                      findItem?.humidityDisplay
                    ) ? 'text-red-500 bg-opacity-50 bg-red-300' : ''}`}>
                    {probeLimitIcon(
                      item.tempMin,
                      item.tempMax,
                      findItem?.tempDisplay,
                      item.humiMin,
                      item.humiMax,
                      findItem?.humidityDisplay
                    ) ? (
                      <RiErrorWarningLine />
                    ) : (
                      <RiTempColdLine />
                    )}
                  </div>
                  <span>{t('dashProbe')}</span>
                  <span className='badge badge-primary badge-outline'>
                    {item.channel}
                  </span>
                </div>
                <div className='flex flex-col items-center justify-center text-[18px] mt-1 font-bold h-[50%]'>
                  <div
                    className={
                      tempLimit(
                        item.tempMin,
                        item.tempMax,
                        findItem?.tempDisplay
                      )
                        ? 'text-red-500'
                        : ''
                    }
                  >
                    <span>Temp: </span>
                    <span>{findItem?.tempDisplay.toFixed(2) ?? '—'}</span>
                    <sub> °C</sub>
                  </div>
                  <div
                    className={
                      humiLimit(
                        item.humiMin,
                        item.humiMax,
                        findItem?.humidityDisplay
                      )
                        ? 'text-red-500'
                        : ''
                    }
                  >
                    <span>Humi: </span>
                    <span>{findItem?.humidityDisplay.toFixed(2) ?? '—'}</span>
                    <sub> %RH</sub>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
          <SwiperSlide className='p-3 h-full bg-base-100' key={2}>
            <div className='flex items-center gap-2 h-[30%]'>
              <div className='flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]'>
                {probeLimitIcon(0, 0, 0, 0, 0, 0)}
              </div>
              <span>{t('dashProbe')}</span>
              <span className='badge badge-primary badge-outline'>2</span>
            </div>
            <div className='flex flex-col items-center justify-center text-[18px] mt-1 font-bold h-[50%]'>
              <div>
                <span>Temp: </span>
                <span>0.00</span>
                <sub> °C</sub>
              </div>
              <div>
                <span>Humi: </span>
                <span>0.00</span>
                <sub> %RH</sub>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className='p-3 h-full bg-base-100' key={3}>
            <div className='flex items-center gap-2 h-[30%]'>
              <div className='flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]'>
                {probeLimitIcon(0, 0, 0, 0, 0, 0)}
              </div>
              <span>{t('dashProbe')}</span>
              <span className='badge badge-primary badge-outline'>3</span>
            </div>
            <div className='flex flex-col items-center justify-center text-[18px] mt-1 font-bold h-[50%]'>
              <div>
                <span>Temp: </span>
                <span>—</span>
                <sub> °C</sub>
              </div>
              <div>
                <span>Humi: </span>
                <span>—</span>
                <sub> %RH</sub>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-[170px] lg:w-[185px] h-[140px]'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
              deviceData?.online ? 'text-red-500 bg-opacity-50 bg-red-300' : ''
            }`}
          >
            {deviceData?.online ? (
              <RiSignalWifiOffLine />
            ) : (
              <RiSignalWifi1Line />
            )}
          </div>
          <span>{t('dashConnect')}</span>
        </div>
        <div
          className={`flex items-center justify-center text-[20px] font-bold h-full ${
            deviceData?.online ? 'text-red-500' : ''
          }`}
        >
          {deviceData?.online ? t('stateDisconnect') : t('stateConnect')}
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-[170px] lg:w-[185px] h-[140px]'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
              doorOpen(deviceData)
                ? 'text-red-500 bg-opacity-50 bg-red-300'
                : ''
            }`}
          >
            {doorOpen(deviceData) ? <RiDoorOpenLine /> : <RiDoorClosedLine />}
          </div>
          <span>{t('dashDoor')}</span>
        </div>
        <div
          className={`flex items-center justify-center text-[20px] font-bold h-full ${
            doorOpen(deviceData) ? 'text-red-500' : ''
          }`}
        >
          {doorOpen(deviceData) ? t('doorOpen') : t('doorClose')}
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-[170px] lg:w-[185px] h-[140px]'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
              unPlug(deviceData) ? 'text-red-500 bg-opacity-50 bg-red-300' : ''
            }`}
          >
            {unPlug(deviceData) ? <RiAlertLine /> : <RiPlugLine />}
          </div>
          <span>{t('dashPlug')}</span>
        </div>
        <div
          className={`flex items-center justify-center text-[18px] font-bold h-full ${
            unPlug(deviceData) ? 'text-red-500' : ''
          }`}
        >
          {unPlug(deviceData) ? t('stateProblem') : t('stateNormal')}
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-[170px] lg:w-[185px] h-[140px]'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]'>
            <RiBatteryChargeLine />
          </div>
          <span>{t('dashBattery')}</span>
        </div>
        <div className='flex items-center justify-center text-[18px] font-bold h-full'>
          0
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-[170px] lg:w-[185px] h-[140px]'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]'>
            <HiOutlineArrowsUpDown />
          </div>
          <span>{t('dashTempofDay')}</span>
        </div>
        <div className='flex items-center justify-center text-[18px] font-bold h-full'>
          0
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-[170px] lg:w-[185px] h-[140px]'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]'>
            <MdOutlineSdCard />
          </div>
          <span>{t('dashSdCard')}</span>
        </div>
        <div className='flex items-center justify-center text-[18px] font-bold h-full'>
          0
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-[170px] lg:w-[185px] h-[140px]'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]'>
            <RiCollageLine />
          </div>
          <span>{t('dashProbeandDoor')}</span>
        </div>
        <div className='flex items-center justify-center text-[18px] font-bold h-full'>
          0
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-[170px] lg:w-[185px] h-[140px]'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]'>
            <RiShieldCheckLine />
          </div>
          <span>{t('dashWarranty')}</span>
        </div>
        <div className='flex items-center justify-center text-[18px] font-bold h-full'>
          0
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-[170px] lg:w-[185px] h-[140px]'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]'>
            <RiFolderSettingsLine />
          </div>
          <span>{t('dashRepair')}</span>
        </div>
        <div className='flex items-center justify-center text-[18px] font-bold h-full'>
          0
        </div>
      </div>
    </>
  )
}

export default CardStatus
