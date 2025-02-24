import { useTranslation } from 'react-i18next'
import { RiSpeakerLine } from 'react-icons/ri'

const SoundAndNotificationComponents = () => {
  const { t } = useTranslation()

  return (
    <div>
      <span className='text-[24px]'>{t('titleNotification')}</span>
      <div className='flex items-center justify-between mt-3'>
        <span>{t('tabWarrantyAll')}</span>
        <input type='checkbox' className='toggle' defaultChecked />
      </div>
      <div className='flex items-center justify-between mt-5 ml-3'>
        <div className='flex items-center gap-2'>
          <RiSpeakerLine size={24} />
          <span>{t('notificationSound')}</span>
        </div>
        <input type='checkbox' className='toggle' defaultChecked />
      </div>
    </div>
  )
}

export default SoundAndNotificationComponents
