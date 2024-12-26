// redux/reducers/toggleReducer.js
import { cookies } from '../../constants/utils/utilsConstants'
import { COOKIE_ENCODE, COOKIE_DECODE, TOKEN_DECODE, TMS_MODE, UtilsState, UtilsAction, IS_EXPAND } from '../types/utilsTypes'

const initialState: UtilsState = {
  cookieEncode: cookies.get('tokenObject'),
  cookieDecode: undefined,
  tokenDecode: undefined,
  tmsMode: false,
  isExpand: localStorage.getItem('expandaside') === 'true',
}

const utilsReducer = (state = initialState, action: UtilsAction): UtilsState => {
  switch (action.type) {
    case COOKIE_ENCODE:
      return { ...state, cookieEncode: action.payload }
    case COOKIE_DECODE:
      return { ...state, cookieDecode: action.payload }
    case TOKEN_DECODE:
      return { ...state, tokenDecode: action.payload }
    case TMS_MODE:
      return { ...state, tmsMode: !state.tmsMode }
    case IS_EXPAND:
      return { ...state, isExpand: !state.isExpand }
    default:
      return state
  }
}

export default utilsReducer
