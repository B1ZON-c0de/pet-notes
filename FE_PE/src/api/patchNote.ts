import axios from "axios";
import type { RespondBackend } from "../types";
import { ROUTES_BACKEND } from "../routesBackend";
import { notifications } from "@mantine/notifications";

export async function patchNote(id?: string, text?: string, title?: string) {
  const fieldsNote = {
    ...(title && { title: title }),
    ...(text && { text: text }),
  };
  try {
    if (!id) return;
    const res = await axios.patch<RespondBackend<null>>(
      ROUTES_BACKEND.note(id),
      fieldsNote,
    );
    if (res.data.success) {
      return;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      notifications.show(err.response?.data.error.message);
    }
  }
}
