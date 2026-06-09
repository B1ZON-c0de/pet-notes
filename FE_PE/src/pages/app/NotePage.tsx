import axios from "axios";
import { useEffect, useState } from "react";
import { ROUTES_BACKEND } from "../../routesBackend";
import { useParams } from "react-router";
import type { Note } from "../../types";

const NotePage = () => {
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  useEffect(() => {
    const loadData = async () => {
      const res = await axios.get(ROUTES_BACKEND.note(id));
      setNote(res.data.data);
    };
    loadData();
  }, [id]);
  return (
    <div>
      {note && note.id} -{note && note.text}
    </div>
  );
};

export default NotePage;
