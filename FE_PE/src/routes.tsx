import { createBrowserRouter, Navigate } from "react-router";
import { Notes } from "./pages/app/Notes";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { NotePage } from "./pages/app/NotePage";

export const routes = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <Navigate to="/notes" replace />,
  },
  {
    path: "auth",
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },
  {
    path: "notes",
    Component: Notes,
    children: [{ path: ":id", Component: NotePage }],
  },
]);
