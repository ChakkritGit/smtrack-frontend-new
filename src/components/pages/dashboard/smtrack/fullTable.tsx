import { useTranslation } from 'react-i18next'
import DataTable, { TableColumn } from 'react-data-table-component'
import DataTableNoData from '../../../skeleton/table/noData'
import {
  DeviceLog,
  DeviceLogs
} from '../../../../types/smtrack/devices/deviceType'
import Loading from '../../../skeleton/table/loading'
import { useEffect, useMemo, useState } from 'react'

interface FullTablePropType {
  dataLog: DeviceLogs[]
  deviceLogs: DeviceLog
  tempMin: number
  tempMax: number
  isLoading: boolean
}

const FullTableComponent = (props: FullTablePropType) => {
  const { t } = useTranslation()
  const { dataLog, deviceLogs, isLoading } = props
  const [reverseArray, setReverseArray] = useState<DeviceLogs[]>([])

  const columns: TableColumn<DeviceLogs>[] = [
    {
      name: t('deviceNoTb'),
      cell: (_, index) => {
        return <div>{dataLog.length - index}</div>
      },
      sortable: false,
      center: true
    },
    {
      name: t('deviceSerialTb'),
      cell: () => <span title={deviceLogs.id}>{deviceLogs.id}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('deviceTime'),
      cell: item =>
        `${item._time.substring(0, 10)} ${item._time.substring(11, 16)}`,
      sortable: false,
      center: true
    },
    {
      name: t('probeTempSubTb'),
      cell: item => item.temp.toFixed(2) + '°C',
      sortable: false,
      center: true
    }
  ]

  useEffect(() => {
    setReverseArray(
      [...dataLog].sort(
        (a, b) => new Date(b._time).getTime() - new Date(a._time).getTime()
      )
    )
  }, [dataLog])

  const table = useMemo(
    () => (
      <DataTable
        pagination
        fixedHeader
        responsive={true}
        progressPending={isLoading}
        columns={columns}
        data={reverseArray}
        noDataComponent={<DataTableNoData />}
        progressComponent={<Loading />}
        paginationPerPage={12}
        paginationRowsPerPageOptions={[12, 30, 50, 100]}
        className='md:!max-h-[calc(100dvh-300px)]'
      />
    ),
    [reverseArray, isLoading]
  )

  return (
    <div className='dataTableWrapper bg-base-100 rounded-btn p-3 duration-300 mt-5'>
      {table}
    </div>
  )
}

export default FullTableComponent
