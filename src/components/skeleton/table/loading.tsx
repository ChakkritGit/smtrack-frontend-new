// import { useTranslation } from 'react-i18next'

const Loading = () => {
  // const { t } = useTranslation()

  return (
    <div className='flex items-center justify-center w-full p-3 h-full gap-3'>
      <span className='loading loading-spinner loading-md bg-base-content'></span>
      {/* <span className='text-base-content'>{t('loading')}</span> */}
    </div>
  )
}

export default Loading
