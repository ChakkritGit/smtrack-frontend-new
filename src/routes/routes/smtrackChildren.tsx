import { RouteObject } from 'react-router-dom'
import { HideFlashFW, HideSetting } from '../../middleware/Auth'
import ErrorScreen from '../error/error'
import Home from '../../pages/home/home'
import Dashboard from '../../pages/dashboard/smtrack/dashboard'
import FullChart from '../../pages/dashboard/smtrack/fullChart'
import PreviewPDF from '../../components/pdf/previewPdf'
import FullTable from '../../pages/dashboard/smtrack/fullTable'
import Users from '../../pages/users/users'
import Management from '../../pages/management/smtrack/management'
import Warranty from '../../pages/warranty/warranty'
import Repair from '../../pages/repair/repair'
import Settings from '../../pages/settings/settings'

const smtrackChildren: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard',
    element: <Dashboard />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard/chart',
    element: <FullChart />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard/chart/preview',
    element: <PreviewPDF />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard/table',
    element: <FullTable />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard/chart/compare',
    element: <>dashboard/chart/compare</>,
    errorElement: <ErrorScreen />
  },
  {
    element: <HideSetting />,
    errorElement: <ErrorScreen />,
    children: [
      {
        path: 'permission',
        element: <Users />,
        errorElement: <ErrorScreen />
      },
      {
        path: 'management',
        element: <Management />,
        errorElement: <ErrorScreen />
      },
      {
        path: 'management/:id',
        element: <>management/:id</>,
        errorElement: <ErrorScreen />
      },
      {
        path: 'logs',
        element: <>logs</>,
        errorElement: <ErrorScreen />
      }
    ]
  },
  {
    path: 'warranty',
    element: <Warranty />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'repair',
    element: <Repair />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'settings',
    element: <Settings />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'changeLog',
    element: <>changeLog</>,
    errorElement: <ErrorScreen />
  },
  ...(import.meta.env.VITE_APP_NODE_ENV === 'development'
    ? [
        {
          path: 'test',
          element: <>TEST</>,
          errorElement: <ErrorScreen />
        }
      ]
    : []),
  {
    element: <HideFlashFW />,
    errorElement: <ErrorScreen />,
    children: [
      {
        path: 'management/flasher',
        element: <>management/flasher</>,
        errorElement: <ErrorScreen />
      }
    ]
  }
]

export { smtrackChildren }
