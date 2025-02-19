import { lazy, Suspense } from 'react'
import { RouteObject } from 'react-router-dom'
import {
  HomeSkeleton,
  DashboardSkeleton,
  UserSkeleton,
  ManageSkeleton
} from '../components/skeleton'
import { HideFlashFW, HideSetting } from '../middleware/Auth'
const Home = lazy(() => import('../pages/home/home'))
const Dashboard = lazy(() => import('../pages/dashboard/smtrack/dashboard'))
const Users = lazy(() => import('../pages/users/users'))
const Management = lazy(() => import('../pages/management/smtrack/management'))
const Warranty = lazy(() => import('../pages/warranty/warranty'))
const FullChart = lazy(() => import('../pages/dashboard/smtrack/fullChart'))
const FullTable = lazy(() => import('../pages/dashboard/smtrack/fullTable'))

const smtrackChildren: RouteObject[] = [
  {
    path: '/',
    element: (
      <Suspense fallback={<HomeSkeleton />}>
        <Home />
      </Suspense>
    ),
    errorElement: <>error</>
  },
  {
    path: 'dashboard',
    element: (
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    ),
    errorElement: <>error</>
  },
  {
    path: 'dashboard/chart',
    element: (
      <Suspense fallback={<>123</>}>
        <FullChart />
      </Suspense>
    ),
    errorElement: <></>
  },
  {
    path: 'dashboard/chart/preview',
    element: <>dashboard/chart/preview</>,
    errorElement: <></>
  },
  {
    path: 'dashboard/table',
    element: (
      <Suspense fallback={<>123</>}>
        <FullTable />
      </Suspense>
    ),
    errorElement: <></>
  },
  {
    path: 'dashboard/chart/compare',
    element: <>dashboard/chart/compare</>,
    errorElement: <></>
  },
  {
    element: <HideSetting />,
    errorElement: <></>,
    children: [
      {
        path: 'permission',
        element: (
          <Suspense fallback={<UserSkeleton />}>
            <Users />
          </Suspense>
        ),
        errorElement: <>error</>
      },
      {
        path: 'management',
        element: (
          <Suspense fallback={<ManageSkeleton />}>
            <Management />
          </Suspense>
        ),
        errorElement: <></>
      },
      {
        path: 'management/:id',
        element: <>management/:id</>,
        errorElement: <></>
      },
      {
        path: 'logs',
        element: <>logs</>,
        errorElement: <></>
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
    errorElement: <></>
  },
  {
    path: 'repair',
    element: <>repair</>,
    errorElement: <></>
  },
  {
    path: 'settings',
    element: <>settings</>,
    errorElement: <></>
  },
  {
    path: 'changeLog',
    element: <>changeLog</>,
    errorElement: <></>
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
          errorElement: <></>
        }
      ]
    : []),
  {
    element: <HideFlashFW />,
    errorElement: <></>,
    children: [
      {
        path: 'management/flasher',
        element: (
          <Suspense fallback={<span>Loading...</span>}>
            <>management/flasher</>
          </Suspense>
        ),
        errorElement: <></>
      }
    ]
  }
]

export { smtrackChildren }
