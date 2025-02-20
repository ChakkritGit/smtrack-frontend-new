import { lazy, Suspense } from 'react'
import { HideSettingManageTms, HideSettingTms } from '../../middleware/Auth'
import {
  DashboardSkeletonTms,
  HomeSkeletonTms,
  ManageSkeleton,
  UserSkeleton
} from '../../components/skeleton'
import { RouteObject } from 'react-router-dom'
import FullDashboardSkeleton from '../../components/skeleton/dashboard/fullDashboardSkeleton'
import ErrorScreen from '../error/error'
const HomeTms = lazy(() => import('../../pages/home/homeTms'))
const DashboardTms = lazy(
  () => import('../../pages/dashboard/tms/dashboardTms')
)
const Users = lazy(() => import('../../pages/users/users'))
const FullChartTms = lazy(
  () => import('../../pages/dashboard/tms/fullChartTms')
)
const FullTableTms = lazy(
  () => import('../../pages/dashboard/tms/fullTableTms')
)
const ManagementTms = lazy(
  () => import('../../pages/management/tms/managementTms')
)
const PreviewPDF = lazy(() => import('../../components/pdf/previewPdf'))

const tmsChildren: RouteObject[] = [
  {
    path: '/',
    element: (
      <Suspense fallback={<HomeSkeletonTms />}>
        <HomeTms />
      </Suspense>
    ),
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard',
    element: (
      <Suspense fallback={<DashboardSkeletonTms />}>
        <DashboardTms />
      </Suspense>
    ),
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard/chart',
    element: (
      <Suspense fallback={<FullDashboardSkeleton />}>
        <FullChartTms />
      </Suspense>
    ),
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard/chart/preview',
    element: (
      <Suspense fallback={<FullDashboardSkeleton />}>
        <PreviewPDF />
      </Suspense>
    ),
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard/table',
    element: (
      <Suspense fallback={<FullDashboardSkeleton />}>
        <FullTableTms />
      </Suspense>
    ),
    errorElement: <ErrorScreen />
  },
  {
    element: <HideSettingTms />,
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
      }
    ]
  },
  {
    element: <HideSettingManageTms />,
    errorElement: <ErrorScreen />,
    children: [
      {
        path: 'management',
        element: (
          <Suspense fallback={<ManageSkeleton />}>
            <ManagementTms />
          </Suspense>
        ),
        errorElement: <ErrorScreen />
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
    errorElement: <ErrorScreen />
  }
]

export { tmsChildren }
