import { Form, useLoaderData } from "react-router";
import type { Note } from "../../types";
import { Button, Flex, Text } from "@mantine/core";
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
  const refText = useRef<MDXEditorMethods>(null);
  const refTitle = useRef<MDXEditorMethods>(null);
  return (
    <>
      <Text ta="center" c="dimmed">
        {dateFormatter(note.created_at, true)}
      </Text>
      {isEditing ? (
        <MDXEditor
          ref={refTitle}
          markdown={note.title}
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
          ]}
        />
      ) : (
        <Markdown>{note.title}</Markdown>
      )}
      {isEditing ? (
        <MDXEditor
          ref={refText}
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
              const inputTitle = e.currentTarget.elements.namedItem(
                "title",
              ) as HTMLInputElement;
              const inputText = e.currentTarget.elements.namedItem(
                "text",
              ) as HTMLInputElement;

              inputTitle.value = refTitle.current?.getMarkdown();
              inputText.value = refText.current?.getMarkdown();

              setIsEditing(false);
            }}
            action={"/notes/" + note.id}
            method="patch"
          >
            <input type="hidden" name="text" />
            <input type="hidden" name="title" />
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
