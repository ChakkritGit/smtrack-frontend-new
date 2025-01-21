// redux/reducers/toggleReducer.js
import { cookies } from '../../constants/utils/utilsConstants'
import { COOKIE_ENCODE, COOKIE_DECODE, TOKEN_DECODE, TMS_MODE, UtilsState, UtilsAction, IS_EXPAND, USER_PROFILE, GLOBAL_SEARCH, THEME_MODE, WARD_ID, DEVICE_ID, HOS_ID } from '../types/utilsTypes'

const initialState: UtilsState = {
  cookieEncode: cookies.get('tokenObject'),
  cookieDecode: undefined,
  tokenDecode: undefined,
  userProfile: undefined,
  globalSearch: '',
  themeMode: localStorage.getItem("theme") ?? "light",
  tmsMode: cookies.get('tmsMode') ?? false,
  isExpand: localStorage.getItem('expandaside') === 'true',
  hosId: cookies.get('hosId'),
  wardId: cookies.get('wardId'),
  deviceId: cookies.get('deviceId')
}

const utilsReducer = (state = initialState, action: UtilsAction): UtilsState => {
  switch (action.type) {
    case COOKIE_ENCODE:
      return { ...state, cookieEncode: action.payload }
    case COOKIE_DECODE:
      return { ...state, cookieDecode: action.payload }
    case TOKEN_DECODE:
      return { ...state, tokenDecode: action.payload }
    case USER_PROFILE:
      return { ...state, userProfile: action.payload }
    case TMS_MODE:
      return { ...state, tmsMode: !state.tmsMode }
    case IS_EXPAND:
      return { ...state, isExpand: !state.isExpand }
    case GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload }
    case THEME_MODE:
      return { ...state, themeMode: action.payload }
    case HOS_ID:
      return { ...state, hosId: action.payload }
    case WARD_ID:
      return { ...state, wardId: action.payload }
    case DEVICE_ID:
      return { ...state, deviceId: action.payload }
    default:
      return state
  }
}

export default utilsReducer
