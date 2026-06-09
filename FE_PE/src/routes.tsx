import { Loader } from "@mantine/core";
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
        HydrateFallback: Loader,
        lazy: async () => {
          const { default: Component } = await import("./pages/auth/Login.tsx");
          return { Component };
        },
      },
      {
        path: "register",
        HydrateFallback: Loader,
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
    HydrateFallback: Loader,
    lazy: async () => {
      const { default: Component } = await import("./pages/app/Notes.tsx");
      return { Component };
    },
    children: [
      {
        path: ":id",
        HydrateFallback: Loader,
        lazy: async () => {
          const { default: Component } =
            await import("./pages/app/NotePage.tsx");
          return { Component };
        },
      },
    ],
  },
]);

export const ROUTES = {
  login: "/auth/login",
  register: "/auth/register",
  notes: "/notes",
  note: (id: string) => `/notes/${id}`,
};
