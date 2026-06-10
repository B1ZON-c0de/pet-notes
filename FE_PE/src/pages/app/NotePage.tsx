import { useLoaderData } from "react-router";
import type { Note } from "../../types";
interface LoaderProps {
  note: Note;
}
const NotePage = () => {
  const { note } = useLoaderData<LoaderProps>();
  return (
    <div>
      {note && note.id} -{note && note.text}
    </div>
  );
};

export default NotePage;
