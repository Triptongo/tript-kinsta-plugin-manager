import { useState, useEffect, useCallback, useRef } from "react";

// ─── KINSTA API ──────────────────────────────────────────────────────────────
const BASE = "https://api.kinsta.com/v2";

async function kFetch(path, token, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${res.status}: ${err}`);
  }
  return res.json();
}

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    plug: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22v-5" /><path d="M9 8V2" /><path d="M15 8V2" />
        <rect x="6" y="8" width="12" height="9" rx="2" />
      </svg>
    ),
    refresh: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M8 16H3v5" />
      </svg>
    ),
    upload: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    shield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    globe: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    x: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    chevronDown: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ),
    chevronRight: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    ),
    warning: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    key: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
      </svg>
    ),
    list: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    layout: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    arrowUp: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
      </svg>
    ),
    spinner: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    ),
  };
  return icons[name] || null;
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0f14;
    --bg2: #13161d;
    --bg3: #1a1e28;
    --bg4: #222736;
    --border: #2a2f3e;
    --border2: #363d52;
    --text: #e2e6f0;
    --text2: #8891a8;
    --text3: #555f7a;
    --accent: #5b8af0;
    --accent2: #3d6de0;
    --green: #3ecf8e;
    --green2: #2ea86f;
    --yellow: #f5a623;
    --red: #e85454;
    --purple: #a78bfa;
    --mono: 'IBM Plex Mono', monospace;
    --sans: 'IBM Plex Sans', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--sans); font-size: 14px; min-height: 100vh; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

  .app { display: flex; flex-direction: column; min-height: 100vh; }

  /* HEADER */
  .header { background: var(--bg2); border-bottom: 1px solid var(--border); padding: 0 24px; height: 56px; display: flex; align-items: center; gap: 16px; position: sticky; top: 0; z-index: 100; }
  .header-logo { display: flex; align-items: center; gap: 10px; font-family: var(--mono); font-weight: 600; font-size: 15px; color: var(--text); letter-spacing: -0.3px; }
  .header-logo-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px var(--accent); }
  .header-spacer { flex: 1; }
  .header-badge { font-family: var(--mono); font-size: 11px; color: var(--text3); padding: 3px 8px; background: var(--bg3); border: 1px solid var(--border); border-radius: 4px; }

  /* SETUP SCREEN */
  .setup { display: flex; align-items: center; justify-content: center; flex: 1; padding: 40px; }
  .setup-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 40px; max-width: 480px; width: 100%; animation: fadeIn 0.3s ease; }
  .setup-title { font-family: var(--mono); font-size: 20px; font-weight: 600; margin-bottom: 8px; }
  .setup-sub { color: var(--text2); font-size: 13px; margin-bottom: 32px; line-height: 1.6; }
  .setup-field { margin-bottom: 16px; }
  .setup-label { font-size: 12px; font-family: var(--mono); color: var(--text2); margin-bottom: 6px; display: block; letter-spacing: 0.5px; }
  .setup-input { width: 100%; background: var(--bg3); border: 1px solid var(--border2); border-radius: 6px; padding: 10px 14px; color: var(--text); font-family: var(--mono); font-size: 13px; outline: none; transition: border-color 0.2s; }
  .setup-input:focus { border-color: var(--accent); }
  .setup-note { font-size: 11px; color: var(--text3); margin-top: 6px; line-height: 1.5; }

  /* LAYOUT */
  .main { display: flex; flex: 1; }
  .sidebar { width: 220px; min-width: 220px; background: var(--bg2); border-right: 1px solid var(--border); padding: 16px 0; display: flex; flex-direction: column; gap: 2px; }
  .sidebar-section { padding: 4px 12px 8px; font-size: 10px; font-family: var(--mono); letter-spacing: 1px; color: var(--text3); text-transform: uppercase; margin-top: 8px; }
  .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 8px 16px; cursor: pointer; color: var(--text2); font-size: 13px; transition: all 0.15s; border-left: 2px solid transparent; }
  .sidebar-item:hover { color: var(--text); background: var(--bg3); }
  .sidebar-item.active { color: var(--accent); background: rgba(91,138,240,0.08); border-left-color: var(--accent); }
  .sidebar-badge { margin-left: auto; font-family: var(--mono); font-size: 10px; background: var(--bg4); padding: 2px 6px; border-radius: 10px; color: var(--text3); }
  .sidebar-badge.warn { background: rgba(245,166,35,0.15); color: var(--yellow); }

  /* CONTENT */
  .content { flex: 1; overflow: auto; }
  .content-inner { padding: 24px; max-width: 1400px; }

  /* TOOLBAR */
  .toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .toolbar-title { font-family: var(--mono); font-size: 16px; font-weight: 600; flex: 1; }
  .search-box { display: flex; align-items: center; gap: 8px; background: var(--bg2); border: 1px solid var(--border); border-radius: 6px; padding: 7px 12px; min-width: 220px; }
  .search-box input { background: none; border: none; outline: none; color: var(--text); font-size: 13px; font-family: var(--sans); width: 100%; }
  .search-box input::placeholder { color: var(--text3); }

  /* BUTTONS */
  .btn { display: inline-flex; align-items: center; gap: 7px; padding: 7px 14px; border-radius: 6px; border: none; cursor: pointer; font-size: 13px; font-family: var(--sans); font-weight: 500; transition: all 0.15s; white-space: nowrap; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover:not(:disabled) { background: var(--accent2); }
  .btn-ghost { background: var(--bg3); color: var(--text2); border: 1px solid var(--border); }
  .btn-ghost:hover:not(:disabled) { color: var(--text); border-color: var(--border2); background: var(--bg4); }
  .btn-green { background: var(--green); color: #fff; }
  .btn-green:hover:not(:disabled) { background: var(--green2); }
  .btn-danger { background: rgba(232,84,84,0.15); color: var(--red); border: 1px solid rgba(232,84,84,0.2); }
  .btn-sm { padding: 4px 10px; font-size: 12px; }

  /* TABLE */
  .table-wrap { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; animation: fadeIn 0.25s ease; }
  .table { width: 100%; border-collapse: collapse; }
  .table th { background: var(--bg3); padding: 10px 16px; text-align: left; font-size: 11px; font-family: var(--mono); letter-spacing: 0.5px; color: var(--text3); text-transform: uppercase; border-bottom: 1px solid var(--border); font-weight: 500; }
  .table td { padding: 11px 16px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  .table tr:last-child td { border-bottom: none; }
  .table tr:hover td { background: rgba(255,255,255,0.02); }
  .table .check-col { width: 40px; }

  /* BADGES */
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-family: var(--mono); font-weight: 500; }
  .badge-green { background: rgba(62,207,142,0.12); color: var(--green); }
  .badge-gray { background: var(--bg4); color: var(--text3); }
  .badge-yellow { background: rgba(245,166,35,0.12); color: var(--yellow); }
  .badge-red { background: rgba(232,84,84,0.12); color: var(--red); }
  .badge-blue { background: rgba(91,138,240,0.12); color: var(--accent); }
  .badge-purple { background: rgba(167,139,250,0.12); color: var(--purple); }

  /* VERSION */
  .version { font-family: var(--mono); font-size: 12px; color: var(--text2); }
  .version-new { color: var(--green); }

  /* SITE NAME */
  .site-name { font-weight: 500; font-size: 13px; }
  .site-url { font-family: var(--mono); font-size: 11px; color: var(--text3); }

  /* PLUGIN NAME */
  .plugin-name { font-weight: 500; }
  .plugin-slug { font-family: var(--mono); font-size: 11px; color: var(--text3); }

  /* STATS ROW */
  .stats { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .stat-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; padding: 14px 18px; display: flex; flex-direction: column; gap: 4px; min-width: 140px; }
  .stat-value { font-family: var(--mono); font-size: 22px; font-weight: 600; }
  .stat-label { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; }

  /* CHECKBOX */
  .checkbox { width: 16px; height: 16px; border: 1.5px solid var(--border2); border-radius: 3px; background: var(--bg3); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0; }
  .checkbox.checked { background: var(--accent); border-color: var(--accent); }
  .checkbox.indeterminate { background: var(--bg4); border-color: var(--accent); }

  /* SELECTION BAR */
  .sel-bar { display: flex; align-items: center; gap: 12px; background: rgba(91,138,240,0.1); border: 1px solid rgba(91,138,240,0.25); border-radius: 8px; padding: 10px 16px; margin-bottom: 16px; animation: fadeIn 0.2s ease; }
  .sel-bar-count { font-family: var(--mono); font-size: 13px; color: var(--accent); }
  .sel-bar-spacer { flex: 1; }

  /* UPLOAD ZONE */
  .upload-zone { border: 2px dashed var(--border2); border-radius: 10px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--bg2); }
  .upload-zone:hover, .upload-zone.drag { border-color: var(--accent); background: rgba(91,138,240,0.05); }
  .upload-zone-icon { color: var(--text3); margin-bottom: 12px; }
  .upload-zone-title { font-size: 15px; font-weight: 500; margin-bottom: 6px; }
  .upload-zone-sub { font-size: 12px; color: var(--text3); }

  /* MODAL OVERLAY */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px; backdrop-filter: blur(2px); }
  .modal { background: var(--bg2); border: 1px solid var(--border2); border-radius: 12px; padding: 28px; max-width: 560px; width: 100%; animation: fadeIn 0.2s ease; }
  .modal-title { font-family: var(--mono); font-size: 16px; font-weight: 600; margin-bottom: 8px; }
  .modal-sub { color: var(--text2); font-size: 13px; margin-bottom: 24px; line-height: 1.6; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }

  /* TABS */
  .tabs { display: flex; gap: 2px; background: var(--bg3); border: 1px solid var(--border); border-radius: 7px; padding: 3px; margin-bottom: 20px; width: fit-content; }
  .tab { padding: 6px 14px; border-radius: 5px; font-size: 12px; font-family: var(--mono); cursor: pointer; color: var(--text2); transition: all 0.15s; }
  .tab.active { background: var(--bg4); color: var(--text); box-shadow: 0 1px 3px rgba(0,0,0,0.2); }

  /* PROGRESS */
  .progress-bar { height: 4px; background: var(--bg4); border-radius: 2px; overflow: hidden; margin-top: 8px; }
  .progress-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.3s ease; }

  /* LOG */
  .log { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 16px; font-family: var(--mono); font-size: 12px; max-height: 260px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; }
  .log-line { line-height: 1.6; }
  .log-ok { color: var(--green); }
  .log-err { color: var(--red); }
  .log-info { color: var(--text2); }
  .log-warn { color: var(--yellow); }

  /* TOAST */
  .toast-wrap { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 300; }
  .toast { display: flex; align-items: center; gap: 10px; background: var(--bg3); border: 1px solid var(--border2); border-radius: 8px; padding: 12px 16px; font-size: 13px; animation: fadeIn 0.2s ease; box-shadow: 0 8px 32px rgba(0,0,0,0.4); min-width: 260px; max-width: 380px; }
  .toast.ok { border-left: 3px solid var(--green); }
  .toast.err { border-left: 3px solid var(--red); }
  .toast.info { border-left: 3px solid var(--accent); }

  /* EMPTY */
  .empty { text-align: center; padding: 60px 20px; color: var(--text3); }
  .empty-icon { margin-bottom: 12px; opacity: 0.4; }
  .empty-title { font-size: 15px; color: var(--text2); margin-bottom: 6px; }
  .empty-sub { font-size: 12px; }

  /* LOADING SKELETON */
  .skeleton { background: linear-gradient(90deg, var(--bg3) 25%, var(--bg4) 50%, var(--bg3) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* SITE DETAIL */
  .env-chip { display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; background: var(--bg4); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 11px; color: var(--text2); }

  /* FILTER ROW */
  .filter-row { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
  .filter-select { background: var(--bg3); border: 1px solid var(--border); border-radius: 6px; padding: 6px 10px; color: var(--text); font-size: 12px; font-family: var(--mono); outline: none; cursor: pointer; }
  .filter-select:focus { border-color: var(--accent); }

  /* LINK */
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }

  hr { border: none; border-top: 1px solid var(--border); margin: 20px 0; }
`;

// ─── TOAST ────────────────────────────────────────────────────────────────────
let toastId = 0;
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "info") => {
    const id = ++toastId;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);
  return { toasts, add };
}

