import { redirect, type MiddlewareFunction } from "react-router";
import { ROUTES } from "../routes";
import { getUser } from "../api/getUser";
import { userContext } from "../context/UserContext";

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
