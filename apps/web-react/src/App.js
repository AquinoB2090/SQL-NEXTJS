import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        }
        catch (error) {
            setOutput(error instanceof Error ? error.message : "Error inesperado");
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("main", { className: "container", children: [_jsx("h1", { children: "SQL Nextjs" }), _jsx("p", { children: "Primera version hexagonal con enfoque intuitivo para MVC." }), _jsx("textarea", { rows: 8, value: query, onChange: (event) => setQuery(event.target.value) }), _jsx("button", { disabled: loading, onClick: onValidate, children: loading ? "Validando..." : "Validar" }), _jsx("pre", { children: output })] }));
}
