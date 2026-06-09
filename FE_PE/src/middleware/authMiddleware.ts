import axios from "axios";
import { userContext } from "../context/UserContext";
import { redirect, type MiddlewareFunction } from "react-router";
import type { RespondBackend, User } from "../types";
import { ROUTES } from "../routes";
import { ROUTES_BACKEND } from "../routesBackend";

async function getUser() {
  try {
    const res = await axios.get<RespondBackend<User>>(ROUTES_BACKEND.user, {
      withCredentials: true,
    });
    if (res.data.success) {
      return res.data.data;
    }
  } catch {
    return null;
  }
}

export const authMiddleware: MiddlewareFunction = async ({ context }, next) => {
  const user = await getUser();
  if (!user) {
    throw redirect(ROUTES.login);
  }
  context.set(userContext, user);
  await next();
};

export const guestMiddleware: MiddlewareFunction = async (
  { context },
  next,
) => {
  const user = await getUser();
  if (user) {
    context.set(userContext, user);
    throw redirect(ROUTES.notes);
  }

  await next();
};
