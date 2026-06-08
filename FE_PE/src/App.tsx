import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("/api/notes")
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);
  return <div>HEllo World!</div>;
}

export default App;
