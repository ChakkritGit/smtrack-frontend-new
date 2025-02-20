import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface LoadingProps {
  clear?: boolean
}

const Loading = (props: LoadingProps) => {
  const { clear } = props
  const { t } = useTranslation()
  const [error, setError] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError(true)
    }, 60000)

    if (clear) {
      clearTimeout(timeout)
      setError(false)
    }

    return () => clearTimeout(timeout)
  }, [clear])

  if (error) {
    return (
      <div className='w-full p-3 text-center text-red-500'>
        {t('descriptionErrorWrong')}
      </div>
    )
  }

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
