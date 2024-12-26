import { Suspense } from "react";
import { RouteObject } from "react-router-dom";

const smtrackChildren: RouteObject[] = [
  {
    path: "/",
    element: <Suspense fallback={<span>Loading...</span>}>
      <>Home</>
    </Suspense>,
    errorElement: <></>
  },
  {
    path: "dashboard",
    element: <>Dashboard</>,
    errorElement: <></>
  },
  {
    element: <>Manage</>,
    errorElement: <></>,
    children: [
      {
        path: "permission",
        element: <></>,
        errorElement: <></>
      },
      {
        path: "management",
        element: <></>,
        errorElement: <></>
      },
      {
        path: "management/:id",
        element: <></>,
        errorElement: <></>
      },
      {
        path: 'logs',
        element: <></>,
        errorElement: <></>
      }
    ],
  },
  {
    path: "warranty",
    element: <></>,
    errorElement: <></>
  },
  {
    path: "repair",
    element: <></>,
    errorElement: <></>
  },
  {
    path: "settings",
    element: <></>,
    errorElement: <></>
  },
  {
    path: "dashboard/chart",
    element: <></>,
    errorElement: <></>
  },
  {
    path: "dashboard/chart/preview",
    element: <></>,
    errorElement: <></>
  },
  {
    path: "dashboard/table",
    element: <></>,
    errorElement: <></>
  },
  {
    path: "dashboard/chart/compare",
    element: <></>,
    errorElement: <></>
  },
  {
    path: "changeLog",
    element: <></>,
    errorElement: <></>
  },
  ...(import.meta.env.VITE_APP_NODE_ENV === 'development'
    ? [
      {
        path: "test",
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
    element: <></>,
    errorElement: <></>,
    children: [
      {
        path: "management/flasher",
        element: <Suspense fallback={<span>Loading...</span>}>
          <></>
        </Suspense>,
        errorElement: <></>
      },
    ]
  }
]

export { smtrackChildren }
