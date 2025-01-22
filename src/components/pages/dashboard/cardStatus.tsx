import { useTranslation } from 'react-i18next'
import {
  RiAlertLine,
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
import { MdOutlineSdCard, MdOutlineSdCardAlert } from 'react-icons/md'
import { HiOutlineArrowsUpDown } from 'react-icons/hi2'
import {
  battertyLevel,
  doorOpen,
  humiLimit,
  probeLimitIcon,
  sdCard,
  tempLimit,
  tempOfDay,
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
                  <div
                    className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
                      probeLimitIcon(
                        item.tempMin,
                        item.tempMax,
                        findItem?.tempDisplay,
                        item.humiMin,
                        item.humiMax,
                        findItem?.humidityDisplay
                      )
                        ? 'text-red-500 bg-opacity-50 bg-red-300'
                        : ''
                    }`}
                  >
                    {probeLimitIcon(
                      item.tempMin,
                      item.tempMax,
                      findItem?.tempDisplay,
                      item.humiMin,
                      item.humiMax,
                      findItem?.humidityDisplay
                    ) ? (
                      <RiErrorWarningLine size={20} />
                    ) : (
                      <RiTempColdLine size={20} />
                    )}
                  </div>
                  <span>{t('dashProbe')}</span>
                  <span className='badge badge-primary badge-outline font-bold border-2'>
                    P{item.channel}
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
                {probeLimitIcon(0, 0, 0, 0, 0, 0) ? (
                  <RiErrorWarningLine size={20} />
                ) : (
                  <RiTempColdLine size={20} />
                )}
              </div>
              <span>{t('dashProbe')}</span>
              <span className='badge badge-primary badge-outline font-bold border-2'>
                P2
              </span>
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
                {probeLimitIcon(0, 0, 0, 0, 0, 0) ? (
                  <RiErrorWarningLine size={20} />
                ) : (
                  <RiTempColdLine size={20} />
                )}
              </div>
              <span>{t('dashProbe')}</span>
              <span className='badge badge-primary badge-outline font-bold border-2'>
                P3
              </span>
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
              <RiSignalWifiOffLine size={20} />
            ) : (
              <RiSignalWifi1Line size={20} />
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
            {doorOpen(deviceData) ? (
              <RiDoorOpenLine size={20} />
            ) : (
              <RiDoorClosedLine size={20} />
            )}
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
            {unPlug(deviceData) ? (
              <RiAlertLine size={20} />
            ) : (
              <RiPlugLine size={20} />
            )}
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
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
              deviceData?.log
                ? deviceData?.log[0]?.battery <= 20
                  ? 'text-yellow-500 bg-opacity-50 bg-yellow-300'
                  : deviceData?.log[0]?.battery <= 0
                  ? 'text-red-500 bg-opacity-50 bg-red-300'
                  : ''
                : ''
            }`}
          >
            {battertyLevel(deviceData)}
          </div>
          <span>{t('dashBattery')}</span>
        </div>
        <div
          className={`flex items-center justify-center text-[18px] font-bold h-full ${
            deviceData?.log
              ? deviceData?.log[0]?.battery <= 20
                ? 'text-yellow-500'
                : deviceData?.log[0]?.battery <= 0
                ? 'text-red-500'
                : ''
              : ''
          }`}
        >
          {deviceData?.log[0]?.battery
            ? `${deviceData?.log[0]?.battery} %`
            : '—'}
        </div>
      </div>
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
                  <div
                    className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
                      probeLimitIcon(
                        item.tempMin,
                        item.tempMax,
                        findItem?.tempDisplay,
                        item.humiMin,
                        item.humiMax,
                        findItem?.humidityDisplay
                      )
                        ? 'text-red-500 bg-opacity-50 bg-red-300'
                        : ''
                    }`}
                  >
                    <HiOutlineArrowsUpDown size={20} />
                  </div>
                  <span
                    title={t('dashTempofDay')}
                    className='truncate max-w-[80px]'
                  >
                    {t('dashTempofDay')}
                  </span>
                  <span className='badge badge-primary badge-outline font-bold border-2'>
                    P{item.channel}
                  </span>
                </div>
                <div className='flex flex-col items-center justify-center text-[18px] mt-1 font-bold h-[50%]'>
                  <div>
                    <span>↑ </span>
                    <span>
                      {deviceData?.log
                        ? tempOfDay(deviceData, item.channel).max
                        : '—'}{' '}
                      °C
                    </span>
                  </div>
                  <div>
                    <span>↓</span>
                    <span>
                      {deviceData?.log
                        ? tempOfDay(deviceData, item.channel).max
                        : '—'}{' '}
                      °C
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
          {deviceData?.probe.map((item, index) => {
            const findItem = deviceData.log.find(itemTwo =>
              itemTwo.probe.includes(item.channel)
            )
            return (
              <SwiperSlide className='p-3 h-full bg-base-100' key={index}>
                <div className='flex items-center gap-2 h-[30%]'>
                  <div
                    className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
                      probeLimitIcon(
                        item.tempMin,
                        item.tempMax,
                        findItem?.tempDisplay,
                        item.humiMin,
                        item.humiMax,
                        findItem?.humidityDisplay
                      )
                        ? 'text-red-500 bg-opacity-50 bg-red-300'
                        : ''
                    }`}
                  >
                    <HiOutlineArrowsUpDown size={20} />
                  </div>
                  <span
                    title={t('dashTempofDay')}
                    className='truncate max-w-[80px]'
                  >
                    {t('dashTempofDay')}
                  </span>
                  <span className='badge badge-primary badge-outline font-bold border-2'>
                    P2
                  </span>
                </div>
                <div className='flex flex-col items-center justify-center text-[18px] mt-1 font-bold h-[50%]'>
                  <div>
                    <span>↑ </span>
                    <span>
                      {deviceData?.log
                        ? tempOfDay(deviceData, item.channel).max
                        : '—'}{' '}
                      °C
                    </span>
                  </div>
                  <div>
                    <span>↓</span>
                    <span>
                      {deviceData?.log
                        ? tempOfDay(deviceData, item.channel).max
                        : '—'}{' '}
                      °C
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
          {deviceData?.probe.map((item, index) => {
            const findItem = deviceData.log.find(itemTwo =>
              itemTwo.probe.includes(item.channel)
            )
            return (
              <SwiperSlide className='p-3 h-full bg-base-100' key={index}>
                <div className='flex items-center gap-2 h-[30%]'>
                  <div
                    className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
                      probeLimitIcon(
                        item.tempMin,
                        item.tempMax,
                        findItem?.tempDisplay,
                        item.humiMin,
                        item.humiMax,
                        findItem?.humidityDisplay
                      )
                        ? 'text-red-500 bg-opacity-50 bg-red-300'
                        : ''
                    }`}
                  >
                    <HiOutlineArrowsUpDown size={20} />
                  </div>
                  <span
                    title={t('dashTempofDay')}
                    className='truncate max-w-[80px]'
                  >
                    {t('dashTempofDay')}
                  </span>
                  <span className='badge badge-primary badge-outline font-bold border-2'>
                    P3
                  </span>
                </div>
                <div className='flex flex-col items-center justify-center text-[18px] mt-1 font-bold h-[50%]'>
                  <div>
                    <span>↑ </span>
                    <span>
                      {deviceData?.log
                        ? tempOfDay(deviceData, item.channel).max
                        : '—'}{' '}
                      °C
                    </span>
                  </div>
                  <div>
                    <span>↓</span>
                    <span>
                      {deviceData?.log
                        ? tempOfDay(deviceData, item.channel).max
                        : '—'}{' '}
                      °C
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-[170px] lg:w-[185px] h-[140px]'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
              sdCard(deviceData) ? 'text-red-500 bg-opacity-50 bg-red-300' : ''
            }`}
          >
            {sdCard(deviceData) ? (
              <MdOutlineSdCardAlert size={20} />
            ) : (
              <MdOutlineSdCard size={20} />
            )}
          </div>
          <span>{t('dashSdCard')}</span>
        </div>
        <div
          className={`flex items-center justify-center text-[18px] font-bold h-full ${
            sdCard(deviceData) ? 'text-red-500' : ''
          }`}
        >
          {sdCard(deviceData) ? t('stateProblem') : t('stateNormal')}
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-[170px] lg:w-[185px] h-[140px]'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]'>
            <RiCollageLine size={20} />
          </div>
          <span>{t('dashProbeandDoor')}</span>
        </div>
        <div className='flex items-center justify-center gap-3 text-[18px] font-bold h-full'>
          <span>
            {[...new Set(deviceData?.probe.map(item => item.channel))].length ??
              '—'}
          </span>
          <div className='w-[3px] h-7 py-2 bg-primary rounded-btn'></div>
          <span>
            {deviceData?.probe.find(item => item.doorQty)?.doorQty ?? '—'}
          </span>
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-[170px] lg:w-[185px] h-[140px]'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]'>
            <RiShieldCheckLine size={20} />
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
            <RiFolderSettingsLine size={20} />
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
