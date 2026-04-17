import { useState } from "react";
import { validateSql } from "./api/sql-validator.api";

export function App() {
  const [query, setQuery] = useState("SELECT nombre, edad FROM usuarios;");
  const [output, setOutput] = useState("Aqui veras el resultado...");
  const [loading, setLoading] = useState(false);

  async function onValidate() {
    setLoading(true);

    try {
      const result = await validateSql(query);
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      setOutput(error instanceof Error ? error.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>SQL Nextjs</h1>
      <p>Primera version hexagonal con enfoque intuitivo para MVC.</p>

      <textarea
        rows={8}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <button disabled={loading} onClick={onValidate}>
        {loading ? "Validando..." : "Validar"}
      </button>

      <pre>{output}</pre>
    </main>
  );
}
