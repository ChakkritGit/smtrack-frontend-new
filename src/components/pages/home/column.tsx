import { TFunctionNonStrict } from 'i18next'
import { DeviceType } from '../../../types/smtrack/devices/deviceType'
import { TableColumn } from 'react-data-table-component'
import {
  RiDoorClosedLine,
  RiDoorOpenLine,
  RiErrorWarningLine,
  RiSettings3Line,
  RiTempColdLine
} from 'react-icons/ri'
import { DoorKey } from '../../../types/global/doorQty'
import { calulateDate } from '../../../constants/utils/utilsConstants'
import { ProbeType } from '../../../types/smtrack/probe/probeType'

const columnData = (
  t: TFunctionNonStrict<'translation', undefined>,
  handleRowClicked: (row: DeviceType) => void,
  openAdjustModal: (probe: ProbeType[], sn: string) => void
): TableColumn<DeviceType>[] => {
  return [
    {
      name: t('deviceSerialTb'),
      cell: item => (
        <span
          className='tooltip'
          data-tip={item.id}
          onClick={() => handleRowClicked(item)}
        >
          {item.id}
        </span>
      ),
      sortable: false,
      center: true,
      width: '200px'
    },
    {
      name: t('deviceNameTb'),
      cell: item => (
        <div
          className='tooltip'
          data-tip={item.name ?? '—'}
          onClick={() => handleRowClicked(item)}
        >
          <span className='truncate max-w-[150px]'>{item.name ?? '—'}</span>
        </div>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('deviceLocationTb'),
      cell: item => (
        <div
          className='tooltip'
          data-tip={item.location ?? '—'}
          onClick={() => handleRowClicked(item)}
        >
          <span className='truncate max-w-[100px]'>{item.location ?? '—'}</span>
        </div>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('devicTemperatureTb'),
      selector: item =>
        item.log[0]?.tempDisplay
          ? `${item.log[0]?.tempDisplay.toFixed(2)}°C`
          : '—',
      sortable: false,
      center: true
    },
    {
      name: t('deviceHumiTb'),
      selector: item =>
        item.log[0]?.humidityDisplay
          ? `${item.log[0]?.humidityDisplay.toFixed(2)}%`
          : '—',
      sortable: false,
      center: true
    },
    {
      name: t('deviceProbeTb'),
      cell: item => {
        const [temp] = item.log.filter(log => log.serial === item.id)
        const [probe] = item.probe.filter(probe => probe.sn === item.id)
        const isTempOutOfRange =
          temp?.tempDisplay >= probe?.tempMax ||
          temp?.tempDisplay <= probe?.tempMin

        return (
          <div
            className={`w-[24px] h-[24px] flex items-center justify-center rounded-btn ${
              isTempOutOfRange
                ? 'bg-red-500 text-white'
                : 'border border-primary text-primary'
            } duration-300`}
          >
            {isTempOutOfRange ? (
              <RiErrorWarningLine size={14} />
            ) : (
              <RiTempColdLine size={14} />
            )}
          </div>
        )
      },
      sortable: false,
      center: true
    },
    {
      name: t('deviceDoorTb'),
      cell: item => {
        const doorCount: number = item.probe[0]?.doorQty || 1
        const doors: DoorKey[] = ['door1', 'door2', 'door3']

        return (
          <>
            {doors.slice(0, doorCount).map(doorKey => (
              <div
                key={doorKey}
                className={`w-[24px] h-[24px] flex items-center justify-center rounded-btn ${
                  item.log[0]?.[doorKey]
                    ? 'bg-red-500 text-white'
                    : 'border border-primary text-primary'
                } duration-300`}
              >
                {item.log[0]?.[doorKey] ? (
                  <RiDoorOpenLine size={14} />
                ) : (
                  <RiDoorClosedLine size={14} />
                )}
              </div>
            ))}
          </>
        )
      },
      sortable: false,
      center: true
    },
    {
      name: t('deviceConnectTb'),
      cell: item => (
        <div
          className={`w-max h-[24px] px-2 flex items-center justify-center rounded-btn ${
            item.online ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          } duration-300`}
        >
          {item.online ? t('deviceOnline') : t('deviceOffline')}
        </div>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('devicePlugTb'),
      selector: item =>
        item.log[0]?.plug ? t('stateProblem') : t('stateNormal'),
      sortable: false,
      center: true
    },
    {
      name: t('deviceBatteryTb'),
      selector: item =>
        item.log[0]?.battery ? `${item.log[0].battery}%` : '—',
      sortable: false,
      center: true
    },
    {
      name: t('deviceWarrantyTb'),
      cell: item => {
        return (
          <span
            className={`w-max max-w-[150px] h-[24px] px-2 flex items-center justify-center rounded-btn ${
              calulateDate(item).remainingDays <= 0 &&
              calulateDate(item).months <= 0 &&
              calulateDate(item).years <= 0
                ? 'bg-red-500 text-white'
                : ''
            } duration-300`}
          >
            {item.warranty[0]?.expire
              ? calulateDate(item).daysRemaining > 0
                ? calulateDate(item).years > 0
                  ? `${calulateDate(item).years} ${t('year')} ${
                      calulateDate(item).months
                    } ${t('month')} ${calulateDate(item).remainingDays} ${t(
                      'day'
                    )}`
                  : calulateDate(item).months > 0
                  ? `${calulateDate(item).months} ${t('month')} ${
                      calulateDate(item).remainingDays
                    } ${t('day')}`
                  : `${calulateDate(item).remainingDays} ${t('day')}`
                : t('tabWarrantyExpired')
              : t('notRegistered')}
          </span>
        )
      },
      sortable: false,
      center: true,
      width: '140px'
    },
    {
      name: t('deviceActionTb'),
      cell: item => (
        <RiSettings3Line
          size={24}
          className='hover:fill-primary duration-300'
          onClick={() => openAdjustModal(item.probe, item.id)}
        />
      ),
      sortable: false,
      center: true
    }
  ]
}

export { columnData }
