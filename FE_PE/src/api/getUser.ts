import axios from "axios";
import type { RespondBackend, User } from "../types";
import { ROUTES_BACKEND } from "../routesBackend";

export async function getUser() {
  try {
    const res = await axios.get<RespondBackend<User>>(ROUTES_BACKEND.user, {});
    if (res.data.success) {
      return res.data.data;
    }
  } catch {
    return null;
  }
}
