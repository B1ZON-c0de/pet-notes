import { Loader } from "@mantine/core";
import { createBrowserRouter, Navigate, redirect } from "react-router";
import { authMiddleware } from "./middleware/authMiddleware.ts";
import { userContext } from "./context/UserContext.ts";
import { guestMiddleware } from "./middleware/guestMiddleware.ts";
import { getNotes } from "./api/getNotes.ts";
import { getOneNote } from "./api/getOneNote.ts";
import { addNote } from "./api/addNote.ts";
import { deleteNote } from "./api/deleteNote.ts";
import { patchNote } from "./api/patchNote.ts";

export const ROUTES = {
  login: "/auth/login",
  register: "/auth/register",
  notes: "/notes",
};

export const ROUTES_DYNAMICS = {
  note: (id: string) => `/notes/${id}`,
};

export const routes = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <Navigate to={ROUTES.notes} replace />,
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
    action: async () => {
      await addNote();
    },
    loader: async ({ request, context }) => {
      const url = new URL(request.url);
      const search = url.searchParams.get("search");
      const notes = await getNotes(search);
      const user = context.get(userContext);
      return { user, notes: notes ? notes : null };
    },
    lazy: async () => {
      const { default: Component } = await import("./pages/app/Notes.tsx");
      return { Component };
    },
    children: [
      {
        path: ":id",
        HydrateFallback: Loader,
        action: async ({ request, params }) => {
          const method = request.method;
          console.log(method);
          if (method === "DELETE") {
            await deleteNote(params.id);
            return redirect("/notes");
          }
          if (method === "PATCH") {
            const formData = await request.formData();
            const text = formData.get("text");

            await patchNote(params.id, String(text));
            return redirect(`/notes/${params.id}`);
          }
        },
        loader: async ({ params }) => {
          const note = await getOneNote(params.id);
          return { note };
        },
        lazy: async () => {
          const { default: Component } =
            await import("./pages/app/NotePage.tsx");
          return { Component };
        },
      },
    ],
  },
]);
