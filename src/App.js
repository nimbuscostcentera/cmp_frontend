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
import Layout7Master from "./Pages/Layout7/Layout7Master";
import Layout11Master from "./Pages/Layout11/Layout11Master";
import Layout13Master from "./Pages/Layout13/Layout13Master";
import Layout6Master from "./Pages/Layout6/Layout6Master";
import Layout8Master from "./Pages/Layout8/Layout8Mater";
import SpcpMaster from "./Pages/Spcp/SpcpMaster";
import Layout10Master from "./Pages/Layout10/Layout10Master";
import DesignMaster from "./Pages/DesignMaster/DesignMaster";
import Register from "./Pages/Register";
import UserMaster from "./Pages/UserMaster/UserMaster";
import Setup from "./Pages/Setup/setup";
import TabForm from "./Pages/OpeningTab/TabForm";
import MappingTcTable from "./Pages/MappingTc/MappingTcTable";
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
        path: "color",
        element: withSuspense(ColorMaster),
      },
      {
        path: "layout2",
        element: withSuspense(Layout2Master),
      },
      {
        path: "layout1",
        element: withSuspense(Layout1Master),
      },
      {
        path: "layout3",
        element: withSuspense(Layout3Master),
      },
      {
        path: "layout4",
        element: withSuspense(Layout4Master),
      },
      {
        path: "layout5",
        element: withSuspense(Layout5Master),
      },
      {
        path: "layout6",
        element: withSuspense(Layout6Master),
      },
      {
        path: "layout7",
        element: withSuspense(Layout7Master),
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
        path: "layout8",
        element: withSuspense(Layout8Master),
      },
      {
        path: "layout11",
        element: withSuspense(Layout11Master),
      },
      {
        path: "layout10",
        element: withSuspense(Layout10Master),
      },
      {
        path: "layout13",
        element: withSuspense(Layout13Master),
      },
      {
        path: "platingpolish",
        element: withSuspense(PlatingPolishMaster),
      },
      {
        path: "unit",
        element: withSuspense(UnitMaster),
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
