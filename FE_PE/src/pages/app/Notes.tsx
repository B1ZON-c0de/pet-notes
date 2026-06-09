import axios from "axios";
import { Outlet, useLoaderData, useNavigate } from "react-router";
import { ROUTES_BACKEND } from "../../routesBackend";
import { ROUTES } from "../../routes";
import { Button } from "@mantine/core";

const Notes = () => {
  const navigate = useNavigate();
  const { user } = useLoaderData();
  console.log(user);
  const logoutFn = async () => {
    await axios.post(ROUTES_BACKEND.logout);
    navigate(ROUTES.login, { replace: true });
  };
  return (
    <div>
      Приложение:
      <Button onClick={logoutFn}> Выйти</Button>
      <Outlet />
    </div>
  );
};

export default Notes;
