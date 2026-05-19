import { useState, useEffect } from "react";
import { validateSql } from "./api/sql-validator.api";
import "./styles.css";

// ── Icons ─────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 20 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  hex:      () => <Ico d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />,
  zap:      () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  history:  () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  db:       () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  settings: () => <Ico d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
  sun:      () => <Ico d="M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z" />,
  moon:     () => <Ico d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  copy:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  wand:     () => <Ico d="m15 5 4 4M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13" />,
  help:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  play:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  loader:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>,
  check:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  code:     () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  file:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  book:     () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  trend:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  shield:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  xmark:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

// ── DB Engine Data ────────────────────────────────────────────────────────────
const DB_ENGINES = [
  {
    id: "sqlserver",
    name: "SQL Server",
    vendor: "Microsoft",
    logo: "🟦",
    color: "#0078d4",
    glow: "rgba(0,120,212,0.25)",
    type: "Relacional",
    version: "2022",
    compliance: 98,
    features: ["T-SQL", "Stored Procs", "Window Fns", "CTEs", "JSON"],
    status: "active",
    latency: "12ms",
    queries: 1_420,
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    vendor: "Open Source",
    logo: "🐘",
    color: "#336791",
    glow: "rgba(51,103,145,0.25)",
    type: "Relacional",
    version: "16.2",
    compliance: 100,
    features: ["PL/pgSQL", "JSONB", "Window Fns", "CTEs", "Arrays"],
    status: "active",
    latency: "8ms",
    queries: 2_310,
  },
  {
    id: "mysql",
    name: "MySQL",
    vendor: "Oracle",
    logo: "🐬",
    color: "#f29111",
    glow: "rgba(242,145,17,0.25)",
    type: "Relacional",
    version: "8.3",
    compliance: 91,
    features: ["Stored Procs", "Triggers", "Views", "JSON", "Window Fns"],
    status: "active",
    latency: "10ms",
    queries: 1_870,
  },
  {
    id: "mongodb",
    name: "MongoDB",
    vendor: "MongoDB Inc.",
    logo: "🍃",
    color: "#00ed64",
    glow: "rgba(0,237,100,0.20)",
    type: "No-SQL / Documento",
    version: "7.0",
    compliance: 0,
    features: ["Aggregation", "Atlas Search", "Time Series", "Transactions"],
    status: "warning",
    latency: "5ms",
    queries: 3_100,
  },
  {
    id: "nosql",
    name: "Generic NoSQL",
    vendor: "Varios",
    logo: "🔷",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.20)",
    type: "No-SQL / Clave-Valor",
    version: "N/A",
    compliance: 0,
    features: ["Key-Value", "TTL", "Cluster", "In-Memory"],
    status: "inactive",
    latency: "—",
    queries: 0,
  },
];

const STATUS_LABEL: Record<string, string> = {
  active: "Activo",
  warning: "Parcial",
  inactive: "Inactivo",
};

// ── Gauge Component ───────────────────────────────────────────────────────────
function Gauge({ value, color }: { value: number; color: string }) {
  const r = 28, circ = 2 * Math.PI * r;
  const pct = circ - (value / 100) * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={pct}
        strokeLinecap="round"
        style={{ transformOrigin: "50% 50%", transform: "rotate(-90deg)", transition: "stroke-dashoffset 1s ease" }} />
      <text x="36" y="41" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">
        {value > 0 ? `${value}%` : "—"}
      </text>
    </svg>
  );
}

