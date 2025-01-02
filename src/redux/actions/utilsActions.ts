// redux/actions/toggleActions.js
import { TokenDecodeType } from '../../types/smtrack/constants/constantsType'
import { TokenType, UserProfileType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { COOKIE_ENCODE, COOKIE_DECODE, TOKEN_DECODE, USER_PROFILE, TMS_MODE, IS_EXPAND, GLOBAL_SEARCH, THEME_MODE, WARD_ID } from '../types/utilsTypes'

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

const setUserProfile = (userData: UserProfileType) => ({
  type: USER_PROFILE,
  payload: userData,
})

const setTmsMode = () => ({
  type: TMS_MODE,
})

const setIsExpand = () => ({
  type: IS_EXPAND,
})

const setSearch = (search: string) => ({
  type: GLOBAL_SEARCH,
  payload: search,
})

const setTheme = (theme: string) => ({
  type: THEME_MODE,
  payload: theme,
})

const setWardId = (id: string) => ({
  type: WARD_ID,
  payload: id,
})

export { setCookieEncode, setCookieDecode, setTokenDecode, setUserProfile, setTmsMode, setIsExpand, setSearch, setTheme, setWardId }