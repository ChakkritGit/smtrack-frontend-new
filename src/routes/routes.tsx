import { useEffect } from "react"
import { RouterProvider } from "react-router-dom"
import { router } from "./createRoutes"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/reducers/rootReducer"
import { setTokenDecode } from "../redux/actions/utilsActions"
import { TokenType } from "../types/smtrack/utilsRedux/utilsReduxType"
import { jwtDecode } from 'jwt-decode'

const Routes = () => {
  const dispatch = useDispatch()
  const { tokenDecode, cookieDecode, tmsMode, themeMode } = useSelector((state: RootState) => state.utils)
  const { role = 'USER' } = tokenDecode || {}
  const { token } = cookieDecode || {}

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode)
  }, [themeMode])

  const decodeToken = async (getToken: string) => {
    const decoded: TokenType = await jwtDecode(getToken)
    dispatch(setTokenDecode(decoded))
  }

  useEffect(() => {
    if (!token) return
    decodeToken(token)
  }, [token])

  return (
    <RouterProvider router={router(role, tmsMode)} />
  )
}

export default Routes