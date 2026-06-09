import axios from "axios";
import { Link, Outlet, useLoaderData, useNavigate } from "react-router";
import { ROUTES_BACKEND } from "../../routesBackend";
import { ROUTES, ROUTES_DYNAMICS } from "../../routes";
import { AppShell, Button, Flex, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import type { Note } from "../../types";

const Notes = () => {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const loadData = async () => {
      const res = await axios.get(ROUTES_BACKEND.notes, {
        params: {
          search: search ? search : undefined,
        },
      });
      setNotes(res.data.data);
    };
    loadData();
  }, [search]);
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
        <Flex justify="flex-end" gap="md">
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
