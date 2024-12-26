import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import Routes from './routes/routes.tsx'
import i18n from './lang/i18n.ts'
import store from './redux/store/index.ts'
import { Provider } from 'react-redux'

const renderApp = () => {
  if (import.meta.env.VITE_APP_NODE_ENV === 'production') {
    console.log = () => { }
  }

  createRoot(document.getElementById('appWrapper')!).render(
    <StrictMode>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <Routes />
        </I18nextProvider>
      </Provider>
    </StrictMode>,
  )
}

renderApp()
