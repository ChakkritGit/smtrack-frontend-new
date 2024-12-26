import { useEffect, useRef } from 'react'
import { RiMenuFoldLine, RiMenuUnfoldLine, RiNotification4Line, RiSearchLine, RiArrowDownSLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'
import { setIsExpand } from '../../../redux/actions/utilsActions'
import DefaultPic from '../../../assets/images/default-pic.png'
import { UAParser } from "ua-parser-js"
import { getRoleLabel } from '../../../constants/utils/utilsConstants'
import { useTranslation } from 'react-i18next'

function Navbar() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { isExpand, userProfile } = useSelector((state: RootState) => state.utils)
  const { pic, display, role } = userProfile || {}
  const searchRef = useRef<HTMLInputElement | null>(null)
  const parser = new UAParser()
  const os = parser.getOS().name
  const isMac = os === "mac os"

  useEffect(() => {
    localStorage.setItem('expandaside', isExpand.toString())
  }, [isExpand])

  useEffect(() => {
    const handleCk = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key?.toLowerCase() === "k") {
          e.preventDefault()
          searchRef.current?.focus()
        }
      }
    }

    window.addEventListener("keydown", handleCk)

    return () => {
      window.removeEventListener("keydown", handleCk)
    }
  }, [])

  return (
    <div className='bg-base-100 text-base-content sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)] shadow-sm'>
      <div className="navbar">
        <div className="flex-1 lg:gap-3">
          <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button lg:hidden">
            <RiMenuUnfoldLine size={24} />
          </label>
          <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button hidden lg:flex" onClick={() => dispatch(setIsExpand())}>
            {isExpand ? <RiMenuUnfoldLine size={24} /> : <RiMenuFoldLine size={24} />}
          </label>
          <div className="form-control">
            <label className="input input-bordered bg-base-200 hidden border-none h-10 items-center gap-2 lg:flex">
              <input type="text" className="grow !w-28 md:w-auto" placeholder="Search" ref={searchRef} />
              <kbd className="kbd kbd-sm">{isMac ? "⌘" : "Ctrl"}</kbd>
              <kbd className="kbd kbd-sm">K</kbd>
            </label>
          </div>
          <div className='btn btn-ghost lg:hidden'>
            <RiSearchLine size={24} />
          </div>
        </div>
        <div className="indicator btn btn-ghost justify-end">
          <span className="indicator-item badge badge-secondary px-1 top-2 right-4 lg:right-2">99+</span>
          <RiNotification4Line size={24} />
        </div>
        <div className="lg:divider lg:divider-horizontal lg:!mx-2"></div>
        <div className="flex-none gap-2 hidden lg:block">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className='btn btn-ghost gap-3 px-2'>
              <img
                src={pic ? pic : DefaultPic}
                alt="User-img"
                className='w-10 rounded-full'
              />
              <div className='flex flex-col items-start gap-1'>
                <span>{display ? display : "—"}</span>
                <span>{getRoleLabel(role, t)}</span>
              </div>
              <RiArrowDownSLine size={18} />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar