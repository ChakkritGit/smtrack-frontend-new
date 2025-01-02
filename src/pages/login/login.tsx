import { AxiosError } from "axios"
import { FormEvent, useState } from "react"
import axiosInstance from "../../constants/axios/axiosInstance"
import { accessToken, cookieOptions, cookies } from "../../constants/utils/utilsConstants"
import { setCookieEncode } from "../../redux/actions/utilsActions"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [userLogin, setUserLogin] = useState({
    username: "",
    password: ""
  })
  const { username, password } = userLogin

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    if (username !== "" && password !== "") {
      try {
        const response = await axiosInstance.post("/auth/login", userLogin)
        const { hosId, token, refreshToken, id, wardId } = response.data.data
        const tokenObject = {
          hosId: hosId,
          refreshToken: refreshToken,
          token: token,
          id: id,
          wardId: wardId,
        }
        cookies.set('tokenObject', String(accessToken(tokenObject)), cookieOptions)
        dispatch(setCookieEncode(String(accessToken(tokenObject))))
        navigate(`/`)
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error.response?.data.message)
        } else {
          console.error(error)
        }
      }
    } else {

    }
  }

  return (
    <div className="h-dvh flex items-center justify-center">
      <div className="card bg-base-100 w-[350px] sm:w-[500px] md:w-[500px] lg:w-[500px] h-max shadow-xl">
        <div className="px-5 pt-5">
          <h1 className="text-[38px] font-bold text-primary">SMTrack+</h1>
          <span>Real-time temperature monitoring with alerts for exceeding limits</span>
        </div>
        <div className="card-body">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                  d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input type="text" className="grow" placeholder="Username" autoComplete="username" autoFocus value={username} onChange={(e) => setUserLogin({ ...userLogin, username: e.target.value })} />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd" />
              </svg>
              <input type="password" className="grow" placeholder="Password" autoComplete="current-password" value={password} onChange={(e) => setUserLogin({ ...userLogin, password: e.target.value })} />
            </label>
            <div className="card-actions">
              <button type="submit" className="btn btn-primary w-full">Login</button>
            </div>
          </form>
          <div className="divider text-base-300">Contact</div>
        </div>
      </div>
    </div>
  )
}

export default Login