import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import AuthNavigator from "./Layout/AuthNavigator";
import Pagenotfound from "./Components/PageNotFound";
import LoadingSpinner from "./Components/LoadingSpinner/LoadingSpinner"; // Create a loading component
import ColorMaster from "./Pages/Color Master/ColorMaster";
import './GlobalStyle/GlobalTheme.css'
import './App.css'
import Layout2Master from "./Pages/Layout2/Layout2Master";
import Layout3Master from "./Pages/Layout3/Layout3Master";
import Layout4Master from "./Pages/Layout4/Layout4Master";
import Layout5Master from "./Pages/Layout5/Layout5Master";
import ProcessMaster from "./Pages/ProcessMaster/ProcessMaster";
import PlatingPolishMaster from "./Pages/PlatingPolishMaster/PlatingPolishMaster";
import UnitMaster from "./Pages/UnitMaster/UnitMaster";
import Layout1Master from "./Pages/Layout1/Layout1Master";
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
      {
        path: "color",
        element: withSuspense(ColorMaster),
      },
      {
        path: "stone",
        element: withSuspense(Layout2Master),
      },
      {
        path: "layout1",
        element: withSuspense(Layout1Master),
      },
      {
        path: "artisan",
        element: withSuspense(Layout3Master),
      },
      {
        path: "staff",
        element: withSuspense(Layout4Master),
      },
      {
        path: "customer",
        element: withSuspense(Layout5Master),
      },
      {
        path: "process",
        element: withSuspense(ProcessMaster),
      },
      {
        path: "platingpolish",
        element: withSuspense(PlatingPolishMaster),
      },
      {
        path: "unit",
        element: withSuspense(UnitMaster),
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
