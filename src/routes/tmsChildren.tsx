import { lazy, Suspense } from 'react'
import { HideSettingTms } from '../middleware/Auth'
import {
  DashboardSkeletonTms,
  HomeSkeletonTms,
  UserSkeleton
} from '../components/skeleton'
import { RouteObject } from 'react-router-dom'
import ManagementTms from '../pages/management/managementTms'
const HomeTms = lazy(() => import('../pages/home/homeTms'))
const DashboardTms = lazy(() => import('../pages/dashboard/tms/dashboardTms'))
const Users = lazy(() => import('../pages/users/users'))
const FullChartTms = lazy(() => import('../pages/dashboard/tms/fullChartTms'))
const FullTableTms = lazy(() => import('../pages/dashboard/tms/fullTableTms'))

const tmsChildren: RouteObject[] = [
  {
    path: '/',
    element: (
      <Suspense fallback={<HomeSkeletonTms />}>
        <HomeTms />
      </Suspense>
    ),
    errorElement: <></>
  },
  {
    path: 'dashboard',
    element: (
      <Suspense fallback={<DashboardSkeletonTms />}>
        <DashboardTms />
      </Suspense>
    ),
    errorElement: <></>
  },
  {
    element: <HideSettingTms />,
    errorElement: <></>,
    children: [
      {
        path: 'permission',
        element: (
          <Suspense fallback={<UserSkeleton />}>
            <Users />
          </Suspense>
        ),
        errorElement: <></>
      },
      {
        path: 'management',
        element: (
          <Suspense fallback={<span>Loading...</span>}>
            <ManagementTms />
          </Suspense>
        ),
        errorElement: <></>
      }
    ]
  },
  {
    path: 'dashboard/chart',
    element: (
      <Suspense fallback={<span>Loading...</span>}>
        <FullChartTms />
      </Suspense>
    ),
    errorElement: <>err</>
  },
  {
    path: 'dashboard/chart/preview',
    element: (
      <Suspense fallback={<span>Loading...</span>}>
        <></>
      </Suspense>
    ),
    errorElement: <></>
  },
  {
    path: 'dashboard/table',
    element: (
      <Suspense fallback={<span>Loading...</span>}>
        <FullTableTms />
      </Suspense>
    ),
    errorElement: <>err</>
  },
  {
    path: 'settings',
    element: (
      <Suspense fallback={<span>Loading...</span>}>
        <>Setting</>
      </Suspense>
    ),
    errorElement: <></>
  },
  {
    path: 'changeLog',
    element: (
      <Suspense fallback={<span>Loading...</span>}>
        <></>
      </Suspense>
    ),
    errorElement: <></>
  }
]

export { tmsChildren }
