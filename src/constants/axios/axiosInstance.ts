import axios from 'axios'
import store from '../../redux/store/index'
import { accessToken } from '../../constants/utils/utilsConstants'
import { setCookieEncode } from '../../redux/actions/utilsActions'

const BASE_URL = import.meta.env.VITE_APP_API

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  config => {
    const state = store.getState()
    const token = state.utils.cookieDecode?.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const state = store.getState()
        const storeRefreshToken = state.utils.cookieDecode?.refreshToken
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          token: storeRefreshToken
        })

        const { token, refreshToken } = response.data.data

        const tokenObject = {
          hosId: state.utils.cookieDecode?.hosId,
          refreshToken: refreshToken,
          token: token,
          id: state.utils.cookieDecode?.id,
          wardId: state.utils.cookieDecode?.wardId
        }

        store.dispatch(setCookieEncode(String(accessToken(tokenObject))))

        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`
        originalRequest.headers['Authorization'] = `Bearer ${token}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error('Refresh token expired or invalid:', refreshError)
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
