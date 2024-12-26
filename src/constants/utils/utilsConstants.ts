import { TokenDecodeType } from "../../types/smtrack/constants/constantsType"
import Cookies, { CookieSetOptions } from "universal-cookie"
import CryptoJS from "crypto-js"

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

export { accessToken, cookieDecodeObject, cookies }
