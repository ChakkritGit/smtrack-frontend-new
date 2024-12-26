// redux/actions/toggleActions.js
import { TokenDecodeType } from '../../types/smtrack/constants/constantsType'
import { TokenType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { COOKIE_ENCODE, COOKIE_DECODE, TOKEN_DECODE, TMS_MODE, IS_EXPAND } from '../types/utilsTypes'

const setCookieEncode = (dataEncode: string) => ({
  type: COOKIE_ENCODE,
  payload: dataEncode,
})

const setCookieDecode = (dataDecode: TokenDecodeType) => ({
  type: COOKIE_DECODE,
  payload: dataDecode,
})

const setTokenDecode = (tokenDecode: TokenType) => ({
  type: TOKEN_DECODE,
  payload: tokenDecode,
})

const setTmsMode = () => ({
  type: TMS_MODE,
})

const setIsExpand = () => ({
  type: IS_EXPAND,
})

export { setCookieEncode, setCookieDecode, setTokenDecode, setTmsMode, setIsExpand }