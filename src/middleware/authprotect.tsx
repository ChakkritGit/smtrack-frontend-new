import { ReactElement, useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import CryptoJS from "crypto-js"
import { setCookieDecode, setCookieEncode, setTmsMode } from '../redux/actions/utilsActions'
import { RootState } from '../redux/reducers/rootReducer'
import { TokenDecodeType } from '../types/smtrack/constants/constantsType'
import { cookieDecodeObject, cookieOptions, cookies } from '../constants/utils/utilsConstants'

type AuthProps = {
  children: ReactElement
}

const ProtectedRoute = ({ children }: AuthProps) => {
  const dispatch = useDispatch()
  const { cookieEncode } = useSelector((state: RootState) => state.utils)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  useEffect(() => {
    if (cookieEncode === "" || cookieEncode === undefined) return
    try {
      const CookieObject: TokenDecodeType = JSON.parse(cookieDecodeObject(cookieEncode).toString(CryptoJS.enc.Utf8))
      dispatch(setCookieDecode(CookieObject))
    } catch (error) {
      console.error('Decoded error: ', error)
    }
  }, [cookieEncode])

  useEffect(() => {
    const verifyToken = async (cookieEncode: string) => {
      try {
        const cookieObject: TokenDecodeType = JSON.parse(cookieDecodeObject(cookieEncode).toString(CryptoJS.enc.Utf8))
        if (cookieObject.token) {
          setIsValid(true)
        } else {
          dispatch(setCookieEncode(''))
          dispatch(setTmsMode())
          cookies.remove('tokenObject', cookieOptions)
          cookies.update()
          setIsValid(false)
        }
      } catch (error) {
        dispatch(setCookieEncode(''))
        dispatch(setTmsMode())
        cookies.remove('tokenObject', cookieOptions)
        cookies.update()
        setIsValid(false)
      }
    }

    if (cookieEncode !== "" || cookieEncode !== undefined) {
      verifyToken(String(cookieEncode))
    } else {
      setIsValid(false)
    }
  }, [cookieEncode])

  if (isValid === null) {
    return null
  }

  return isValid ? children : <Navigate to="/login" />
}

export function AuthRoute() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  )
}