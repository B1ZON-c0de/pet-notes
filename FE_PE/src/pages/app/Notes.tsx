import axios from "axios";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router";
import { ROUTES_BACKEND } from "../../routesBackend";
import { ROUTES } from "../../routes";
import {
  AppShell,
  Burger,
  Button,
  Center,
  Flex,
  ScrollArea,
  TextInput,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import type { Note, User } from "../../types";
import NavNote from "../../components/NavNote";

interface LoaderProps {
  user: User;
  notes: Note[];
}

const Notes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [debouncedValue] = useDebouncedValue(searchQuery, 200);
  const [opened, { toggle }] = useDisclosure();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedValue) {
      params.set("search", debouncedValue);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  }, [debouncedValue]);

  const navigate = useNavigate();
  const { user, notes } = useLoaderData<LoaderProps>();

  const logoutFn = async () => {
    await axios.post(ROUTES_BACKEND.logout);
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <AppShell
      padding="md"
      header={{ height: 80 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
    >
      <AppShell.Header p="md">
        <Flex align="center" gap="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="md" />
          <Flex ml="auto" gap="md" align="center">
            <TextInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <p>{user.name}</p>
            <Button variant="filled" onClick={logoutFn} size="md">
              Выйти
            </Button>
          </Flex>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          {notes && notes.map((note) => <NavNote key={note.id} note={note} />)}
        </AppShell.Section>
        <AppShell.Section
          p="md"
          style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
        >
          <Center>
            <Form method="post">
              <Button color="gray" variant="filled" size="md" type="submit">
                Добавить новую запись
              </Button>
            </Form>
          </Center>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default Notes;
