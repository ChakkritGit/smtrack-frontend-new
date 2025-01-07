import { useTranslation } from 'react-i18next'

const DataTableNoData = () => {
  const { t } = useTranslation()

  return (
    <div className='w-full p-3'>
      <div className='flex items-center justify-center gap-3'>
        <span>{t('nodata')}</span>
      </div>
    </div>
  )
}

export default DataTableNoData
