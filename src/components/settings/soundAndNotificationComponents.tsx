import { useTranslation } from 'react-i18next'
import { RiSpeakerLine } from 'react-icons/ri'
import { RootState } from '../../redux/reducers/rootReducer'
import { useDispatch, useSelector } from 'react-redux'
import { setPopUpMode, setSoundMode } from '../../redux/actions/utilsActions'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'

const SoundAndNotificationComponents = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { popUpMode, soundMode } = useSelector(
    (state: RootState) => state.utils
  )

  return (
    <div>
      <span className='text-[24px]'>{t('titleNotification')}</span>
      <div className='flex items-center justify-between mt-3'>
        <span>{t('allNotification')}</span>
        <input
          type='checkbox'
          className='toggle'
          checked={!popUpMode}
          onClick={() => {
            dispatch(setPopUpMode())
            cookies.set('popUpMode', !popUpMode, cookieOptions)
          }}
        />
      </div>
      <div
        className={`flex items-center justify-between mt-5 ml-3 ${
          popUpMode ? 'opacity-50' : ''
        }`}
      >
        <div className='flex items-center gap-2'>
          <RiSpeakerLine size={24} />
          <span>{t('notificationSound')}</span>
        </div>
        <input
          type='checkbox'
          className='toggle'
          checked={!soundMode}
          disabled={popUpMode}
          onClick={() => {
            dispatch(setSoundMode())
            cookies.set('soundMode', !soundMode, cookieOptions)
          }}
        />
      </div>
    </div>
  )
}

export default SoundAndNotificationComponents
