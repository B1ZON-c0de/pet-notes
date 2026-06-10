import { Link, useParams } from "react-router";
import type { Note } from "../types";
import { ROUTES_DYNAMICS } from "../routes";
import { CloseButton, Flex, NavLink, Text, Title } from "@mantine/core";
import { dateFormatter } from "../utils/dateFormatter";
import { truncateText } from "../utils/truncateText";

interface Props {
  note: Note;
  onDelete: () => void;
}

function NoteTitle({ title }: { title: string }) {
  return <Title order={5}>{title}</Title>;
}

function NoteDesc({ time, text }: { time: string; text: string }) {
  return (
    <Flex align="center" gap="md">
      <Text fw={500} c="dark">
        {dateFormatter(time)}
      </Text>
      <Text>{truncateText(text, 20)}</Text>
    </Flex>
  );
}

export default function NavNote({ note, onDelete }: Props) {
  const { id } = useParams();
  return (
    <NavLink
      className="note-link"
      component={Link}
      active={note.id === id}
      to={ROUTES_DYNAMICS.note(note.id)}
      rightSection={
        <CloseButton
          className="delete-btn"
          c="red"
          variant="transparent"
          onClick={onDelete}
        />
      }
      label={<NoteTitle title={note.title} />}
      description={<NoteDesc time={note.updated_at} text={note.text} />}
    />
  );
}
