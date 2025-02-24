import { useTranslation } from 'react-i18next'

const SoundAndNotificationComponents = () => {
  const { t } = useTranslation()

  return (
    <div>
      <span className='text-[24px]'>{t('titleNotification')}</span>
      <div className='flex items-center justify-between'>
        
      </div>
      <div className='flex items-center justify-between'>

      </div>
    </div>
  )
}

export default SoundAndNotificationComponents
