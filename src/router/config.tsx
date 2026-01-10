
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Programs from "../pages/programs/page";
import ProgramDetail from "../pages/programs/detail/page";
import Blogs from "../pages/blogs/page";
import BlogDetail from "../pages/blogs/detail/page";
import AdminLogin from "../pages/admin/login/page";
import AdminDashboard from "../pages/admin/dashboard/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/programs",
    element: <Programs />,
  },
  {
    path: "/programs/:id",
    element: <ProgramDetail />,
  },
  {
    path: "/blogs",
    element: <Blogs />,
  },
  {
    path: "/blogs/:id",
    element: <BlogDetail />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
