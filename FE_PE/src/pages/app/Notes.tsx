import { Outlet } from "react-router";

const Notes = () => {
  return (
    <div>
      Приложение:
      <Outlet />
    </div>
  );
};

export default Notes;
