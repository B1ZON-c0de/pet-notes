import { Loader } from "@mantine/core";
import { createBrowserRouter, Navigate } from "react-router";
import {
  authMiddleware,
  guestMiddleware,
} from "./middleware/authMiddleware.ts";
import { userContext } from "./context/UserContext.ts";

export const routes = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <Navigate to="/notes" replace />,
  },
  {
    path: "auth",
    middleware: [guestMiddleware],
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
    middleware: [authMiddleware],
    loader: async ({ context }) => {
      const user = context.get(userContext);
      return { user };
    },
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
};

export const ROUTES_DYNAMICS = {
  note: (id: string) => `/notes/${id}`,
};
