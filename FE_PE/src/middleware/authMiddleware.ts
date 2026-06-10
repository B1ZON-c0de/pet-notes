import { userContext } from "../context/UserContext";
import { redirect, type MiddlewareFunction } from "react-router";
import { ROUTES } from "../routes";
import { getUser } from "../api/getUser";

export const authMiddleware: MiddlewareFunction = async ({ context }, next) => {
  const user = await getUser();
  if (!user) {
    throw redirect(ROUTES.login);
  }
  context.set(userContext, user);
  await next();
};
