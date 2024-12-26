import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../redux/reducers/rootReducer"
import { Link, useLocation } from "react-router-dom"
import { RiDashboardFill, RiDashboardLine, RiFileSettingsFill, RiFileSettingsLine, RiHome3Fill, RiHome3Line, RiListSettingsFill, RiListSettingsLine, RiSettings3Fill, RiSettings3Line, RiShieldCheckFill, RiShieldCheckLine, RiUser6Fill, RiUser6Line } from "react-icons/ri"
import { setTmsMode } from "../../../redux/actions/utilsActions"

const Sidebar = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { isExpand } = useSelector((state: RootState) => state.utils)

  return (
    <div className="drawer lg:drawer-open w-auto shadow-sm">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className={`menu bg-base-100 text-base-content min-h-full flex flex-col !items-center justify-between !transition-all !ease-in-out !duration-300 ${isExpand ? "w-[100px]" : "w-[235px]"}`}>
          <div>
            <div className="flex items-center justify-center flex-col gap-5 p-3">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Hospital-img" className={`rounded-box transition-all ease-in-out duration-300 ${isExpand ? "w-16" : "w-28"}`} />
              <h3 className="text-[24px]">{isExpand ? "Hospital"[0] : "Hospital"}</h3>
            </div>
            <div className="divider mt-0 mb-0"></div>
            <div className="flex items-center justify-center flex-col gap-2 p-3">
              <Link to={"/"} className={`btn flex-nowrap justify-start w-full ${location.pathname === "/" ? "btn-primary" : "btn-ghost"}`}>
                {
                  location.pathname === "/" ?
                    <RiHome3Fill size={24} />
                    :
                    <RiHome3Line size={24} />
                }
                {!isExpand && <span className="text-[16px]">Show All Devices</span>}
              </Link>
              <Link to={"/dashboard"} className={`btn flex-nowrap justify-start w-full ${location.pathname === "/dashboard" || location.pathname.split('/')[2] === "chart" || location.pathname.split('/')[2] === "table" || location.pathname === "/dashboard/chart/compare" ? "btn-primary" : "btn-ghost"}`}>
                {
                  location.pathname === "/dashboard" || location.pathname.split('/')[2] === "chart" || location.pathname.split('/')[2] === "table" || location.pathname === "/dashboard/chart/compare" ?
                    <RiDashboardFill size={24} />
                    :
                    <RiDashboardLine size={24} />
                }
                {!isExpand && <span className="text-[16px]">Dashboard</span>}
              </Link>
              <Link to={"/permission"} className={`btn flex-nowrap justify-start w-full ${location.pathname === "/permission" ? "btn-primary" : "btn-ghost"}`}>
                {
                  location.pathname === "/permission" ?
                    <RiUser6Fill size={24} />
                    :
                    <RiUser6Line size={24} />
                }
                {!isExpand && <span className="text-[16px]">Manage Users</span>}
              </Link>
              <Link to={"/management"} className={`btn flex-nowrap justify-start w-full ${location.pathname === "/management" || location.pathname === "/management/logadjust" || location.pathname === '/management/flasher' ? "btn-primary" : "btn-ghost"}`}>
                {
                  location.pathname === "/management" || location.pathname === "/management/logadjust" || location.pathname === '/management/flasher' ?
                    <RiListSettingsFill size={24} />
                    :
                    <RiListSettingsLine size={24} />
                }
                {!isExpand && <span className="text-[16px]">Manage</span>}
              </Link>
            </div>
            <div className="divider mb-0"></div>
            <div className="flex items-center justify-center flex-col gap-2 p-3">
              <Link to={"/warranty"} className={`btn flex-nowrap justify-start w-full ${location.pathname === "/warranty" ? "btn-primary" : "btn-ghost"}`}>
                {
                  location.pathname === "/warranty" ?
                    <RiShieldCheckFill size={24} />
                    :
                    <RiShieldCheckLine size={24} />
                }
                {!isExpand && <span className="text-[16px]">Warranties</span>}
              </Link>
              <Link to={"/repair"} className={`btn flex-nowrap justify-start w-full ${location.pathname === "/repair" ? "btn-primary" : "btn-ghost"}`}>
                {
                  location.pathname === "/repair" ?
                    <RiFileSettingsFill size={24} />
                    :
                    <RiFileSettingsLine size={24} />
                }
                {!isExpand && <span className="text-[16px]">Repairs</span>}
              </Link>
            </div>
          </div>
          <div className="w-full">
            <div className="divider mb-0"></div>
            <div className="flex items-center justify-center flex-col gap-3 p-3">
              <div className="flex flex-col items-center gap-2">
                {!isExpand && <span className="text-[12px]">*Switch mode eTEMP and TMS</span>}
                <div className="flex items-center justify-center gap-2">
                  <input type="checkbox" className="toggle toggle-md" defaultChecked={isExpand} onClick={() => dispatch(setTmsMode())} />
                </div>
              </div>
              <Link to={"/settings"} className={`btn flex-nowrap justify-start w-full ${location.pathname === "/settings" ? "btn-primary" : "btn-ghost"}`}>
                {
                  location.pathname === "/settings" ?
                    <RiSettings3Fill size={24} />
                    :
                    <RiSettings3Line size={24} />
                }
                {!isExpand && <span className="text-[16px]">Settings</span>}
              </Link>
            </div>
          </div>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar