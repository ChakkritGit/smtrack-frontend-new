import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCreative, Pagination } from 'swiper/modules'
import { DeviceLogsType } from '../../../types/smtrack/devices/deviceType'
import ChartMini from './chartMini'
import { useTranslation } from 'react-i18next'
import { RiFullscreenLine, RiPlayLine, RiStopLine } from 'react-icons/ri'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Swiper as SwiperType } from 'swiper/types'
import { test } from '../../../constants/utils/dashboardCardStatus'

interface ChartSwiperWrapperProps {
  deviceLogs: DeviceLogsType | undefined
}

const ChartSwiperWrapper = (props: ChartSwiperWrapperProps) => {
  const { t } = useTranslation()
  const { deviceLogs } = props
  const [isPause, setIsPaused] = useState(false)
  const swiperRef = useRef<SwiperType>(null)

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev)
    if (swiperRef.current) {
      if (isPause) {
        swiperRef.current.autoplay.start()
      } else {
        swiperRef.current.autoplay.stop()
      }
    }
  }, [isPause])

  const SwiperFragment = useMemo(() => {
    return (
      <Swiper
        onSwiper={swiper => (swiperRef.current = swiper)}
        slidesPerView={'auto'}
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        pagination={{
          dynamicBullets: true,
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
        {deviceLogs?.probe.map((item, index) => {
          const filterItem = deviceLogs.log.filter(itemTwo =>
            itemTwo.probe.includes(item.channel)
          )
          return (
            <SwiperSlide key={index}>
              <span className='badge badge-primary bg-opacity-15 text-primary font-bold border-2 ml-3'>
                P{item.channel}
              </span>
              <ChartMini
                logData={filterItem.slice(0, 80)}
                tempMin={item.tempMin}
                tempMax={item.tempMax}
              />
            </SwiperSlide>
          )
        })}
        <SwiperSlide key={2}>
          <span className='badge badge-primary bg-opacity-15 text-primary font-bold border-2 ml-3'>
            P{2}
          </span>
          <ChartMini logData={test} tempMin={-5} tempMax={38} />
        </SwiperSlide>
        <SwiperSlide key={3}>
          <span className='badge badge-primary bg-opacity-15 text-primary font-bold border-2 ml-3'>
            P{3}
          </span>
          <ChartMini logData={test} tempMin={-3} tempMax={37} />
        </SwiperSlide>
      </Swiper>
    )
  }, [isPause, deviceLogs])

  return (
    <div className='flex flex-col gap-3 bg-base-100 w-full h-full rounded-btn p-3'>
      <div className='flex items-center justify-between px-3'>
        <div className='flex items-center gap-3'>
          <span className='text-[20px] font-bold'>{t('pageChart')}</span>
          <button
            className='btn btn-primary bg-opacity-15 text-primary border-primary border-2 p-0 hover:opacity-50 hover:border-primary hover:bg-transparent duration-300 max-h-[28px] min-h-[28px] max-w-[28px] min-w-[28px]'
            onClick={togglePause}
          >
            {isPause ? <RiPlayLine size={20} /> : <RiStopLine size={20} />}
          </button>
        </div>
        <button className='btn btn-ghost p-0 duration-300 max-h-[34px] min-h-[34px] max-w-[34px] min-w-[34px]'>
          <RiFullscreenLine size={20} />
        </button>
      </div>
      <div className='h-full chart-h'>{SwiperFragment}</div>
    </div>
  )
}

export default ChartSwiperWrapper
