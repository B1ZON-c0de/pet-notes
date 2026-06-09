import { createRoot } from "react-dom/client";
import "./index.css";
import { routes } from "./routes";
import { RouterProvider } from "react-router";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

createRoot(document.getElementById("root")!).render(
  <MantineProvider>
    <Notifications />
    <RouterProvider router={routes} />
  </MantineProvider>,
);
