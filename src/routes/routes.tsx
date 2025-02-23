import { useCallback, useEffect, useMemo, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './createRoutes'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/reducers/rootReducer'
import { setTokenDecode } from '../redux/actions/utilsActions'
import {
  responseType,
  TokenType
} from '../types/smtrack/utilsRedux/utilsReduxType'
import { jwtDecode } from 'jwt-decode'
import { HospitalType } from '../types/smtrack/hospitals/hospitalType'
import { WardType } from '../types/smtrack/wards/wardType'
import { AxiosError } from 'axios'
import { GlobalContext } from '../contexts/globalContext'
import axiosInstance from '../constants/axios/axiosInstance'
import { client } from '../services/mqtt'
import sha256 from 'crypto-js/sha256'
import hmacSHA512 from 'crypto-js/hmac-sha512'
import Base64 from 'crypto-js/enc-base64'

const Routes = () => {
  const dispatch = useDispatch()
  const { tokenDecode, cookieDecode, tmsMode, themeMode, userProfile } =
    useSelector((state: RootState) => state.utils)
  const [hospital, setHospital] = useState<HospitalType[]>([])
  const [ward, setWard] = useState<WardType[]>([])
  const { role = 'USER' } = tokenDecode || {}
  const { token } = cookieDecode || {}

  const decodeToken = async (getToken: string) => {
    const decoded: TokenType = await jwtDecode(getToken)
    dispatch(setTokenDecode(decoded))
  }

  const fetchHospital = async () => {
    try {
      const response = await axiosInstance<responseType<HospitalType[]>>(
        '/auth/hospital'
      )
      setHospital(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    }
  }

  const fetchWard = async () => {
    try {
      const response = await axiosInstance<responseType<WardType[]>>(
        '/auth/ward'
      )
      setWard(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    if (!token) return
    fetchHospital()
    fetchWard()
  }, [token])

  useEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.setAttribute('data-theme', themeMode)
  }, [themeMode])

  useEffect(() => {
    if (!token) return
    decodeToken(token)
  }, [token])

  useEffect(() => {
    const link: HTMLLinkElement =
      document.querySelector("link[rel*='icon']") ||
      document.createElement('link')
    link.type = 'image/png'
    link.rel = 'icon'
    link.href = String(userProfile?.ward.hospital.hosPic)

    const pathSegment = location.pathname.split('/')[1]
    const capitalized =
      pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1)

    document.getElementsByTagName('head')[0].appendChild(link)
    document.title = userProfile
      ? userProfile?.ward.hospital.hosName +
        ' - ' +
        `${location.pathname.split('/')[1] !== '' ? capitalized : 'Home'}`
      : 'SMTrack+'
  }, [location, cookieDecode, userProfile])

  useEffect(() => {
    client.connected
  }, [])

  const routerInstance = useMemo(() => router(role, tmsMode), [role, tmsMode])
  const contextValue = useMemo(
    () => ({ hospital, setHospital, ward, setWard, fetchHospital, fetchWard }),
    [hospital, ward]
  )
  const hashText = useCallback(
    () =>
      Base64.stringify(
        hmacSHA512(
          sha256(tmsMode ? `tms-${role}` : `smtrack-${role}`),
          import.meta.env.VITE_APP_SECRETKEY
        )
      ),
    [tmsMode, role]
  )

  return (
    <GlobalContext.Provider value={contextValue}>
      <RouterProvider key={hashText()} router={routerInstance} />
    </GlobalContext.Provider>
  )
}

export default Routes
