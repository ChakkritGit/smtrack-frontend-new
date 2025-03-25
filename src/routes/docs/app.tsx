import { useTranslation } from 'react-i18next'
import playStore from '../../assets/images/playstore.png'
import appStore from '../../assets/images/appstore.png'
import LogoBanner from '../../assets/images/app-logo.png'
import ApkBanner from '../../assets/images/apk-banner.svg'
import pdf from '../../assets/pdf/install_apk.pdf'

const App = () => {
  const { t } = useTranslation()
  return (
    <div className='min-h-dvh max-w-[720px] mx-auto py-14 px-5 flex flex-col items-center justify-center gap-3'>
      <div className='flex flex-col md:flex-row items-center justify-center'>
        <div className='avatar'>
          <div className='w-24 rounded'>
            <img src={LogoBanner} />
          </div>
        </div>
        <div className='divider divider-vertical md:divider-horizontal'></div>
        <div>
          <span className='text-[24px] font-medium'>
            {t('appDownload')} SMTrack+
          </span>
          <div className='flex flex-col md:flex-row items-center gap-3 mt-3'>
            <a className='avatar' href="https://apps.apple.com/th/app/smtrack/id6670781090" target="_blank" rel="noopener noreferrer">
              <div className='h-[50px] w-[150px] rounded !aspect-auto'>
                <img src={appStore} />
              </div>
            </a>
            <a className='avatar' href="https://play.google.com/store/apps/details?id=com.thanes.temp_noti" target="_blank" rel="noopener noreferrer">
              <div className='h-[50px] w-[150px] rounded !aspect-auto'>
                <img src={playStore} />
              </div>
            </a>
            <a className='avatar' href="https://api.siamatic.co.th/etemp/media/app-release.apk" target="_blank" rel="noopener noreferrer">
              <div className='h-[50px] w-[150px] rounded !aspect-auto'>
                <img src={ApkBanner} />
              </div>
            </a>
          </div>
        </div>
      </div>
      <a className='link link-primary' onClick={() => window.open(pdf)}>
        {t('installApp')}
      </a>
    </div>
  )
}

export default App
