import React, { lazy, Suspense } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromChildren,
} from "react-router-dom";

import Layout from "../Layout";
import ProtectedRoute from "./ProtectedRoute";

// Lazy-loaded pages
const Home = lazy(() => import("../pages/Home/Home"));
const Auth = lazy(() => import("../pages/Auth/Auth"));
const VideoProcess = lazy(() => import("../pages/VideoProcess"));
const Feed = lazy( ()=> import("../pages/Feed/Feed") );
const MyVideos = lazy(() => import("../pages/MyVideos/MyVideos"));
const Upload = lazy(() => import("../pages/Upload/Upload"));
const VideoPlayer = lazy(() => import("../pages/VideoPlayer/VideoPlayer"));
const Settings = lazy(() => import("../pages/Settings/Settings"));
const Test = lazy(() => import("../pages/Test"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

// Loading component
import Loading from "../pages/Loading/Loading";
import StreamPage from "../pages/StreamPage/StreamPage";
import Navbar from "../components/NavBar/NavBar";


function RootRouter() {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <>
        {/* UNPROTECTED ROUTES STARTS HERE */}
        <Route path="/"
            element={
              <Suspense fallback={<Loading />}>
                <Navbar />
                <Home />
              </Suspense>
            }
          />
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
          
          {/* Lazy-loaded test page */}
          <Route
            path="feed"
            element={
              <ProtectedRoute >
                <Suspense fallback={<Loading />}>
                <Feed />
              </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="my-videos"
            element={
              <ProtectedRoute>
                <Suspense fallback={<Loading />}>
                  <MyVideos />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="upload"
            element={
              <ProtectedRoute>
                <Suspense fallback={<Loading />}>
                  <Upload />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="video/:id"
            element={
              <ProtectedRoute>
                <Suspense fallback={<Loading />}>
                  <VideoPlayer />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <Suspense fallback={<Loading />}>
                  <Settings />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="stream/:videoId"
            element={
              <ProtectedRoute >
                <Suspense fallback={<Loading />}>
                  <StreamPage />
                </Suspense>
              </ProtectedRoute>
              
            }
          />

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

        {/* CATCH-ALL 404 ROUTE */}
        <Route
          path="*"
          element={
            <Suspense fallback={<Loading />}>
              <NotFound />
            </Suspense>
          }
        />
      </>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default RootRouter;
