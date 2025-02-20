import { createBrowserRouter } from 'react-router-dom'
import { smtrackChildren } from './smtrackChildren'
import { tmsChildren } from './tmsChildren'
import MainSmtrack from '../../main/smtrack/main'
import MainTms from '../../main/tms/main'
import { AuthRoute } from '../../middleware/authprotect'
import { LogoutAuth } from '../../middleware/Auth'
import NotFound from '../error/notFound'

const router = (role: string, tmsMode: boolean) =>
  createBrowserRouter([
    {
      path: '/',
      element: <AuthRoute />,
      children: [
        {
          path: '/',
          element:
            role !== 'LEGACY_ADMIN' && role !== 'LEGACY_USER' && !tmsMode ? (
              <MainSmtrack />
            ) : (
              <MainTms />
            ),
          errorElement: <></>,
          children:
            role !== 'LEGACY_ADMIN' && role !== 'LEGACY_USER' && !tmsMode
              ? smtrackChildren
              : tmsChildren
        }
      ]
    },
    {
      path: '/privacy-policy',
      element: <></>
    },
    {
      path: '/terms-conditions',
      element: <></>
    },
    {
      path: '/support',
      element: <></>
    },
    {
      path: 'app',
      element: <></>,
      errorElement: <></>
    },
    {
      path: '/login',
      element: <LogoutAuth />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])

export { router }
