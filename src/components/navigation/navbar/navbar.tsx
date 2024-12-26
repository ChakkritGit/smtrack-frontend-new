import { useEffect } from 'react'
import { RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'
import { setIsExpand } from '../../../redux/actions/utilsActions'

function Navbar() {
  const dispatch = useDispatch()
  const { isExpand } = useSelector((state: RootState) => state.utils)

  useEffect(() => {
    localStorage.setItem('expandaside', isExpand.toString())
  }, [isExpand])

  return (
    <div className='bg-base-100 text-base-content sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)] shadow-sm'>
      <div className="navbar">
        <div className="flex-1 gap-3">
          <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button lg:hidden">
            <RiMenuUnfoldLine size={24} />
          </label>
          <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button hidden lg:flex" onClick={() => dispatch(setIsExpand())}>
            {isExpand ? <RiMenuUnfoldLine size={24} /> : <RiMenuFoldLine size={24} />}
          </label>
          <div className="form-control">
            <label className="input input-bordered bg-base-200 flex border-none h-10 items-center gap-2">
              <input type="text" className="grow !w-28 md:w-auto" placeholder="Search" />
              <kbd className="kbd kbd-sm">Ctrl</kbd>
              <kbd className="kbd kbd-sm">K</kbd>
            </label>
          </div>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
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