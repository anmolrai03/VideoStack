import React, { lazy, Suspense } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromChildren,
} from "react-router-dom";

import Layout from "../Layout";

// Lazy-loaded pages
const Home = lazy(() => import("../pages/Home/Home"));
const Auth = lazy(() => import("../pages/Auth/Auth"));
const VideoProcess = lazy(() => import("../pages/VideoProcess"));
const Test = lazy(() => import("../pages/Test"));

// Loading component
import Loading from "../pages/Loading/Loading";

function RootRouter() {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <>
        {/* UNPROTECTED ROUTES STARTS HERE */}
        <Route
          path="/video/tools"
          element={
            <Suspense fallback={<Loading />}>
              <VideoProcess />
            </Suspense>
          }
        />
        <Route
          path="/auth"
          element={
            <Suspense fallback={<Loading />}>
              <Auth />
            </Suspense>
          }
        />
        {/* UNPROTECTED ROUTES ENDS HERE */}

        {/* PROTECTED ROUTES STARTS HERE */}
        <Route path="/" element={<Layout />}>
          <Route index
            element={
              <Suspense fallback={<Loading />}>
                <Home />
              </Suspense>
            }
          />
          {/* Lazy-loaded test page */}
          <Route
            path="test"
            element={
              <Suspense fallback={<Loading />}>
                <Test />
              </Suspense>
            }
          />
        </Route>
        {/* PROTECTED ROUTES ENDS HERE */}

      </>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default RootRouter;
