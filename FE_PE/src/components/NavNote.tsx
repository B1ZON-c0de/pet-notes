import { Link } from "react-router";
import type { Note } from "../types";
import { ROUTES_DYNAMICS } from "../routes";

interface Props {
  note: Note;
}

export default function NavNote({ note }: Props) {
  return <Link to={ROUTES_DYNAMICS.note(note.id)}>{note.title}</Link>;
}
