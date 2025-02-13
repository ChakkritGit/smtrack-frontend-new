import { TokenDecodeType } from '../../types/smtrack/constants/constantsType'
import Cookies, { CookieSetOptions } from 'universal-cookie'
import CryptoJS from 'crypto-js'
import { UserRole } from '../../types/global/users/usersType'
import { DeviceType } from '../../types/smtrack/devices/deviceType'
import { Dispatch } from 'redux'
import { AxiosError } from 'axios'
import Swal from 'sweetalert2'

const accessToken = (tokenObject: TokenDecodeType) =>
  CryptoJS.AES.encrypt(
    JSON.stringify(tokenObject),
    `${import.meta.env.VITE_APP_SECRETKEY}`
  )
const cookieDecodeObject = (cookieEncode: string) =>
  CryptoJS.AES.decrypt(cookieEncode, `${import.meta.env.VITE_APP_SECRETKEY}`)

const cookies = new Cookies()

const expiresDate = () => {
  const expirationDate = new Date()
  return expirationDate.setHours(expirationDate.getHours() + 240) // 8 วันนับจากวันนี้
}

export const cookieOptions: CookieSetOptions = {
  path: '/',
  expires: new Date(expiresDate()), // 8 วันนับจากวันนี้
  maxAge: Number(import.meta.env.VITE_APP_MAXAGE * 24 * 60 * 60),
  domain:
    import.meta.env.VITE_APP_NODE_ENV === 'development'
      ? 'localhost'
      : import.meta.env.VITE_APP_DOMAIN, // ถ้าไม่ต้องการใช้ domain ให้คอมเมนต์หรือเอาบรรทัดนี้ออก
  secure: true, // ใช้ secure cookies เฉพาะเมื่อทำงานบน HTTPS
  httpOnly: false, // กำหนดเป็น true ถ้าต้องการให้ cookies สามารถเข้าถึงได้จากเซิร์ฟเวอร์เท่านั้น
  sameSite: 'strict' // ตัวเลือก 'strict', 'lax', หรือ 'none'
}

const getRoleLabel = (
  role: UserRole | undefined | String,
  t: (key: string) => string
): string => {
  switch (role) {
    case UserRole.SUPER:
      return t('levelSuper')
    case UserRole.SERVICE:
      return t('levelService')
    case UserRole.ADMIN:
      return t('levelAdmin')
    case UserRole.USER:
      return t('levelUser')
    case UserRole.LEGACY_ADMIN:
      return t('legacyAdmin')
    case UserRole.LEGACY_USER:
      return t('legacyUser')
    default:
      return t('levelGuest')
  }
}

const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

const calulateDate = (devicesData: DeviceType) => {
  const { warranty } = devicesData
  const today = new Date()
  const expiredDate = new Date(String(warranty[0]?.expire))
  // Use the expiredDate directly
  const timeDifference = expiredDate.getTime() - today.getTime()
  const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

  let remainingDays = daysRemaining
  let years = 0
  let months = 0

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  while (remainingDays >= 365) {
    if (isLeapYear(today.getFullYear() + years)) {
      if (remainingDays >= 366) {
        remainingDays -= 366
        years++
      } else {
        break
      }
    } else {
      remainingDays -= 365
      years++
    }
  }

  let currentMonth = today.getMonth()
  while (remainingDays >= daysInMonth[currentMonth]) {
    if (currentMonth === 1 && isLeapYear(today.getFullYear() + years)) {
      if (remainingDays >= 29) {
        remainingDays -= 29
        months++
      } else {
        break
      }
    } else {
      remainingDays -= daysInMonth[currentMonth]
      months++
    }
    currentMonth = (currentMonth + 1) % 12
  }

  return {
    daysRemaining,
    years,
    months,
    remainingDays
  }
}

const updateLocalStorageAndDispatch = (
  key: string,
  id: string | undefined,
  action: Function,
  dispatch: Dispatch
) => {
  cookies.set(key, String(id), cookieOptions)
  dispatch(action(String(id)))
}

const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    console.error(error.response?.data.message)
  } else {
    console.error(error)
  }
}

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-ghost bg-red-500",
    cancelButton: "btn btn-primary",
  },
  buttonsStyling: false,
})

export {
  accessToken,
  cookieDecodeObject,
  getRoleLabel,
  calulateDate,
  cookies,
  updateLocalStorageAndDispatch,
  handleApiError,
  swalWithBootstrapButtons
}
