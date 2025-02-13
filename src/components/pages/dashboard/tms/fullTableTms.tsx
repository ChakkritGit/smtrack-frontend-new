import { useTranslation } from 'react-i18next'
import { LogChartTms } from '../../../../types/tms/devices/deviceType'
import DataTable, { TableColumn } from 'react-data-table-component'
import DataTableNoData from '../../../skeleton/table/noData'

interface FullTablePropType {
  dataLog: LogChartTms[]
  tempMin: number
  tempMax: number
}

const FullTableTmsComponent = (props: FullTablePropType) => {
  const { t } = useTranslation()
  const { dataLog } = props

  const columns: TableColumn<LogChartTms>[] = [
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
      cell: item => <span title={item.sn}>{item.sn}</span>,
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
      cell: item => item._value.toFixed(2) + '°C',
      sortable: false,
      center: true
    }
  ]

  return (
    <div className='dataTableWrapper bg-base-100 rounded-btn p-3 duration-300 mt-5'>
      <DataTable
        pagination
        fixedHeader
        responsive={true}
        columns={columns}
        data={dataLog}
        noDataComponent={<DataTableNoData />}
        paginationPerPage={12}
        paginationRowsPerPageOptions={[12, 30, 50, 100]}
        fixedHeaderScrollHeight='580px'
      />
    </div>
  )
}

export default FullTableTmsComponent
