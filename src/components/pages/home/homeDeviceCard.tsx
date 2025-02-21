import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DeviceType } from '../../../types/smtrack/devices/deviceType'
import DevicePagination from '../../pagination/devicePagination'
import {
  RiAlertLine,
  RiBatteryChargeLine,
  RiBatteryFill,
  RiBatteryLine,
  RiBatteryLowLine,
  RiDashboardLine,
  RiDoorClosedLine,
  RiDoorOpenLine,
  RiErrorWarningLine,
  RiSettings3Line,
  RiTempColdLine
} from 'react-icons/ri'
import Default from '../../../assets/images/default-pic.png'
import { ProbeType } from '../../../types/smtrack/probe/probeType'
import { DeviceLogType } from '../../../types/smtrack/logs/deviceLog'
import { TbPlug, TbPlugX } from 'react-icons/tb'
import { MdOutlineSdCard, MdOutlineSdCardAlert } from 'react-icons/md'
import { cookieOptions, cookies } from '../../../constants/utils/utilsConstants'
import { setDeviceKey } from '../../../redux/actions/utilsActions'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

interface DeviceCardProps {
  devicesFiltered: DeviceType[]
  handlePageChange: (page: number) => void
  handlePerRowsChange: (newPerPage: number, page: number) => Promise<void>
  loading: boolean
  openAdjustModal: (probe: ProbeType[], sn: string) => void
}

