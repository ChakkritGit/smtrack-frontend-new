import { useTranslation } from 'react-i18next'

const ResetPassword = () => {
  const { t } = useTranslation()

  return (
    <div className='mt-3'>
      <div className='divider divider-vertical my-2 before:h-[1px] after:h-[1px]'></div>
      <h3 className='font-bold text-base'>{t('titleSecurity')}</h3>
      <div className='flex items-center justify-between'>
        <span className='ml-5'>{t('titlePassword')}</span>
        <button className='w-[50px] h-[35px] md:w-[70px] md:h-[40px] font-bold rounded-btn border-[2px] border-base-content text-[14px] md:text-base-content hover:opacity-50 duration-300'>
          {t('changPassword')}
        </button>
      </div>
    </div>
  )
}

export default ResetPassword
