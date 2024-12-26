import { TokenDecodeType } from "../../types/smtrack/constants/constantsType"
import { TokenType } from "../../types/smtrack/utilsRedux/utilsReduxType"

// redux/types/toggleTypes.js
const COOKIE_DECODE = 'COOKIE_DECODE'
const COOKIE_ENCODE = 'COOKIE_ENCODE'
const TOKEN_DECODE = 'TOKEN_DECODE'
const TMS_MODE = 'TMS_MODE'
const IS_EXPAND = 'IS_EXPAND'

interface UtilsState {
  cookieEncode?: string;
  cookieDecode?: TokenDecodeType;
  tokenDecode?: TokenType;
  tmsMode: boolean;
  isExpand: boolean;
}

type UtilsAction =
  | { type: typeof COOKIE_ENCODE; payload: string }
  | { type: typeof COOKIE_DECODE; payload: TokenDecodeType }
  | { type: typeof TOKEN_DECODE; payload: TokenType }
  | { type: typeof TMS_MODE }
  | { type: typeof IS_EXPAND }

export { COOKIE_ENCODE, COOKIE_DECODE, TOKEN_DECODE, TMS_MODE, IS_EXPAND }
export type { UtilsState, UtilsAction }
