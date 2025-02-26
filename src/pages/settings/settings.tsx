import { useMemo, useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  RiColorFilterAiFill,
  RiColorFilterAiLine,
  RiIdCardFill,
  RiIdCardLine,
  RiNotification4Fill,
  RiNotification4Line,
  RiTranslate2
} from 'react-icons/ri'
import { RootState } from '../../redux/reducers/rootReducer'
import { useSelector } from 'react-redux'
import ProfileComponent from '../../components/pages/settings/profileComponent'
import SoundAndNotificationComponents from '../../components/pages/settings/soundAndNotificationComponents'
import AppearanceComponents from '../../components/pages/settings/appearanceComponents'
import LanguageComponents from '../../components/pages/settings/languageComponents'
import ResetPassword from '../../components/pages/settings/resetPassword'

interface FormState {
  imagePreview: string | null
}

const Settings = () => {
  const { t } = useTranslation()
  const { userProfile } = useSelector((state: RootState) => state.utils)
  const profileModalRef = useRef<HTMLDialogElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [tab, setTab] = useState(1)
  const [image, setImage] = useState<FormState>({
    imagePreview: userProfile?.pic ?? null
  })
  const [edit, setEdit] = useState(false)
  const [imageProcessing, setImageProcessing] = useState(false)

  useEffect(() => {
    setImage({ imagePreview: userProfile?.pic ?? null })
  }, [userProfile])

  const settingProfile = useMemo(
    () => (
      <>
        <ProfileComponent
          key={'Setting'}
          userProfile={userProfile}
          profileModalRef={profileModalRef}
          fileInputRef={fileInputRef}
          image={image}
          setImage={setImage}
          edit={edit}
          setEdit={setEdit}
          imageProcessing={imageProcessing}
          setImageProcessing={setImageProcessing}
        />
        <ResetPassword />
      </>
    ),
    [userProfile, image, edit, imageProcessing]
  )

  const settingContent = useMemo(
    () => (
      <div className='w-full p-3 bg-base-100 rounded-btn max-h-[calc(100dvh-140px)] overflow-y-scroll'>
        {tab === 1 ? (
          settingProfile
        ) : tab === 2 ? (
          <SoundAndNotificationComponents />
        ) : tab === 3 ? (
          <AppearanceComponents />
        ) : (
          <LanguageComponents />
        )}
      </div>
    ),
    [tab, settingProfile]
  )

  return (
    <div className='min-h-[calc(100dvh-64px)] p-3'>
      <div className='flex gap-1 md:gap-3 p-3'>
        <ul className='flex flex-col md:min-w-[200px] gap-2'>
          <li
            onClick={() => setTab(1)}
            className={`${
              tab === 1 ? '!btn-primary' : 'btn-ghost'
            } btn font-normal flex-nowrap text-[16px] justify-start w-full flex`}
          >
            <a className='text-[16px] h-9 flex items-center gap-2'>
              {tab === 1 ? (
                <RiIdCardFill size={24} />
              ) : (
                <RiIdCardLine size={24} />
              )}
              <span className='hidden md:block'>{t('profile')}</span>
            </a>
          </li>
          <li
            onClick={() => setTab(2)}
            className={`${
              tab === 2 ? '!btn-primary' : 'btn-ghost'
            } btn font-normal flex-nowrap text-[16px] justify-start w-full flex`}
          >
            <a className='text-[16px] h-9 flex items-center gap-2'>
              {tab === 2 ? (
                <RiNotification4Fill size={24} />
              ) : (
                <RiNotification4Line size={24} />
              )}
              <span className='hidden md:block'>{t('titleNotification')}</span>
            </a>
          </li>
          <li
            onClick={() => setTab(3)}
            className={`${
              tab === 3 ? '!btn-primary' : 'btn-ghost'
            } btn font-normal flex-nowrap text-[16px] justify-start w-full flex`}
          >
            <a className='text-[16px] h-9 flex items-center gap-2'>
              {tab === 3 ? (
                <RiColorFilterAiFill size={24} />
              ) : (
                <RiColorFilterAiLine size={24} />
              )}
              <span className='hidden md:block'>{t('themeMode')}</span>
            </a>
          </li>
          <li
            onClick={() => setTab(4)}
            className={`${
              tab === 4 ? '!btn-primary' : 'btn-ghost'
            } btn font-normal flex-nowrap text-[16px] justify-start w-full flex`}
          >
            <a className='text-[16px] h-9 flex items-center gap-2'>
              <RiTranslate2 size={24} />
              <span className='hidden md:block'>{t('tabLanguage')}</span>
            </a>
          </li>
        </ul>
        <div className='divider divider-horizontal mx-1 md:mx-4'></div>
        <div className='w-full p-3 bg-base-100 rounded-btn'>
          {settingContent}
        </div>
      </div>
    </div>
  )
}

export default Settings
