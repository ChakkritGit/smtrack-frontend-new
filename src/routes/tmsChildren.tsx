import { lazy, Suspense } from 'react'
import { HideSettingTms } from '../middleware/Auth'
import { HomeSkeletonTms } from '../components/skeleton'
import { RouteObject } from 'react-router-dom'
const HomeTms = lazy(() => import('../pages/home/home.tms'))

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
      <Suspense fallback={<span>Loading...</span>}>
        <>Dashboard</>
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
          <Suspense fallback={<span>Loading...</span>}>
            <>Permission</>
          </Suspense>
        ),
        errorElement: <></>
      },
      {
        path: 'management',
        element: (
          <Suspense fallback={<span>Loading...</span>}>
            <>Management</>
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
  },
  {
    path: 'dashboard/chart',
    element: (
      <Suspense fallback={<span>Loading...</span>}>
        <></>
      </Suspense>
    ),
    errorElement: <></>
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
        <></>
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
