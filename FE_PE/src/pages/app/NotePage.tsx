import { Form, useLoaderData } from "react-router";
import type { Note } from "../../types";
import { Button, Flex, Text, Title } from "@mantine/core";
import { dateFormatter } from "../../utils/dateFormatter";
import Markdown from "react-markdown";
import { useRef, useState } from "react";
import {
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
interface LoaderProps {
  note: Note;
}
const NotePage = () => {
  const { note } = useLoaderData<LoaderProps>();
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<MDXEditorMethods>(null);
  return (
    <>
      <Text ta="center" c="dimmed">
        {dateFormatter(note.created_at, true)}
      </Text>
      <Title order={1}>{note.title}</Title>
      {isEditing ? (
        <MDXEditor
          ref={ref}
          markdown={note.text}
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
          ]}
        />
      ) : (
        <Markdown>{note.text}</Markdown>
      )}
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
          <Form
            onSubmit={(e) => {
              const input = e.currentTarget.elements.namedItem(
                "text",
              ) as HTMLInputElement;
              input.value = ref.current?.getMarkdown();
              setIsEditing(false);
            }}
            action={"/notes/" + note.id}
            method="patch"
          >
            <input type="hidden" name="text" />
            <Button variant="filled" color="green" size="md" type="submit">
              Сохранить
            </Button>
          </Form>
        </Flex>
      ) : (
        <Button
          variant="filled"
          pos="absolute"
          bottom={20}
          right={20}
          size="md"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          Редактировать
        </Button>
      )}
    </>
  );
};

export default NotePage;
