import axios from "axios";
import type { Note, RespondBackend } from "../types";
import { notifications } from "@mantine/notifications";
import { ROUTES_BACKEND } from "../routesBackend";

export async function getNotes(search: string | null): Promise<Note[] | null> {
  try {
    const res = await axios.get<RespondBackend<Note[]>>(ROUTES_BACKEND.notes, {
      params: {
        search: search ? search : undefined,
      },
    });
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
