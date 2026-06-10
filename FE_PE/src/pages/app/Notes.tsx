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
  Modal,
  ScrollArea,
  TextInput,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import type { Note, User } from "../../types";
import NavNote from "../../components/NavNote";
import DeleteModal from "../../components/DeleteModal";

interface LoaderProps {
  user: User;
  notes: Note[];
}

const Notes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [debouncedValue] = useDebouncedValue(searchQuery, 200);
  const [burgerOpened, { toggle: burgerToggle }] = useDisclosure();
  const [modalOpened, { open: modalOpen, close: modalClose }] =
    useDisclosure(false);

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
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !burgerOpened },
      }}
    >
      <Modal opened={modalOpened} onClose={modalClose} centered>
        <DeleteModal closeModal={modalClose} id={selectedId || ""} />
      </Modal>
      <AppShell.Header p="md">
        <Flex align="center" gap="md">
          <Burger
            opened={burgerOpened}
            onClick={burgerToggle}
            hiddenFrom="sm"
            size="md"
          />
          <Flex ml="auto" gap="md" align="center">
            <TextInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isEditing}
            />
            <p>{user.name}</p>
            <Button
              disabled={isEditing}
              variant="filled"
              onClick={logoutFn}
              size="md"
            >
              Выйти
            </Button>
          </Flex>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          {notes &&
            notes.map((note) => (
              <NavNote
                disabled={isEditing}
                onDelete={() => {
                  modalOpen();
                  setSelectedId(note.id);
                }}
                key={note.id}
                note={note}
              />
            ))}
        </AppShell.Section>
        <AppShell.Section
          p="md"
          style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
        >
          <Center>
            <Form action="/notes" method="post">
              <Button
                disabled={isEditing}
                color="gray"
                variant="filled"
                size="md"
                type="submit"
              >
                Добавить новую запись
              </Button>
            </Form>
          </Center>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main component={ScrollArea}>
        <Outlet context={{ isEditing, setIsEditing }} />
      </AppShell.Main>
    </AppShell>
  );
};

export default Notes;
