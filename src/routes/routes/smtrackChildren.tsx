import { lazy, Suspense } from 'react'
import { RouteObject } from 'react-router-dom'
import {
  HomeSkeleton,
  DashboardSkeleton,
  UserSkeleton,
  ManageSkeleton
} from '../../components/skeleton'
import { HideFlashFW, HideSetting } from '../../middleware/Auth'
import ErrorScreen from '../error/error'
const Home = lazy(() => import('../../pages/home/home'))
const Dashboard = lazy(() => import('../../pages/dashboard/smtrack/dashboard'))
const Users = lazy(() => import('../../pages/users/users'))
const Management = lazy(
  () => import('../../pages/management/smtrack/management')
)
const Warranty = lazy(() => import('../../pages/warranty/warranty'))
const FullChart = lazy(() => import('../../pages/dashboard/smtrack/fullChart'))
const FullTable = lazy(() => import('../../pages/dashboard/smtrack/fullTable'))
const PreviewPDF = lazy(() => import('../../components/pdf/previewPdf'))
const Repair = lazy(() => import('../../pages/repair/repair'))

const smtrackChildren: RouteObject[] = [
  {
    path: '/',
    element: (
      <Suspense fallback={<HomeSkeleton />}>
        <Home />
      </Suspense>
    ),
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard',
    element: (
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    ),
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard/chart',
    element: (
      <Suspense fallback={<>123</>}>
        <FullChart />
      </Suspense>
    ),
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard/chart/preview',
    element: (
      <Suspense fallback={<div>123</div>}>
        <PreviewPDF />
      </Suspense>
    ),
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard/table',
    element: (
      <Suspense fallback={<>123</>}>
        <FullTable />
      </Suspense>
    ),
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
        element: (
          <Suspense fallback={<UserSkeleton />}>
            <Users />
          </Suspense>
        ),
        errorElement: <ErrorScreen />
      },
      {
        path: 'management',
        element: (
          <Suspense fallback={<ManageSkeleton />}>
            <Management />
          </Suspense>
        ),
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
    element: (
      <Suspense fallback={<>123</>}>
        <Warranty />
      </Suspense>
    ),
    errorElement: <ErrorScreen />
  },
  {
    path: 'repair',
    element: (
      <Suspense fallback={<>123</>}>
        <Repair />
      </Suspense>
    ),
    errorElement: <ErrorScreen />
  },
  {
    path: 'settings',
    element: <>settings</>,
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
          element: (
            <Suspense fallback={<span>Loading...</span>}>
              <></>
            </Suspense>
          ),
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
        element: (
          <Suspense fallback={<span>Loading...</span>}>
            <>management/flasher</>
          </Suspense>
        ),
        errorElement: <ErrorScreen />
      }
    ]
  }
]

export { smtrackChildren }
