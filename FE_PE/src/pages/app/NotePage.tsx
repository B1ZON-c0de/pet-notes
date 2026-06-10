import { useLoaderData } from "react-router";
import type { Note } from "../../types";
import { Text } from "@mantine/core";
import { dateFormatter } from "../../utils/dateFormatter";
interface LoaderProps {
  note: Note;
}
const NotePage = () => {
  const { note } = useLoaderData<LoaderProps>();
  return (
    <>
      <Text ta="center" c="dimmed">
        {dateFormatter(note.created_at, true)}
      </Text>
    </>
  );
};

export default NotePage;