function Toasts({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.type === "ok" && <Icon name="check" size={14} />}
          {t.type === "err" && <Icon name="x" size={14} />}
          {t.type === "info" && <Icon name="spinner" size={14} />}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

// ─── CHECKBOX ────────────────────────────────────────────────────────────────
function Checkbox({ checked, indeterminate, onChange }) {
  return (
    <div
      className={`checkbox ${checked ? "checked" : ""} ${indeterminate ? "indeterminate" : ""}`}
      onClick={e => { e.stopPropagation(); onChange(!checked); }}
    >
      {checked && <Icon name="check" size={10} />}
      {indeterminate && <span style={{ color: "var(--accent)", fontSize: 12, fontWeight: 700 }}>–</span>}
    </div>
  );
}

// ─── SETUP ───────────────────────────────────────────────────────────────────
function SetupScreen({ onConnect }) {
  const [token, setToken] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleConnect() {
    if (!token.trim() || !companyId.trim()) return;
    setLoading(true); setErr("");
    try {
      await kFetch(`/sites?company=${companyId.trim()}&status=live`, token.trim());
      onConnect(token.trim(), companyId.trim());
    } catch (e) {
      setErr("No se pudo conectar. Verificá el API Token y Company ID.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="setup">
      <div className="setup-card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ background: "rgba(91,138,240,0.15)", borderRadius: 8, padding: 8 }}>
            <Icon name="key" size={22} />
          </div>
          <div>
            <div className="setup-title">Kinsta Plugin Manager</div>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>Conectá tu cuenta de Kinsta</div>
          </div>
        </div>
        <p className="setup-sub">Ingresá tus credenciales de la API de Kinsta. El token se puede generar en <strong>MyKinsta → Usuario → API Keys</strong>. Todo se procesa en el browser.</p>

        <div className="setup-field">
          <label className="setup-label">API TOKEN</label>
          <input className="setup-input" type="password" placeholder="ey..." value={token} onChange={e => setToken(e.target.value)} />
          <p className="setup-note">MyKinsta → tu usuario → API Keys → Generate API Key</p>
        </div>
        <div className="setup-field">
          <label className="setup-label">COMPANY ID</label>
          <input className="setup-input" type="text" placeholder="bdd25d71-..." value={companyId} onChange={e => setCompanyId(e.target.value)} />
          <p className="setup-note">Se encuentra en la URL de MyKinsta: ?idCompany=...</p>
        </div>
        {err && <div style={{ color: "var(--red)", fontSize: 12, marginBottom: 12, padding: "8px 12px", background: "rgba(232,84,84,0.1)", borderRadius: 6 }}>{err}</div>}
        <button
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
          disabled={loading || !token.trim() || !companyId.trim()}
          onClick={handleConnect}
        >
          {loading ? <Icon name="spinner" size={15} /> : <Icon name="plug" size={15} />}
          {loading ? "Conectando..." : "Conectar"}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem("kToken") || "");
  const [companyId, setCompanyId] = useState(() => sessionStorage.getItem("kCompany") || "");
  const [connected, setConnected] = useState(false);

  const [view, setView] = useState("by-site"); // by-site | by-plugin | upload
  const [sites, setSites] = useState([]);
  const [companyPlugins, setCompanyPlugins] = useState([]);
  const [loadingSites, setLoadingSites] = useState(false);
  const [loadingPlugins, setLoadingPlugins] = useState(false);

  // per-site plugin cache: { [env_id]: { items, loading } }
  const [sitePlugins, setSitePlugins] = useState({});
  const [expandedSite, setExpandedSite] = useState(null);

  // selection
  const [selectedPlugins, setSelectedPlugins] = useState(new Set()); // Set of "env_id::slug"
  const [selectedSitePlugins, setSelectedSitePlugins] = useState({}); // { env_id: Set<slug> }

  // update operation
  const [updating, setUpdating] = useState(false);
  const [updateLog, setUpdateLog] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // upload
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadSites, setUploadSites] = useState(new Set());
  const [uploading, setUploading] = useState(false);
  const [uploadLog, setUploadLog] = useState([]);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  // search / filter
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterUpdate, setFilterUpdate] = useState("all");

  const { toasts, add: toast } = useToasts();

  function handleConnect(t, c) {
    sessionStorage.setItem("kToken", t);
    sessionStorage.setItem("kCompany", c);
    setToken(t); setCompanyId(c); setConnected(true);
  }

  function disconnect() {
    sessionStorage.clear();
    setToken(""); setCompanyId(""); setConnected(false);
    setSites([]); setCompanyPlugins([]); setSitePlugins({});
  }

  // LOAD SITES
  const loadSites = useCallback(async () => {
    setLoadingSites(true);
    try {
      const data = await kFetch(`/sites?company=${companyId}&status=live&per_page=500`, token);
      const raw = data.company?.sites?.items || [];
      // Enrich with environment info
      setSites(raw);
    } catch (e) {
      toast("Error al cargar los sitios: " + e.message, "err");
    } finally {
      setLoadingSites(false);
    }
  }, [token, companyId]);

  // LOAD COMPANY PLUGINS
  const loadCompanyPlugins = useCallback(async () => {
    setLoadingPlugins(true);
    try {
      const data = await kFetch(`/company/${companyId}/wp-plugins`, token);
      setCompanyPlugins(data.company?.plugins?.items || []);
    } catch (e) {
      toast("Error al cargar plugins: " + e.message, "err");
    } finally {
      setLoadingPlugins(false);
    }
  }, [token, companyId]);

  // LOAD SITE PLUGINS
  async function loadSitePlugins(envId) {
    setSitePlugins(p => ({ ...p, [envId]: { items: [], loading: true } }));
    try {
      const data = await kFetch(`/sites/environments/${envId}/wp-plugins`, token);
      const items = data.environment?.plugins?.items || [];
      setSitePlugins(p => ({ ...p, [envId]: { items, loading: false } }));
    } catch (e) {
      setSitePlugins(p => ({ ...p, [envId]: { items: [], loading: false, error: e.message } }));
    }
  }

  useEffect(() => {
    if (!connected) return;
    loadSites();
  }, [connected]);

  useEffect(() => {
    if (!connected) return;
    if (view === "by-plugin") loadCompanyPlugins();
  }, [view, connected]);

  // Toggle expand site
  function toggleSite(site) {
    const envId = site.environments?.[0]?.id || site.id;
    if (expandedSite === site.id) {
      setExpandedSite(null);
    } else {
      setExpandedSite(site.id);
      if (!sitePlugins[envId]) loadSitePlugins(envId);
    }
  }

  // BULK UPDATE (by-site view)
  async function runBulkUpdate() {
    // Collect: { env_id, slugs[] }
    const tasks = {};
    for (const key of selectedSitePlugins ? Object.keys(selectedSitePlugins) : []) {
      const slugs = [...(selectedSitePlugins[key] || [])];
      if (slugs.length > 0) tasks[key] = slugs;
    }
    if (Object.keys(tasks).length === 0) return;

    setUpdating(true);
    setUpdateLog([]);
    setShowUpdateModal(true);

    for (const [envId, slugs] of Object.entries(tasks)) {
      const site = sites.find(s => (s.environments?.[0]?.id || s.id) === envId);
      const siteName = site?.display_name || envId;
      addLog(`[${siteName}] Actualizando ${slugs.length} plugin(s)...`, "info");
      try {
        await kFetch(`/sites/environments/${envId}/wp-plugins`, token, {
          method: "PUT",
          body: JSON.stringify({ name: slugs }),
        });
        addLog(`[${siteName}] ✓ ${slugs.join(", ")}`, "ok");
        // Refresh
        await loadSitePlugins(envId);
      } catch (e) {
        addLog(`[${siteName}] ✗ Error: ${e.message}`, "err");
      }
    }
    addLog("— Proceso terminado —", "info");
    setUpdating(false);
    setSelectedSitePlugins({});
    toast("Actualización completada", "ok");
  }

  // BULK UPDATE (by-plugin view)
  async function runPluginViewUpdate() {
    if (selectedPlugins.size === 0) return;
    // Group by env_id
    const byEnv = {};
    for (const key of selectedPlugins) {
      const [envId, slug] = key.split("::");
      if (!byEnv[envId]) byEnv[envId] = [];
      byEnv[envId].push(slug);
    }

    setUpdating(true);
    setUpdateLog([]);
    setShowUpdateModal(true);

    for (const [envId, slugs] of Object.entries(byEnv)) {
      addLog(`[env:${envId.slice(0,8)}] Actualizando ${slugs.join(", ")}...`, "info");
      try {
        await kFetch(`/sites/environments/${envId}/wp-plugins`, token, {
          method: "PUT",
          body: JSON.stringify({ name: slugs }),
        });
        addLog(`[env:${envId.slice(0,8)}] ✓ OK`, "ok");
      } catch (e) {
        addLog(`[env:${envId.slice(0,8)}] ✗ ${e.message}`, "err");
      }
    }
    addLog("— Proceso terminado —", "info");
    setUpdating(false);
    setSelectedPlugins(new Set());
    toast("Actualización completada", "ok");
  }

  function addLog(msg, type = "info") {
    setUpdateLog(l => [...l, { msg, type }]);
  }

  // UPLOAD
  async function runUpload() {
    if (!uploadFile || uploadSites.size === 0) return;
    setUploading(true);
    setUploadLog([{ msg: "Iniciando instalación...", type: "info" }]);

    const b64 = await fileToBase64(uploadFile);

    for (const siteId of uploadSites) {
      const site = sites.find(s => s.id === siteId);
      const siteName = site?.display_name || siteId;
      const envId = site?.environments?.[0]?.id;
      if (!envId) { setUploadLog(l => [...l, { msg: `[${siteName}] No se encontró environment`, type: "err" }]); continue; }

      setUploadLog(l => [...l, { msg: `[${siteName}] Instalando...`, type: "info" }]);
      try {
        await kFetch(`/sites/environments/${envId}/plugins/install`, token, {
          method: "POST",
          body: JSON.stringify({ plugin: b64, filename: uploadFile.name }),
        });
        setUploadLog(l => [...l, { msg: `[${siteName}] ✓ Instalado`, type: "ok" }]);
      } catch (e) {
        setUploadLog(l => [...l, { msg: `[${siteName}] ✗ ${e.message}`, type: "err" }]);
      }
    }
    setUploadLog(l => [...l, { msg: "— Proceso terminado —", type: "info" }]);
    setUploading(false);
    toast("Instalación completada", "ok");
  }

  function fileToBase64(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result.split(",")[1]);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  // ── COUNT updates pending ──
  const pendingUpdates = companyPlugins.reduce((n, p) => n + (p.update_count || 0), 0);

  if (!connected) {
    return (
      <>
        <style>{css}</style>
        <div className="app">
          <div className="header">
            <div className="header-logo"><div className="header-logo-dot" /><span>Kinsta Plugin Manager</span></div>
          </div>
          <SetupScreen onConnect={handleConnect} />
        </div>
      </>
    );
  }

  // ── VIEWS ──────────────────────────────────────────────────────────────────

  const totalSelectedSitePlugins = Object.values(selectedSitePlugins).reduce((n, s) => n + s.size, 0);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* HEADER */}
        <div className="header">
          <div className="header-logo"><div className="header-logo-dot" /><span>Kinsta Plugin Manager</span></div>
          <div className="header-spacer" />
          <span className="header-badge">{sites.length} sitios</span>
          <button className="btn btn-ghost btn-sm" onClick={disconnect} style={{ gap: 6 }}>
            <Icon name="x" size={13} /> Desconectar
          </button>
        </div>

        <div className="main">
          {/* SIDEBAR */}
          <div className="sidebar">
            <div className="sidebar-section">Vistas</div>
            <div className={`sidebar-item ${view === "by-site" ? "active" : ""}`} onClick={() => setView("by-site")}>
              <Icon name="layout" size={15} /> Por sitio
              <span className="sidebar-badge">{sites.length}</span>
            </div>
            <div className={`sidebar-item ${view === "by-plugin" ? "active" : ""}`} onClick={() => setView("by-plugin")}>
              <Icon name="list" size={15} /> Por plugin
              {pendingUpdates > 0 && <span className="sidebar-badge warn">{pendingUpdates}</span>}
            </div>
            <div className="sidebar-section">Acciones</div>
            <div className={`sidebar-item ${view === "upload" ? "active" : ""}`} onClick={() => setView("upload")}>
              <Icon name="upload" size={15} /> Instalar ZIP
            </div>
          </div>

          {/* CONTENT */}
          <div className="content">
            <div className="content-inner">
              {view === "by-site" && (
                <BySiteView
                  sites={sites}
                  sitePlugins={sitePlugins}
                  expandedSite={expandedSite}
                  toggleSite={toggleSite}
                  loadSites={loadSites}
                  loadingSites={loadingSites}
                  selectedSitePlugins={selectedSitePlugins}
                  setSelectedSitePlugins={setSelectedSitePlugins}
                  totalSelected={totalSelectedSitePlugins}
                  onUpdate={runBulkUpdate}
                  search={search}
                  setSearch={setSearch}
                  filterUpdate={filterUpdate}
                  setFilterUpdate={setFilterUpdate}
                />
              )}
              {view === "by-plugin" && (
                <ByPluginView
                  companyPlugins={companyPlugins}
                  loadingPlugins={loadingPlugins}
                  loadCompanyPlugins={loadCompanyPlugins}
                  selectedPlugins={selectedPlugins}
                  setSelectedPlugins={setSelectedPlugins}
                  onUpdate={runPluginViewUpdate}
                  search={search}
                  setSearch={setSearch}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                  filterUpdate={filterUpdate}
                  setFilterUpdate={setFilterUpdate}
                />
              )}
              {view === "upload" && (
                <UploadView
                  sites={sites}
                  uploadFile={uploadFile}
                  setUploadFile={setUploadFile}
                  uploadSites={uploadSites}
                  setUploadSites={setUploadSites}
                  uploading={uploading}
                  uploadLog={uploadLog}
                  onUpload={runUpload}
                  drag={drag}
                  setDrag={setDrag}
                  fileRef={fileRef}
                  search={search}
                  setSearch={setSearch}
                />
              )}
            </div>
          </div>
        </div>

        {/* UPDATE MODAL */}
        {showUpdateModal && (
          <div className="overlay" onClick={updating ? null : () => setShowUpdateModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">{updating ? "Actualizando plugins..." : "Actualización completada"}</div>
              <div className="modal-sub">
                {updating ? "No cerrés esta ventana mientras se procesan las actualizaciones." : "Podés cerrar este panel."}
              </div>
              {updating && (
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "100%", animation: "pulse 1.5s infinite" }} />
                </div>
              )}
              <div className="log" style={{ marginTop: 16 }}>
                {updateLog.map((l, i) => (
                  <div key={i} className={`log-line log-${l.type}`}>{l.msg}</div>
                ))}
              </div>
              {!updating && (
                <div className="modal-actions">
                  <button className="btn btn-primary" onClick={() => setShowUpdateModal(false)}>Cerrar</button>
                </div>
              )}
            </div>
          </div>
        )}

        <Toasts toasts={toasts} />
      </div>
    </>
  );
}

