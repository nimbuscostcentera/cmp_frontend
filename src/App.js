import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import AuthNavigator from "./Layout/AuthNavigator";
import Pagenotfound from "./Components/PageNotFound";
import LoadingSpinner from "./Components/LoadingSpinner/LoadingSpinner"; // Create a loading component

// Lazy load all page components
const LoginPage = lazy(() => import("./Pages/Login"));
const Home = lazy(() => import("./Pages/Home/Home"));
const File = lazy(() => import("./Pages/File"));

const withSuspense = (Component) => (
  <Suspense fallback={<LoadingSpinner size="large" />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: withSuspense(LoginPage),
      },
    ],
  },
  {
    path: "auth",
    element: <AuthNavigator />,
    errorElement: <Pagenotfound />,
    children: [
      {
        path: "home",
        element: withSuspense(Home),
      },
      {
        path: "file",
        element: withSuspense(File),
      },
    ],
  },
  {
    path: "*",
    element: <Pagenotfound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
