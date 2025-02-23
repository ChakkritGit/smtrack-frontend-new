import { useTranslation } from 'react-i18next'
import { DeviceLogsType } from '../../../../types/smtrack/devices/deviceType'
import { RiSettings3Line } from 'react-icons/ri'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCreative, Pagination } from 'swiper/modules'
import DefaultPic from '../../../../assets/images/default-pic.png'

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
        <button
          className='btn btn-ghost flex p-0 min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] duration-300 tooltip tooltip-left'
          data-tip={t('adjustMents')}
        >
          <RiSettings3Line size={24} />
        </button>
      </div>
      <div className='flex justify-between flex-col lg:flex-row gap-3 mt-4 h-full'>
        <div className='flex justify-center items-center w-full lg:w-[35%] h-3/4'>
          <img
            src={deviceData?.positionPic ?? DefaultPic}
            alt='Device-image'
            className='rounded-btn w-max h-[85%] object-contain cursor-pointer hover:scale-95 duration-300'
          />
        </div>
        <div className='w-full lg:w-[60%] h-3/4 p-1'>
          <Swiper
            slidesPerView={'auto'}
            spaceBetween={100}
            centeredSlides={true}
            loop={deviceData?.probe && deviceData?.probe.length > 2}
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
              waitForTransition: false
            }}
            // pagination={{
            //   dynamicBullets: true,
            //   clickable: true
            // }}
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
            className='mySwiper'
          >
            {deviceData ? (
              deviceData?.probe?.map(item => {
                return (
                  <SwiperSlide key={item.id}>
                    <span className='badge badge-primary bg-opacity-15 text-primary font-bold border-2 mb-2'>
                      P{item.channel}
                    </span>
                    <div className='flex items-center gap-3'>
                      <p className='font-bold'>• {t('tempValueUnit')}:</p>
                      <p className='truncate max-w-[150px] lg:max-w-[300px]'>
                        {item.tempMin ?? '—'} / {item.tempMax ?? '—'} °C
                      </p>
                    </div>
                    <div className='flex items-center gap-3'>
                      <p className='font-bold'>• {t('humValueUnit')}:</p>
                      <p className='truncate max-w-[150px] lg:max-w-[300px]'>
                        {item.humiMin ?? '—'} / {item.humiMax ?? '—'} %
                      </p>
                    </div>
                  </SwiperSlide>
                )
              })
            ) : (
              <SwiperSlide>
                <span className='badge badge-primary bg-opacity-15 text-primary font-bold border-2 mb-2'>
                  P—
                </span>
                <div className='flex items-center gap-3'>
                  <p className='font-bold'>• {t('tempValueUnit')}:</p>
                  <p className='truncate max-w-[150px] lg:max-w-[300px]'>
                    — / — °C
                  </p>
                </div>
                <div className='flex items-center gap-3'>
                  <p className='font-bold'>• {t('humValueUnit')}:</p>
                  <p className='truncate max-w-[150px] lg:max-w-[300px]'>
                    — / — %
                  </p>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
          <div className='flex items-center gap-3'>
            <p className='font-bold'>•</p>
            <p className='truncate max-w-[150px] lg:max-w-[300px]'>
              {deviceData?.location ?? '—'}
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <p className='font-bold'>• {t('ipAddress')}:</p>
            <p className='truncate max-w-[150px] lg:max-w-[300px]'>
              {deviceData?.config?.ip ?? '—'}
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <p className='font-bold'>• {t('macAddress')}:</p>
            <p className='truncate max-w-[150px] lg:max-w-[300px]'>
              {deviceData?.config?.mac ?? '—'}
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
