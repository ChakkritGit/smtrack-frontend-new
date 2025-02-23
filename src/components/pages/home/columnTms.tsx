import { TFunctionNonStrict } from 'i18next'
import { DeviceTmsType } from '../../../types/tms/devices/deviceType'
import { TableColumn } from 'react-data-table-component'
import { DoorKey } from '../../../types/global/doorQty'
import { RiDoorClosedLine, RiDoorOpenLine } from 'react-icons/ri'

const columnTms = (
  t: TFunctionNonStrict<'translation', undefined>,
  handleRowClicked: (row: DeviceTmsType) => void
): TableColumn<DeviceTmsType>[] => {
  return [
    {
      name: t('deviceSerialTb'),
      cell: item => (
        <span
          className='tooltip'
          data-tip={item.sn}
          onClick={() => handleRowClicked(item)}
        >
          {item.sn}
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
      name: t('devicTemperatureTb'),
      selector: item =>
        item.log[0]?.tempValue ? `${item.log[0]?.tempValue.toFixed(2)}°C` : '—',
      sortable: false,
      center: true
    },
    {
      name: t('deviceDoorTb'),
      cell: item => {
        const doorCount: number = 1
        const doors: DoorKey[] = ['door1']

        return (
          <>
            {doors.slice(0, doorCount).map(doorKey => (
              <div
                key={doorKey}
                className={`w-[24px] h-[24px] flex items-center justify-center rounded-btn ${
                  item.log[0]?.door
                    ? 'bg-red-500 text-white'
                    : 'border border-primary text-primary'
                } duration-300`}
              >
                {item.log[0]?.door ? (
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
            item.log[0]?.internet
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          } duration-300`}
        >
          {item.log[0]?.internet ? t('deviceOnline') : t('deviceOffline')}
        </div>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('devicePlugTb'),
      selector: item =>
        !item.log[0]?.plugin ? t('stateNormal') : t('stateProblem'),
      sortable: false,
      center: true
    }
  ]
}

export { columnTms }
