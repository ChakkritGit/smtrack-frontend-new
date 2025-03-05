import './index.css'
import '@react-pdf-viewer/core/lib/styles/index.css'
import 'react-loading-skeleton/dist/skeleton.css'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import Routes from './routes/routes.tsx'
import i18n from './lang/i18n.ts'
import store from './redux/store/index.ts'
import { Toaster } from 'react-hot-toast'

const renderApp = () => {
  if (import.meta.env.VITE_APP_NODE_ENV === 'production') {
    console.log = () => {}
  }

  createRoot(document.getElementById('appWrapper')!).render(
    <StrictMode>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <Routes />
          <Toaster position='bottom-right' reverseOrder={false} />
        </I18nextProvider>
      </Provider>
    </StrictMode>
  )
}

renderApp()
