import { useTranslation } from 'react-i18next'

const Loading = () => {
  const { t } = useTranslation()

  return (
    <div className='w-full p-3'>
      <div className='flex items-center justify-center gap-3'>
        <span className='loading loading-ring loading-md'></span>
        <span>{t('loading')}</span>
      </div>
    </div>
  )
}

export default Loading