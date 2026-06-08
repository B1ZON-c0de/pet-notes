import { createBrowserRouter, Navigate } from "react-router";

export const routes = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <Navigate to="/notes" replace />,
  },
  {
    path: "auth",
    children: [
      {
        path: "login",
        lazy: async () => {
          const { default: Component } = await import("./pages/auth/Login.tsx");
          return { Component };
        },
      },
      {
        path: "register",
        lazy: async () => {
          const { default: Component } =
            await import("./pages/auth/Register.tsx");
          return { Component };
        },
      },
    ],
  },
  {
    path: "notes",
    lazy: async () => {
      const { default: Component } = await import("./pages/app/Notes.tsx");
      return { Component };
    },
    children: [
      {
        path: ":id",
        lazy: async () => {
          const { default: Component } =
            await import("./pages/app/NotePage.tsx");
          return { Component };
        },
      },
    ],
  },
]);
