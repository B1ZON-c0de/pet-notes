import axios from "axios";
import {
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router";
import { ROUTES_BACKEND } from "../../routesBackend";
import { ROUTES, ROUTES_DYNAMICS } from "../../routes";
import { AppShell, Button, Flex, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import type { Note, User } from "../../types";

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
      navbar={{ width: 300, breakpoint: "sm" }}
    >
      <AppShell.Header p="md">
        <Flex justify="flex-end" gap="md">
          <TextInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <p>{user.name}</p>
          <Button variant="filled" onClick={logoutFn} size="md">
            Выйти
          </Button>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {notes &&
          notes.map((note) => (
            <Link to={ROUTES_DYNAMICS.note(note.id)} key={note.id}>
              {note.title}
              {note.text}
            </Link>
          ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default Notes;
