import { TokenDecodeType } from "../../types/smtrack/constants/constantsType"
import Cookies, { CookieSetOptions } from "universal-cookie"
import CryptoJS from "crypto-js"
import { UserRole } from "../../types/smtrack/users/usersType"

const accessToken = (tokenObject: TokenDecodeType) => CryptoJS.AES.encrypt(JSON.stringify(tokenObject), `${import.meta.env.VITE_APP_SECRETKEY}`)
const cookieDecodeObject = (cookieEncode: string) => CryptoJS.AES.decrypt(cookieEncode, `${import.meta.env.VITE_APP_SECRETKEY}`)

const cookies = new Cookies()

const expiresDate = () => {
  const expirationDate = new Date()
  return expirationDate.setHours(expirationDate.getHours() + 240) // 8 วันนับจากวันนี้
}

export const cookieOptions: CookieSetOptions = {
  path: '/',
  expires: new Date(expiresDate()), // 8 วันนับจากวันนี้
  maxAge: Number(import.meta.env.VITE_APP_MAXAGE * 24 * 60 * 60),
  domain: import.meta.env.VITE_APP_NODE_ENV === 'development' ? 'localhost' : import.meta.env.VITE_APP_DOMAIN, // ถ้าไม่ต้องการใช้ domain ให้คอมเมนต์หรือเอาบรรทัดนี้ออก
  secure: true, // ใช้ secure cookies เฉพาะเมื่อทำงานบน HTTPS
  httpOnly: false, // กำหนดเป็น true ถ้าต้องการให้ cookies สามารถเข้าถึงได้จากเซิร์ฟเวอร์เท่านั้น
  sameSite: 'strict' // ตัวเลือก 'strict', 'lax', หรือ 'none'
}

const getRoleLabel = (role: UserRole | undefined, t: (key: string) => string): string => {
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

export { accessToken, cookieDecodeObject, getRoleLabel, cookies }