// ─── BY SITE VIEW ─────────────────────────────────────────────────────────────
function BySiteView({ sites, sitePlugins, expandedSite, toggleSite, loadSites, loadingSites, selectedSitePlugins, setSelectedSitePlugins, totalSelected, onUpdate, search, setSearch, filterUpdate, setFilterUpdate }) {

  function togglePlugin(envId, slug) {
    setSelectedSitePlugins(prev => {
      const s = new Set(prev[envId] || []);
      if (s.has(slug)) s.delete(slug); else s.add(slug);
      return { ...prev, [envId]: s };
    });
  }

  function selectAllSitePlugins(envId, pluginsWithUpdate) {
    setSelectedSitePlugins(prev => {
      const current = prev[envId] || new Set();
      const allSlugs = pluginsWithUpdate.map(p => p.name);
      const allSelected = allSlugs.every(s => current.has(s));
      const newSet = new Set(current);
      if (allSelected) allSlugs.forEach(s => newSet.delete(s));
      else allSlugs.forEach(s => newSet.add(s));
      return { ...prev, [envId]: newSet };
    });
  }

  const filtered = sites.filter(s => {
    if (search && !s.display_name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-title">Plugins por sitio</div>
        <div className="search-box">
          <Icon name="search" size={14} />
          <input placeholder="Buscar sitio..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-ghost" onClick={loadSites} disabled={loadingSites}>
          <Icon name={loadingSites ? "spinner" : "refresh"} size={14} />
          {loadingSites ? "Cargando..." : "Actualizar"}
        </button>
      </div>

      {totalSelected > 0 && (
        <div className="sel-bar">
          <Icon name="check" size={14} />
          <span className="sel-bar-count">{totalSelected} plugin(s) seleccionados</span>
          <div className="sel-bar-spacer" />
          <button className="btn btn-green btn-sm" onClick={onUpdate}>
            <Icon name="arrowUp" size={13} /> Actualizar selección
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setSelectedSitePlugins({})}>Limpiar</button>
        </div>
      )}

      {loadingSites ? (
        <SkeletonTable rows={8} cols={4} />
      ) : filtered.length === 0 ? (
        <Empty title="Sin sitios" sub="No se encontraron sitios con ese criterio." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(site => {
            const envId = site.environments?.[0]?.id || site.id;
            const isExpanded = expandedSite === site.id;
            const plugData = sitePlugins[envId];
            const plugins = plugData?.items || [];
            const siteSelected = selectedSitePlugins[envId] || new Set();
            const pluginsWithUpdate = plugins.filter(p => p.update === "available");
            const allSelected = pluginsWithUpdate.length > 0 && pluginsWithUpdate.every(p => siteSelected.has(p.name));
            const someSelected = pluginsWithUpdate.some(p => siteSelected.has(p.name));

            return (
              <div key={site.id} className="table-wrap" style={{ borderRadius: 8 }}>
                {/* SITE ROW */}
                <div
                  onClick={() => toggleSite(site)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", userSelect: "none" }}
                >
                  <Icon name={isExpanded ? "chevronDown" : "chevronRight"} size={14} />
                  <div style={{ flex: 1 }}>
                    <div className="site-name">{site.display_name}</div>
                    <div className="site-url">{site.site_name || site.display_name}</div>
                  </div>
                  {isExpanded && pluginsWithUpdate.length > 0 && (
                    <div onClick={e => { e.stopPropagation(); selectAllSitePlugins(envId, pluginsWithUpdate); }}>
                      <Checkbox checked={allSelected} indeterminate={!allSelected && someSelected} onChange={() => {}} />
                    </div>
                  )}
                  <span className="badge badge-blue">{plugins.length || "—"} plugins</span>
                  {pluginsWithUpdate.length > 0 && (
                    <span className="badge badge-yellow"><Icon name="arrowUp" size={10} /> {pluginsWithUpdate.length} updates</span>
                  )}
                  {plugData?.loading && <Icon name="spinner" size={14} />}
                </div>

                {/* PLUGIN LIST */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid var(--border)" }}>
                    {plugData?.loading && <div style={{ padding: "12px 16px", color: "var(--text3)", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}><Icon name="spinner" size={13} /> Cargando plugins...</div>}
                    {plugData?.error && <div style={{ padding: 12, color: "var(--red)", fontSize: 12 }}>Error: {plugData.error}</div>}
                    {!plugData?.loading && plugins.length === 0 && <div style={{ padding: 12, color: "var(--text3)", fontSize: 12 }}>No se encontraron plugins.</div>}
                    {plugins.length > 0 && (
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="check-col"></th>
                            <th>Plugin</th>
                            <th>Estado</th>
                            <th>Versión</th>
                            <th>Update</th>
                            <th>Auto-update</th>
                          </tr>
                        </thead>
                        <tbody>
                          {plugins.map(p => (
                            <tr key={p.name}>
                              <td>
                                {p.update === "available" && (
                                  <Checkbox
                                    checked={siteSelected.has(p.name)}
                                    onChange={() => togglePlugin(envId, p.name)}
                                  />
                                )}
                              </td>
                              <td>
                                <div className="plugin-name">{p.title || p.name}</div>
                                <div className="plugin-slug">{p.name}</div>
                              </td>
                              <td>
                                <span className={`badge ${p.status === "active" ? "badge-green" : "badge-gray"}`}>
                                  {p.status === "active" ? "activo" : "inactivo"}
                                </span>
                                {p.is_version_vulnerable && (
                                  <span className="badge badge-red" style={{ marginLeft: 6 }}>
                                    <Icon name="shield" size={10} /> vuln
                                  </span>
                                )}
                              </td>
                              <td><span className="version">{p.version}</span></td>
                              <td>
                                {p.update === "available"
                                  ? <span className="badge badge-yellow"><Icon name="arrowUp" size={10} /> {p.update_version}</span>
                                  : <span className="badge badge-gray">—</span>
                                }
                              </td>
                              <td><span className="version" style={{ fontSize: 11 }}>{p.auto_update_type || "—"}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── BY PLUGIN VIEW ───────────────────────────────────────────────────────────
function ByPluginView({ companyPlugins, loadingPlugins, loadCompanyPlugins, selectedPlugins, setSelectedPlugins, onUpdate, search, setSearch, filterStatus, setFilterStatus, filterUpdate, setFilterUpdate }) {
  const [expanded, setExpanded] = useState(null);

  function toggleEnv(envKey) {
    setExpanded(e => e === envKey ? null : envKey);
  }

  function toggleSelect(envId, slug) {
    const key = `${envId}::${slug}`;
    setSelectedPlugins(prev => {
      const s = new Set(prev);
      if (s.has(key)) s.delete(key); else s.add(key);
      return s;
    });
  }

  const filtered = companyPlugins.filter(p => {
    if (search && !p.title?.toLowerCase().includes(search.toLowerCase()) && !p.name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterUpdate === "pending" && p.update_count === 0) return false;
    return true;
  });

  const totalUpdates = companyPlugins.reduce((n, p) => n + (p.update_count || 0), 0);

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-title">Plugins (company-wide)</div>
        <div className="search-box">
          <Icon name="search" size={14} />
          <input placeholder="Buscar plugin..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={filterUpdate} onChange={e => setFilterUpdate(e.target.value)}>
          <option value="all">Todos</option>
          <option value="pending">Con updates</option>
        </select>
        <button className="btn btn-ghost" onClick={loadCompanyPlugins} disabled={loadingPlugins}>
          <Icon name={loadingPlugins ? "spinner" : "refresh"} size={14} />
          {loadingPlugins ? "Cargando..." : "Actualizar"}
        </button>
      </div>

      {selectedPlugins.size > 0 && (
        <div className="sel-bar">
          <Icon name="check" size={14} />
          <span className="sel-bar-count">{selectedPlugins.size} instancia(s) seleccionadas</span>
          <div className="sel-bar-spacer" />
          <button className="btn btn-green btn-sm" onClick={onUpdate}>
            <Icon name="arrowUp" size={13} /> Actualizar selección
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setSelectedPlugins(new Set())}>Limpiar</button>
        </div>
      )}

      {!loadingPlugins && (
        <div className="stats">
          <div className="stat-card">
            <div className="stat-value">{companyPlugins.length}</div>
            <div className="stat-label">Plugins únicos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--yellow)" }}>{totalUpdates}</div>
            <div className="stat-label">Instancias desact.</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--red)" }}>
              {companyPlugins.filter(p => p.is_latest_version_vulnerable).length}
            </div>
            <div className="stat-label">Vulnerables</div>
          </div>
        </div>
      )}

      {loadingPlugins ? (
        <SkeletonTable rows={10} cols={5} />
      ) : filtered.length === 0 ? (
        <Empty title="Sin plugins" sub={companyPlugins.length === 0 ? "Hacé click en Actualizar para cargar." : "No hay plugins con ese criterio."} />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Plugin</th>
                <th>Última versión</th>
                <th>Instalado en</th>
                <th>Pendientes</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(plugin => {
                const isExp = expanded === plugin.name;
                const hasUpdates = plugin.update_count > 0;
                return (
                  <>
                    <tr key={plugin.name} onClick={() => toggleEnv(plugin.name)} style={{ cursor: "pointer" }}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Icon name={isExp ? "chevronDown" : "chevronRight"} size={13} />
                          <div>
                            <div className="plugin-name">{plugin.title || plugin.name}</div>
                            <div className="plugin-slug">{plugin.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="version">{plugin.latest_version}</span>
                        {plugin.is_latest_version_vulnerable && (
                          <span className="badge badge-red" style={{ marginLeft: 8 }}><Icon name="shield" size={10} /> vuln</span>
                        )}
                      </td>
                      <td><span className="badge badge-blue">{plugin.environment_count} sitios</span></td>
                      <td>
                        {hasUpdates
                          ? <span className="badge badge-yellow"><Icon name="arrowUp" size={10} /> {plugin.update_count}</span>
                          : <span className="badge badge-green"><Icon name="check" size={10} /> al día</span>
                        }
                      </td>
                      <td>
                        {plugin.is_latest_version_vulnerable
                          ? <span className="badge badge-red">Vulnerable</span>
                          : <span className="badge badge-green">OK</span>
                        }
                      </td>
                    </tr>
                    {isExp && (plugin.environments || []).map(env => {
                      const key = `${env.env_id || env.site_display_name}::${plugin.name}`;
                      const sel = selectedPlugins.has(key);
                      return (
                        <tr key={key} style={{ background: "rgba(255,255,255,0.015)" }}>
                          <td style={{ paddingLeft: 40 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {env.plugin_update === "available" && (
                                <Checkbox checked={sel} onChange={() => toggleSelect(env.env_id || env.site_display_name, plugin.name)} />
                              )}
                              <Icon name="globe" size={12} />
                              <div>
                                <div style={{ fontSize: 13 }}>{env.site_display_name}</div>
                                <div className="plugin-slug">{env.display_name}</div>
                              </div>
                            </div>
                          </td>
                          <td></td>
                          <td>
                            <span className={`badge ${env.plugin_status === "active" ? "badge-green" : "badge-gray"}`}>
                              {env.plugin_status === "active" ? "activo" : "inactivo"}
                            </span>
                          </td>
                          <td>
                            {env.plugin_update === "available"
                              ? <span className="badge badge-yellow"><Icon name="arrowUp" size={10} /> update</span>
                              : <span className="badge badge-gray">—</span>
                            }
                          </td>
                          <td><span className="version">{env.plugin_version}</span></td>
                        </tr>
                      );
                    })}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ─── UPLOAD VIEW ──────────────────────────────────────────────────────────────
function UploadView({ sites, uploadFile, setUploadFile, uploadSites, setUploadSites, uploading, uploadLog, onUpload, drag, setDrag, fileRef, search, setSearch }) {

  function handleDrop(e) {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.name.endsWith(".zip")) setUploadFile(f);
  }

  function toggleSite(id) {
    setUploadSites(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  }

  function selectAll() {
    setUploadSites(new Set(filteredSites.map(s => s.id)));
  }

  const filteredSites = sites.filter(s =>
    !search || s.display_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-title">Instalar / Actualizar plugin desde ZIP</div>
      </div>

      {/* DROP ZONE */}
      <div
        className={`upload-zone ${drag ? "drag" : ""}`}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{ marginBottom: 20 }}
      >
        <input ref={fileRef} type="file" accept=".zip" style={{ display: "none" }} onChange={e => setUploadFile(e.target.files?.[0])} />
        <div className="upload-zone-icon"><Icon name="upload" size={32} /></div>
        {uploadFile ? (
          <>
            <div className="upload-zone-title" style={{ color: "var(--green)" }}>✓ {uploadFile.name}</div>
            <div className="upload-zone-sub">{(uploadFile.size / 1024).toFixed(1)} KB — hacé click para cambiar</div>
          </>
        ) : (
          <>
            <div className="upload-zone-title">Arrastrá el ZIP del plugin aquí</div>
            <div className="upload-zone-sub">o hacé click para seleccionar un archivo</div>
          </>
        )}
      </div>

      {/* SITE SELECTOR */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div className="toolbar-title" style={{ fontSize: 13 }}>Seleccioná los sitios destino</div>
        <div className="search-box">
          <Icon name="search" size={14} />
          <input placeholder="Filtrar sitios..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-ghost btn-sm" onClick={selectAll}>Seleccionar todos</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setUploadSites(new Set())}>Limpiar</button>
        <span className="header-badge">{uploadSites.size} seleccionados</span>
      </div>

      <div className="table-wrap" style={{ marginBottom: 20 }}>
        <table className="table">
          <thead>
            <tr>
              <th className="check-col"></th>
              <th>Sitio</th>
            </tr>
          </thead>
          <tbody>
            {filteredSites.map(site => (
              <tr key={site.id} onClick={() => toggleSite(site.id)} style={{ cursor: "pointer" }}>
                <td>
                  <Checkbox checked={uploadSites.has(site.id)} onChange={() => toggleSite(site.id)} />
                </td>
                <td>
                  <div className="site-name">{site.display_name}</div>
                  <div className="site-url">{site.site_name}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="btn btn-primary"
        disabled={!uploadFile || uploadSites.size === 0 || uploading}
        onClick={onUpload}
        style={{ marginBottom: 16 }}
      >
        <Icon name={uploading ? "spinner" : "upload"} size={15} />
        {uploading ? "Instalando..." : `Instalar en ${uploadSites.size} sitio(s)`}
      </button>

      {uploadLog.length > 0 && (
        <div className="log">
          {uploadLog.map((l, i) => (
            <div key={i} className={`log-line log-${l.type}`}>{l.msg}</div>
          ))}
        </div>
      )}
    </>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead><tr>{Array.from({ length: cols }).map((_, i) => <th key={i}><div className="skeleton" style={{ height: 10, width: "60%", borderRadius: 3 }} /></th>)}</tr></thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c}><div className="skeleton" style={{ height: 12, width: `${50 + Math.random() * 40}%`, borderRadius: 3 }} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Empty({ title, sub }) {
  return (
    <div className="empty">
      <div className="empty-icon"><Icon name="plug" size={36} /></div>
      <div className="empty-title">{title}</div>
      <div className="empty-sub">{sub}</div>
    </div>
  );
}
