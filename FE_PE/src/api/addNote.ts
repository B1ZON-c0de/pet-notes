import axios from "axios";
import { ROUTES_BACKEND } from "../routesBackend";
import { notifications } from "@mantine/notifications";
import type { RespondBackend } from "../types";

export async function addNote() {
  try {
    await axios.post<RespondBackend<null>>(ROUTES_BACKEND.notes);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      notifications.show(err.response?.data.error.message);
    }
  }
}
