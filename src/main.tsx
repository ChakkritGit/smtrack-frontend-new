import './index.css'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
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

class AppRenderer {
  private static instance: AppRenderer

  private constructor () {
    this.disableConsoleInProduction()
    this.renderApp()
  }

  public static getInstance (): AppRenderer {
    if (!AppRenderer.instance) {
      AppRenderer.instance = new AppRenderer()
    }
    return AppRenderer.instance
  }

  private disableConsoleInProduction (): void {
    if (import.meta.env.VITE_APP_NODE_ENV === 'production') {
      console.log = () => {}
      // console.error = () => {}
      // console.warn = () => {}
    }
  }

  private renderApp (): void {
    const rootElement = document.getElementById('appWrapper')

    if (!rootElement) {
      console.error('❌ Failed to find root element: #appWrapper')
      return
    }

    createRoot(rootElement).render(
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
}

AppRenderer.getInstance()
