import { useTranslation } from 'react-i18next'
import { DeviceLogType } from '../../../types/smtrack/logs/deviceLog'
import DataTable, { TableColumn } from 'react-data-table-component'
import { useEffect, useState } from 'react'
import { RootState } from '../../../redux/reducers/rootReducer'
import { useSelector } from 'react-redux'

interface TableMiniProps {
  logData: DeviceLogType[]
}

const DataTableMini = (props: TableMiniProps) => {
  const { t } = useTranslation()
  const { logData } = props
  const { globalSearch } = useSelector((state: RootState) => state.utils)
  const [tableData, setTableData] = useState<DeviceLogType[]>([])

  useEffect(() => {
    const filtered = logData.filter(
      item =>
        item.sendTime &&
        item.sendTime
          .substring(11, 16)
          .toLowerCase()
          .includes(globalSearch.toLowerCase())
    )

    setTableData(filtered)
  }, [globalSearch])

  const columns: TableColumn<DeviceLogType>[] = [
    {
      name: t('deviceNoTb'),
      cell: (_, index) => {
        return <div>{logData.length - index}</div>
      },
      sortable: false,
      center: true
    },
    {
      name: t('deviceSerialTb'),
      cell: item => (
        <span title={item.serial}>...{item.serial.substring(15)}</span>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('deviceTime'),
      cell: item => item.sendTime.substring(11, 16),
      sortable: false,
      center: true
    },
    {
      name: t('probeTempSubTb'),
      cell: item => item.tempDisplay.toFixed(2) + '°C',
      sortable: false,
      center: true
    },
    {
      name: t('probeHumiSubTb'),
      cell: item => item.humidityDisplay.toFixed(2) + '%',
      sortable: false,
      center: true
    },
    {
      name: t('deviceConnectTb'),
      cell: item => (item.internet ? t('deviceOffline') : t('deviceOnline')),
      sortable: false,
      center: true
    }
  ]

  return (
    <div className='dataTableWrapper mb-5'>
      <DataTable
        responsive={true}
        columns={columns}
        data={tableData}
        pagination
        paginationRowsPerPageOptions={[12, 30, 50, 100]}
        paginationPerPage={12}
        dense
        fixedHeader
        fixedHeaderScrollHeight='270px'
      />
    </div>
  )
}

export default DataTableMini
