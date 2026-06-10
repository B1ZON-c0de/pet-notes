import axios from "axios";
import type { Note, RespondBackend } from "../types";
import { notifications } from "@mantine/notifications";
import { ROUTES_BACKEND } from "../routesBackend";

export async function getOneNote(id?: string): Promise<Note | null> {
  try {
    if (!id) return null;
    const res = await axios.get<RespondBackend<Note>>(ROUTES_BACKEND.note(id));
    if (res.data.success && res.data?.data) {
      return res.data.data;
    }
    return null;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      notifications.show(err.response?.data.error.message);
    }
    return null;
  }
}
