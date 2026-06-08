import { createRoot } from "react-dom/client";
import "./index.css";
import { routes } from "./routes";
import { RouterProvider } from "react-router";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

createRoot(document.getElementById("root")!).render(
  <MantineProvider>
    <RouterProvider router={routes} />
  </MantineProvider>,
);
