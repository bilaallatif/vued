import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Default } from "@vued/sdk/api";
import { client } from "@vued/sdk/api/client.gen";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState("");

  const apiUrl: string = import.meta.env.VITE_API_URL;
  client.setConfig({
    baseUrl: apiUrl,
  });

  useEffect(() => {
    Default.getUser().then((x) => setUser(x.data?.name ?? "fail"));
  }, []);

  return (
    <>
      <div>
        <h1>{user}</h1>
        <h1>{apiUrl}</h1>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
