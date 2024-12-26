import { Suspense } from "react"

const tmsChildren = [
  {
    path: "/",
    element: <Suspense fallback={<span>Loading...</span>}>
      <></>
    </Suspense>,
    errorElement: <></>
  },
  {
    path: "dashboard",
    element: <Suspense fallback={<span>Loading...</span>}>
      <></>
    </Suspense>,
    errorElement: <></>
  },
  {
    element: <></>,
    errorElement: <></>,
    children: [
      {
        path: "management",
        element: <Suspense fallback={<span>Loading...</span>}>
          <></>
        </Suspense>,
        errorElement: <></>
      },
    ]
  },
  {
    path: "settings",
    element: <Suspense fallback={<span>Loading...</span>}>
      <></>
    </Suspense>,
    errorElement: <></>
  },
  {
    path: "dashboard/chart",
    element: <Suspense fallback={<span>Loading...</span>}>
      <></>
    </Suspense>,
    errorElement: <></>
  },
  {
    path: "dashboard/chart/preview",
    element: <Suspense fallback={<span>Loading...</span>}>
      <></>
    </Suspense>,
    errorElement: <></>
  },
  {
    path: "dashboard/table",
    element: <Suspense fallback={<span>Loading...</span>}>
      <></>
    </Suspense>,
    errorElement: <></>
  },
  {
    path: "changeLog",
    element: <Suspense fallback={<span>Loading...</span>}>
      <></>
    </Suspense>,
    errorElement: <></>
  },
]

export { tmsChildren }
