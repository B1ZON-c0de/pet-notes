import axios from "axios";
import { Outlet, useLoaderData, useNavigate } from "react-router";
import { ROUTES_BACKEND } from "../../routesBackend";
import { ROUTES } from "../../routes";
import { AppShell, Button, Flex } from "@mantine/core";

const Notes = () => {
  const navigate = useNavigate();
  const { user } = useLoaderData();
  const logoutFn = async () => {
    await axios.post(ROUTES_BACKEND.logout);
    navigate(ROUTES.login, { replace: true });
  };
  return (
    <AppShell
      padding="md"
      header={{ height: 80 }}
      navbar={{ width: 300, breakpoint: "sm" }}
    >
      <AppShell.Header p="md">
        <Flex>
          <p>{user.name}</p>
          <Button variant="filled" onClick={logoutFn} size="md">
            Выйти
          </Button>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar p="md">Меню навигации</AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default Notes;
