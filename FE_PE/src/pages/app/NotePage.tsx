import { useLoaderData } from "react-router";
import type { Note } from "../../types";
import { Button, Flex, Text, Title } from "@mantine/core";
import { dateFormatter } from "../../utils/dateFormatter";
import Markdown from "react-markdown";
import { useState } from "react";
interface LoaderProps {
  note: Note;
}
const NotePage = () => {
  const { note } = useLoaderData<LoaderProps>();
  const [isEditing, setIsEditing] = useState(false);
  return (
    <>
      <Text ta="center" c="dimmed">
        {dateFormatter(note.created_at, true)}
      </Text>
      <Title order={1}>{note.title}</Title>
      <Markdown>{note.text}</Markdown>
      {isEditing ? (
        <Flex pos="absolute" gap="md" align="center" bottom={20} right={20}>
          <Button
            variant="filled"
            size="md"
            color="gray"
            onClick={() => setIsEditing(false)}
          >
            Отмена
          </Button>
          <Button
            variant="filled"
            color="green"
            onClick={() => setIsEditing(false)}
            size="md"
          >
            Сохранить
          </Button>
        </Flex>
      ) : (
        <Button
          variant="filled"
          pos="absolute"
          bottom={20}
          right={20}
          size="md"
          onClick={() => setIsEditing(true)}
        >
          Редактировать
        </Button>
      )}
    </>
  );
};

export default NotePage;
