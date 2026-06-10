import axios from "axios";
import { ROUTES_BACKEND } from "../routesBackend";
import type { RespondBackend } from "../types";
import { notifications } from "@mantine/notifications";

export async function deleteNote(id?: string) {
  if (!id) return;
  try {
    await axios.delete<RespondBackend<null>>(ROUTES_BACKEND.note(id));
  } catch (err) {
    if (axios.isAxiosError(err)) {
      notifications.show(err.response?.data.error.message);
    }
  }
}
