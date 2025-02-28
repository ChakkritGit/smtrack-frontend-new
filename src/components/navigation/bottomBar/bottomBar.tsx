import { useTranslation } from 'react-i18next'
import { RootState } from '../../../redux/reducers/rootReducer'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { RiHome3Fill, RiHome3Line } from 'react-icons/ri'
import { useEffect, useState } from 'react'

const BottomBar = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { tokenDecode, themeMode } = useSelector(
    (state: RootState) => state.utils
  )
  const { role } = tokenDecode ?? {}
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  const handleScroll = () => {
    const currentScrollY = window.scrollY

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      setIsScrollingDown(true)
    } else {
      setIsScrollingDown(false)
    }
    setLastScrollY(currentScrollY)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  return (
    <div
      className={`btm-nav overflow-hidden sm:hidden bg-base-100/80 backdrop-blur duration-300 ${
        isScrollingDown ? 'h-[0px] opacity-0' : 'h-[60px] shadow-md opacity-100'
      } ${
        themeMode === 'cupcake' ||
        themeMode === 'valentine' ||
        themeMode === 'forest' ||
        themeMode === 'pastel'
          ? 'z-[88] bottom-3 mx-auto w-[95%] rounded-btn px-3'
          : ''
      }`}
    >
      <button className={`${location.pathname === '/' ? 'active' : ''}`}>
        {location.pathname === '/' ? (
          <RiHome3Fill size={24} />
        ) : (
          <RiHome3Line size={24} />
        )}
        <span className='text-[12px] leading-normal truncate max-w-[64px]'>
          {t('sideShowAllBox')}
        </span>
      </button>
      <button>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      </button>
      <button>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
          />
        </svg>
      </button>
      <button>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
          />
        </svg>
      </button>
      <button>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
          />
        </svg>
      </button>
    </div>
  )
}

export default BottomBar
