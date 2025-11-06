import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import AuthNavigator from "./Layout/AuthNavigator";
import Pagenotfound from "./Components/PageNotFound";
import LoadingSpinner from "./Components/LoadingSpinner/LoadingSpinner"; // Create a loading component
import "./GlobalStyle/GlobalTheme.css";
import "./App.css";

import SpcpMaster from "./Pages/Master/Spcp/SpcpMaster";
import LayoutMaster from "./Pages/Master/MasterLayouts/LayoutMaster";
import LayoutPrac from "./Pages/MasterLayout2/LayoutPrac";
import DesignMaster from "./Pages/Master/DesignMaster/DesignMaster";
import Register from "./Pages/Register";
import UserMaster from "./Pages/UserMaster/UserMaster";
import Setup from "./Pages/Setup/setup";
import TabForm from "./Pages/OpeningTab/TabForm";


import MappingTcTable from "./Pages/MappingTc/MappingTcTable";
import OpeningTabManager from "./Pages/OpeningTab/OpeningTabManager";
// import OpeningTabManager from "./Pages/OpeningTab/OpeningTabManager";
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
        path: "login",
        element: withSuspense(LoginPage),
      },
      {
        path: "register",
        element: withSuspense(Register),
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
        path: "layout",
        element: withSuspense(LayoutMaster),
      },

      {
        path: "layoutPrac",
        element: withSuspense(LayoutPrac),
      },
      {
        path: "spcp",
        element: withSuspense(SpcpMaster),
      },
      {
        path: "design",
        element: withSuspense(DesignMaster),
      },
      {
        path: "user",
        element: withSuspense(UserMaster),
      },
      {
        path: "setup",
        element: withSuspense(Setup),
      },
      {
        path: "tab",
        element: withSuspense(TabForm),
      },
      {
        path: "tab2",
        element: withSuspense(OpeningTabManager),
      },
      {
        path: "mappingtc",
        element: withSuspense(MappingTcTable),
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
