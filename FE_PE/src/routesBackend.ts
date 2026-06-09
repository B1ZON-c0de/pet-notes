export const ROUTES_BACKEND = {
  login: "/api/auth/login",
  register: "/api/auth/register",
  user: "/api/user",
  notes: "/api/notes",
  note: (id: string) => `/api/notes/${id}`,
};
