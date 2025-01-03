import { TokenDecodeType } from '../../types/smtrack/constants/constantsType'
import {
  TokenType,
  UserProfileType
} from '../../types/smtrack/utilsRedux/utilsReduxType'

// redux/types/toggleTypes.js
const COOKIE_DECODE = 'COOKIE_DECODE'
const COOKIE_ENCODE = 'COOKIE_ENCODE'
const TOKEN_DECODE = 'TOKEN_DECODE'
const USER_PROFILE = 'USER_PROFILE'
const TMS_MODE = 'TMS_MODE'
const IS_EXPAND = 'IS_EXPAND'
const GLOBAL_SEARCH = 'GLOBAL_SEARCH'
const THEME_MODE = 'THEME_MODE'
const WARD_ID = 'WARD_ID'
const DEVICE_ID = 'DEVICE_ID'

interface UtilsState {
  cookieEncode?: string
  cookieDecode?: TokenDecodeType
  tokenDecode?: TokenType
  userProfile?: UserProfileType
  globalSearch: string
  themeMode: string
  tmsMode: boolean
  isExpand: boolean
  wardId: string
  deviceId: string
}

type UtilsAction =
  | { type: typeof COOKIE_ENCODE; payload: string }
  | { type: typeof COOKIE_DECODE; payload: TokenDecodeType }
  | { type: typeof TOKEN_DECODE; payload: TokenType }
  | { type: typeof USER_PROFILE; payload: UserProfileType }
  | { type: typeof GLOBAL_SEARCH; payload: string }
  | { type: typeof THEME_MODE; payload: string }
  | { type: typeof TMS_MODE }
  | { type: typeof IS_EXPAND }
  | { type: typeof WARD_ID; payload: string }
  | { type: typeof DEVICE_ID; payload: string }

export {
  COOKIE_ENCODE,
  COOKIE_DECODE,
  USER_PROFILE,
  TOKEN_DECODE,
  TMS_MODE,
  IS_EXPAND,
  GLOBAL_SEARCH,
  THEME_MODE,
  WARD_ID,
  DEVICE_ID
}
export type { UtilsState, UtilsAction }