// ── Mini Bar ──────────────────────────────────────────────────────────────────
function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="mini-bar-track">
      <div className="mini-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export function App() {
  const [query, setQuery] = useState(`SELECT nombre, edad\nFROM usuarios\nWHERE edad >= 18;`);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [activeTab, setActiveTab] = useState("validator");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedDb, setSelectedDb] = useState("postgres");

  useEffect(() => {
    document.body.className = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  async function onValidate() {
    setLoading(true);
    setStatus("idle");
    try {
      const result = await validateSql(query);
      setOutput(JSON.stringify(result, null, 2));
      setStatus("success");
    } catch (err) {
      setOutput(err instanceof Error ? err.message : "Error inesperado");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  function clearAll() { setQuery(""); setOutput(""); setStatus("idle"); }

  function insertExample() {
    setQuery(`-- Ejemplo complejo\nSELECT\n    u.nombre,\n    u.edad,\n    COUNT(p.id) AS total_compras\nFROM usuarios u\nLEFT JOIN pedidos p ON u.id = p.usuario_id\nWHERE u.edad >= 18\nGROUP BY u.id\nHAVING COUNT(p.id) > 0\nORDER BY total_compras DESC;`);
  }

  function formatQuery() {
    setQuery(query
      .replace(/\bSELECT\b/gi, "SELECT\n  ")
      .replace(/\bFROM\b/gi, "\nFROM")
      .replace(/\bWHERE\b/gi, "\nWHERE")
      .replace(/\bGROUP BY\b/gi, "\nGROUP BY")
      .replace(/\bORDER BY\b/gi, "\nORDER BY")
      .replace(/\bJOIN\b/gi, "\n  JOIN"));
  }

  const activeEngine = DB_ENGINES.find(e => e.id === selectedDb)!;
  const maxQueries = Math.max(...DB_ENGINES.map(e => e.queries), 1);

  return (
    <main className="root">


      {/* ── CENTER WORKSPACE ── */}
      <section className="workspace">
        <header className="topbar">
          <div className="topbar-brand">
            <span className="topbar-logo"><Icons.hex /></span>
            <div>
              <h1 className="title">SQL Validator</h1>
              <p className="subtitle">Plataforma moderna para validación SQL</p>
            </div>
          </div>
          <div className="topbar-right">
            <div className={`status-chip ${status}`}>
              <span className="status-dot" />
              {status === "idle" ? "Esperando" : status === "success" ? "Consulta válida" : "Error SQL"}
            </div>
            <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Icons.sun /> : <Icons.moon />}
            </button>
          </div>
        </header>

        <div className="panel-grid">
          {/* INPUT PANEL */}
          <section className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-label">INPUT</span>
                <h3>Consulta SQL</h3>
              </div>
              <div className="panel-actions">
                <button className="icon-btn" onClick={insertExample} title="Ejemplo"><Icons.file /></button>
                <button className="icon-btn" onClick={formatQuery} title="Formatear"><Icons.wand /></button>
                <button className="icon-btn" onClick={() => setShowHelp(true)} title="Ayuda"><Icons.help /></button>
                <button className="clear-btn" onClick={clearAll}>Limpiar</button>
              </div>
            </div>
            <div className="editor-container">
              <div className="line-numbers">
                {query.split("\n").map((_, i) => <span key={i}>{i + 1}</span>)}
              </div>
              <textarea spellCheck={false} value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Escribe tu consulta SQL aquí..." />
            </div>
            <div className="panel-footer">
              <span className="char-count">
                <Icons.file /> {query.length} chars | {query.split("\n").length} líneas
              </span>
              <button className={`validate-btn ${loading ? "loading" : ""}`}
                disabled={loading || !query.trim()} onClick={onValidate}>
                {loading ? <Icons.loader /> : <Icons.play />}
                {loading ? "Validando..." : "Validar SQL"}
              </button>
            </div>
          </section>

          {/* OUTPUT PANEL */}
          <section className="panel" style={{ position: "relative" }}>
            <div className="panel-header">
              <div>
                <span className={`panel-label ${status}`}>OUTPUT</span>
                <h3>Resultado</h3>
              </div>
              {output && (
                <button className="icon-btn" onClick={() => navigator.clipboard.writeText(output)} title="Copiar">
                  <Icons.copy />
                </button>
              )}
            </div>
            <div className={`output ${status}`}>
              {output ? <pre key={output.slice(0,30)} className="output-fade">{output}</pre> : (
                <div className="empty">
                  <Icons.code />
                  <p>El resultado aparecerá aquí</p>
                  <small>Presiona "Validar SQL" para comenzar</small>
                </div>
              )}
            </div>
            {status === "success" && output && (
              <div className="success-badge"><Icons.check /> Consulta SQL válida</div>
            )}
          </section>
        </div>
      </section>

      {/* ── RIGHT DB DASHBOARD ── */}
      <aside className="sidebar-right">
        <div className="db-dashboard-header">
          <Icons.db />
          <div>
            <h3>Motores DB</h3>
            <p>Compatibilidad SQL</p>
          </div>
        </div>

        {/* Engine selector list */}
        <div className="db-engine-list">
          {DB_ENGINES.map(engine => (
            <button key={engine.id}
              className={`db-engine-item ${selectedDb === engine.id ? "selected" : ""}`}
              style={selectedDb === engine.id ? { borderColor: engine.color, boxShadow: `0 0 0 1px ${engine.color}40` } : {}}
              onClick={() => setSelectedDb(engine.id)}>
              <span className="db-engine-logo">{engine.logo}</span>
              <div className="db-engine-meta">
                <span className="db-engine-name">{engine.name}</span>
                <span className="db-engine-type">{engine.type}</span>
              </div>
              <span className={`db-status-dot ${engine.status}`} />
            </button>
          ))}
        </div>

        {/* Selected engine detail card */}
        <div key={selectedDb} className="db-detail-card" style={{ borderColor: `${activeEngine.color}40` }}>
          <div className="db-detail-top">
            <div>
              <span className="db-detail-logo">{activeEngine.logo}</span>
              <div>
                <h4>{activeEngine.name}</h4>
                <small>{activeEngine.vendor} · v{activeEngine.version}</small>
              </div>
            </div>
            <span className={`db-badge ${activeEngine.status}`}>
              {STATUS_LABEL[activeEngine.status]}
            </span>
          </div>

          <div className="db-compliance-row">
            <Gauge value={activeEngine.compliance} color={activeEngine.color} />
            <div className="db-compliance-info">
              <span className="db-compliance-label">Compatibilidad SQL</span>
              <p className="db-compliance-desc">
                {activeEngine.compliance === 100
                  ? "Soporte SQL completo e ANSI-estándar."
                  : activeEngine.compliance > 0
                    ? "Soporte SQL parcial con dialectos propios."
                    : "No soporta SQL estándar (NoSQL)."}
              </p>
              <div className="db-stat-row">
                <Icons.trend />
                <span>{activeEngine.latency} avg latency</span>
              </div>
            </div>
          </div>

          <div className="db-features">
            <span className="db-features-label">Características</span>
            <div className="db-tags">
              {activeEngine.features.map(f => (
                <span key={f} className="db-tag" style={{ borderColor: `${activeEngine.color}60`, color: activeEngine.color }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Query stats */}
        <div className="db-stats-section">
          <span className="db-stats-title">Consultas analizadas hoy</span>
          {DB_ENGINES.map(engine => (
            <div key={engine.id} className="db-stat-bar-row">
              <span className="db-stat-bar-name">{engine.logo} {engine.name}</span>
              <MiniBar value={engine.queries} max={maxQueries} color={engine.color} />
              <span className="db-stat-bar-value">{engine.queries.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* SQL compatibility info */}
        <div className="db-info-box">
          <div className="db-info-box-header">
            <Icons.shield />
            <span>Tu consulta actual</span>
          </div>
          <p className="db-info-box-text">
            {status === "success"
              ? `✅ Compatible con ${DB_ENGINES.filter(e => e.compliance >= 90).map(e => e.name).join(", ")}.`
              : status === "error"
                ? "❌ Revisa la consulta antes de probar compatibilidad."
                : "⏳ Valida tu consulta para ver compatibilidad."}
          </p>
        </div>
      </aside>

      {/* HELP MODAL */}
      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><Icons.book /> Ayuda SQL</h2>
              <button className="icon-btn" onClick={() => setShowHelp(false)}><Icons.xmark /></button>
            </div>
            <h3>Ejemplos de consultas:</h3>
            <pre>{`-- Selección básica
SELECT * FROM usuarios;

-- Con condiciones
SELECT nombre, email FROM usuarios WHERE edad > 18;

-- Joins
SELECT u.nombre, p.total
FROM usuarios u
JOIN pedidos p ON u.id = p.usuario_id;

-- Agregación
SELECT categoria, COUNT(*) as total
FROM productos GROUP BY categoria;`}</pre>
            <button onClick={() => setShowHelp(false)}>Entendido</button>
          </div>
        </div>
      )}
    </main>
  );
}
