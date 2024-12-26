import { Outlet } from "react-router-dom"
import Navbar from "../../components/navigation/navbar/navbar"
import Sidebar from "../../components/navigation/sidebar/sidebar"

const MainSmtrack = () => {

  return (
    <main className="flex h-dvh flex-col lg:flex-row">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <div>
          <Outlet />
        </div>
      </div>
    </main>
  )
}

export default MainSmtrack