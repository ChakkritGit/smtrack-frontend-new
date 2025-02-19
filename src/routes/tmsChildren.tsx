import { lazy, Suspense } from 'react'
import { HideSettingTms } from '../middleware/Auth'
import {
  DashboardSkeletonTms,
  HomeSkeletonTms,
  ManageSkeleton,
  UserSkeleton
} from '../components/skeleton'
import { RouteObject } from 'react-router-dom'
import FullDashboardSkeleton from '../components/skeleton/dashboard/fullDashboardSkeleton'
const HomeTms = lazy(() => import('../pages/home/homeTms'))
const DashboardTms = lazy(() => import('../pages/dashboard/tms/dashboardTms'))
const Users = lazy(() => import('../pages/users/users'))
const FullChartTms = lazy(() => import('../pages/dashboard/tms/fullChartTms'))
const FullTableTms = lazy(() => import('../pages/dashboard/tms/fullTableTms'))
const ManagementTms = lazy(() => import('../pages/management/tms/managementTms'))
const PreviewPDF = lazy(() => import('../components/pdf/previewPdf'))

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
    path: 'dashboard/chart',
    element: (
      <Suspense fallback={<FullDashboardSkeleton />}>
        <FullChartTms />
      </Suspense>
    ),
    errorElement: <>err</>
  },
  {
    path: 'dashboard/chart/preview',
    element: (
      <Suspense fallback={<FullDashboardSkeleton />}>
        <PreviewPDF />
      </Suspense>
    ),
    errorElement: <></>
  },
  {
    path: 'dashboard/table',
    element: (
      <Suspense fallback={<FullDashboardSkeleton />}>
        <FullTableTms />
      </Suspense>
    ),
    errorElement: <>err</>
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
          <Suspense fallback={<ManageSkeleton />}>
            <ManagementTms />
          </Suspense>
        ),
        errorElement: <></>
      }
    ]
  },
  {
    path: 'settings',
    element: (
      <Suspense fallback={<span>Loading...</span>}>
        <>Setting</>
      </Suspense>
    ),
    errorElement: <></>
  }
]

export { tmsChildren }
