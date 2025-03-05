import { useTranslation } from 'react-i18next'
import { DeviceLogTms } from '../../../../types/tms/devices/deviceType'
import {
  RiAlertLine,
  RiDoorClosedLine,
  RiDoorOpenLine,
  RiErrorWarningLine,
  RiPlugLine,
  RiSignalWifi1Line,
  RiSignalWifiOffLine,
  RiTempColdLine
} from 'react-icons/ri'
import { HiOutlineArrowsUpDown } from 'react-icons/hi2'
import { tempOfDayTms } from '../../../../constants/utils/dashboardCardStatus'
// import { GaugeComponent } from 'react-gauge-component'

type PropsType = {
  deviceData: DeviceLogTms | undefined
}

const CardStatusTms = (props: PropsType) => {
  const { t } = useTranslation()
  const { deviceData } = props

  return (
    <>
      <div className='bg-base-100 p-3 rounded-btn w-full h-[140px] overflow-hidden xl:col-span-4'>
        <div className='flex items-center gap-2 h-[30%]'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
              (deviceData?.log &&
                deviceData?.log[0]?.tempValue > deviceData?.maxTemp) ||
              (deviceData?.log &&
                deviceData?.log[0]?.tempValue < deviceData?.minTemp)
                ? 'text-base-content bg-opacity-80 bg-red-500'
                : ''
            }`}
          >
            {(deviceData?.log &&
              deviceData?.log[0]?.tempValue > deviceData?.maxTemp) ||
            (deviceData?.log &&
              deviceData?.log[0]?.tempValue < deviceData?.minTemp) ? (
              <RiErrorWarningLine size={20} />
            ) : (
              <RiTempColdLine size={20} />
            )}
          </div>
          <span>{t('dashProbe')}</span>
        </div>
        <div className='flex flex-col items-center justify-center text-[18px] mt-1 font-bold h-[50%]'>
          <div
            className={
              (deviceData?.log &&
                deviceData?.log[0]?.tempValue > deviceData?.maxTemp) ||
              (deviceData?.log &&
                deviceData?.log[0]?.tempValue < deviceData?.minTemp)
                ? 'text-red-500'
                : ''
            }
          >
            <span>Temp: </span>
            <span>
              {deviceData?.log
                ? deviceData?.log[0]?.tempValue?.toFixed(2)
                : '—'}
            </span>
            <sub> °C</sub>
            {/* {deviceData && deviceData.log.length > 0 && (
              <GaugeComponent
                type='semicircle'
                pointer={{
                  color: '#345243',
                  length: 0.8,
                  width: 15
                }}
                labels={{
                  valueLabel: {
                    formatTextValue: value => value + 'ºC',
                    style: {
                      fill:
                        (deviceData?.log &&
                          deviceData?.log[0]?.tempValue >
                            deviceData?.maxTemp) ||
                        (deviceData?.log &&
                          deviceData?.log[0]?.tempValue < deviceData?.minTemp)
                          ? '#e92a2a'
                          : ''
                    }
                  },
                  tickLabels: {
                    type: 'outer',
                    defaultTickValueConfig: {
                      formatTextValue: (value: any) => value + 'ºC',
                      style: {
                        fontSize: 10
                      }
                    },
                    ticks: [
                      { value: Number(deviceData?.minTemp) },
                      { value: Number(deviceData?.maxTemp) }
                    ]
                  }
                }}
                value={parseFloat(
                  String(deviceData?.log[0]?.tempValue?.toFixed(2))
                )}
                minValue={-40}
                maxValue={120}
              />
            )} */}
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-full h-[140px] xl:col-span-4'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
              deviceData?.log && deviceData?.log[0]?.internet
                ? 'text-base-content bg-opacity-80 bg-red-500'
                : ''
            }`}
          >
            {deviceData?.log && deviceData?.log[0]?.internet ? (
              <RiSignalWifiOffLine size={20} />
            ) : (
              <RiSignalWifi1Line size={20} />
            )}
          </div>
          <span>{t('dashConnect')}</span>
        </div>
        <div
          className={`flex items-center justify-center text-[20px] font-bold h-full ${
            deviceData?.log && deviceData?.log[0]?.internet
              ? 'text-red-500'
              : ''
          }`}
        >
          {deviceData?.log
            ? deviceData?.log[0]?.internet
              ? t('stateDisconnect')
              : t('stateConnect')
            : '—'}
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-full h-[140px] xl:col-span-4'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
              deviceData?.log && deviceData?.log[0]?.door
                ? 'text-base-content bg-opacity-80 bg-red-500'
                : ''
            }`}
          >
            {deviceData?.log && deviceData?.log[0]?.door ? (
              <RiDoorOpenLine size={20} />
            ) : (
              <RiDoorClosedLine size={20} />
            )}
          </div>
          <span>{t('dashDoor')}</span>
        </div>
        <div
          className={`flex items-center justify-center text-[20px] font-bold h-full ${
            deviceData?.log && deviceData?.log[0]?.door ? 'text-red-500' : ''
          }`}
        >
          {deviceData?.log
            ? deviceData?.log[0]?.door
              ? t('doorOpen')
              : t('doorClose')
            : '—'}
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-full h-[140px] xl:col-span-6'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
              deviceData?.log && deviceData?.log[0]?.plugin
                ? 'text-base-content bg-opacity-80 bg-red-500'
                : ''
            }`}
          >
            {deviceData?.log && deviceData?.log[0]?.plugin ? (
              <RiAlertLine size={20} />
            ) : (
              <RiPlugLine size={20} />
            )}
          </div>
          <span>{t('dashPlug')}</span>
        </div>
        <div
          className={`flex items-center justify-center text-[20px] font-bold h-full ${
            deviceData?.log && deviceData?.log[0]?.plugin ? 'text-red-500' : ''
          }`}
        >
          {deviceData?.log
            ? deviceData?.log[0]?.plugin
              ? t('stateProblem')
              : t('stateNormal')
            : '—'}
        </div>
      </div>
      <div className='bg-base-100 p-3 rounded-btn w-full h-[140px] overflow-hidden xl:col-span-6'>
        <div className='flex items-center gap-2 h-[30%]'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]`}
          >
            <HiOutlineArrowsUpDown size={20} />
          </div>
          <label
            htmlFor='span'
            className='tooltip tooltip-bottom'
            data-tip={t('dashTempofDay')}
          >
            <span className='truncate block max-w-[55px] lg:max-w-[200px]'>
              {t('dashTempofDay')}
            </span>
          </label>
        </div>
        <div className='flex flex-col items-center justify-center text-[18px] mt-1 font-bold h-[50%]'>
          <div>
            <span>↑ </span>
            <span>{tempOfDayTms(deviceData)?.max ?? '—'} °C</span>
          </div>
          <div>
            <span>↓</span>
            <span>{tempOfDayTms(deviceData)?.max ?? '—'} °C</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default CardStatusTms