const HomeDeviceCard = (props: DeviceCardProps) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { devicesFiltered, handlePageChange, handlePerRowsChange, loading, openAdjustModal } =
    props

  const doorComponent = (probe: ProbeType[], log: DeviceLogType[]) => {
    return (
      <>
        {Array.from({ length: probe[0]?.doorQty || 1 }, (_, index) => {
          const doorKey = `door${index + 1}` as keyof DeviceLogType
          const doorLog = log[0]?.[doorKey]
          return (
            <div
              className={`border border-base-content/50 w-[32px] h-[32px] rounded-btn flex items-center justify-center tooltip tooltip-top ${
                doorLog ? 'bg-red-500 text-white border-none' : ''
              }`}
              data-tip={`${t('deviceDoor')} ${index + 1}`}
              key={index}
            >
              {doorLog ? (
                <RiDoorOpenLine size={20} />
              ) : (
                <RiDoorClosedLine size={20} />
              )}
            </div>
          )
        })}
      </>
    )
  }

  const handleRowClicked = (row: DeviceType) => {
    cookies.set('deviceKey', row.id, cookieOptions) // it's mean setSerial
    dispatch(setDeviceKey(row.id))
    navigate('/dashboard')
    window.scrollTo(0, 0)
  }

  const UserCard = useMemo(() => {
    if (devicesFiltered?.length > 0) {
      return (
        <DevicePagination
          data={devicesFiltered}
          initialPerPage={10}
          itemPerPage={[10, 20, 50, 100, 150, 200]}
          handlePageChange={handlePageChange}
          handlePerRowsChange={handlePerRowsChange}
          loading={loading}
          renderItem={(item, index) => (
            <div
              key={index}
              className='w-full h-[356px] md:w-[280px] lg:w-[230px] xl:w-[260px] bg-base-100 rounded-btn shadow-sm p-4'
            >
              <div className='flex items-start justify-between'>
                <div className='avatar'>
                  <div className='w-28 rounded-btn'>
                    <img src={item.positionPic ?? Default} />
                  </div>
                </div>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-1'>
                    <button
                      className='btn btn-ghost flex p-0 min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] duration-300 tooltip tooltip-left'
                      data-tip={t('sideDashboard')}
                      onClick={() => handleRowClicked(item)}
                    >
                      <RiDashboardLine size={24} />
                    </button>
                    <button
                      className='btn btn-ghost flex p-0 min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] duration-300 tooltip tooltip-left'
                      data-tip={t('adjustMents')}
                      onClick={() => openAdjustModal(item.probe, item.id)}
                    >
                      <RiSettings3Line size={24} />
                    </button>
                  </div>
                  <div
                    className={`badge text-white border-none h-[30px] ${
                      item.status ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {item.status ? t('deviceOnline') : t('deviceOffline')}
                  </div>
                </div>
              </div>
              <div className='mt-3 truncate'>
                <span className='text-[20px]'>{item.name ?? '—'}</span>
              </div>
              <div className='truncate'>
                <span className='text-[14px]'>{item.id ?? '—'}</span>
              </div>
              <div className='truncate'>
                <span className='text-[14px]'>{item.location ?? '—'}</span>
              </div>
              <div className='flex items-center gap-2 w-max mt-2'>
                {doorComponent(item.probe, item.log)}
              </div>
              <div className='flex items-center gap-2 mt-2'>
                <div
                  className='flex items-center justify-center text-[14px] h-[32px] w-max px-1 min-w-[30px] border border-base-content/50 rounded-btn tooltip tooltip-top'
                  data-tip={t('devicTemperatureTb')}
                >
                  {item.log[0]?.tempDisplay ?? '—'} <sub>°C</sub>
                </div>
                <div
                  className='flex items-center justify-center text-[14px] h-[32px] w-max px-1 min-w-[30px] border border-base-content/50 rounded-btn tooltip tooltip-top'
                  data-tip={t('deviceHumiTb')}
                >
                  {item.log[0]?.humidityDisplay ?? '—'} <sub>%</sub>
                </div>
                <div
                  className='flex items-center justify-center text-[14px] h-[32px] w-max px-1 min-w-[30px] border border-base-content/50 rounded-btn tooltip tooltip-top'
                  data-tip={t('deviceTime')}
                >
                  {item.log[0]?.sendTime.substring(11, 16) ?? '—'}
                </div>
              </div>
              <div className='flex items-center gap-2 mt-2'>
                <div
                  className={`${
                    item.log[0]?.tempDisplay >= item.probe[0]?.tempMax ||
                    item.log[0]?.tempDisplay <= item.probe[0]?.tempMin
                      ? 'bg-red-500 border-red-500'
                      : ''
                  } flex items-center justify-center text-[14px] h-[32px] min-w-[30px] w-max px-1 border border-base-content/50 rounded-btn tooltip tooltip-top`}
                  data-tip={t('deviceProbe')}
                >
                  {item.log[0]?.tempDisplay >= item.probe[0]?.tempMax ||
                  item.log[0]?.tempDisplay <= item.probe[0]?.tempMin ? (
                    <RiErrorWarningLine size={20} />
                  ) : (
                    <RiTempColdLine size={20} />
                  )}
                </div>
                <div
                  className={`${
                    item.log[0]?.plug ? 'bg-red-500 border-red-500' : ''
                  } flex items-center justify-center text-[14px] h-[32px] min-w-[30px] w-max px-1 border border-base-content/50 rounded-btn tooltip tooltip-top`}
                  data-tip={t('devicePlug')}
                >
                  {item.log[0]?.plug ? (
                    <TbPlugX size={20} />
                  ) : (
                    <TbPlug size={20} />
                  )}
                </div>
                <div
                  className={`${item.log[0]?.extMemory ? 'bg-red-500 border-red-500' : ''} flex items-center justify-center text-[14px] h-[32px] min-w-[30px] w-max px-1 border border-base-content/50 rounded-btn tooltip tooltip-top`}
                  data-tip={t('dashSdCard')}
                >
                  {item.log[0]?.extMemory ? (
                    <MdOutlineSdCardAlert size={20} />
                  ) : (
                    <MdOutlineSdCard size={20} />
                  )}
                </div>
                <div
                  className={`${item.log[0]?.battery <= 20 ? 'bg-yellow-500 border-yellow-500 text-white' : item.log[0]?.battery === 0 ?  'bg-red-500 border-red-500 text-white' : ''} flex items-center justify-center gap-1 text-[14px] h-[32px] min-w-[30px] w-max px-1 border border-base-content/50 rounded-btn tooltip tooltip-top`}
                  data-tip={t('deviceBatteryTb')}
                >
                  <div>
                    {!item.log[0]?.plug ? (
                      <RiBatteryChargeLine size={20} />
                    ) : item.log[0]?.battery === 0 ? (
                      <RiBatteryLine size={20} />
                    ) : item.log[0]?.battery <= 50 ? (
                      <RiBatteryLowLine size={20} />
                    ) : item.log[0]?.battery <= 100 ? (
                      <RiBatteryFill size={20} />
                    ) : (
                      <RiAlertLine size={20} />
                    )}
                  </div>
                  <span>
                    {item.log[0]?.battery ?? '—'} <sub>%</sub>
                  </span>
                </div>
              </div>
            </div>
          )}
        />
      )
    } else {
      return (
        <div className='flex items-center justify-center loading-hieght-full'>
          <div>{t('nodata')}</div>
        </div>
      )
    }
  }, [devicesFiltered, t, loading])

  return <div>{UserCard}</div>
}

export default HomeDeviceCard
