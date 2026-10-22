import "server-only";

// Accès à la base PostgreSQL (Neon en production).
// En développement, sans DATABASE_URL, une base locale est créée dans le dossier .data (PGlite).
// Toutes les requêtes sont paramétrées ($1, $2…) : jamais de valeur collée dans le texte SQL.

const g = globalThis;

async function connect() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (url) {
    const { default: postgres } = await import("postgres");
    const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
    const sql = postgres(url, {
      ssl: local ? false : "require",
      max: 1, // une connexion par instance serverless
      prepare: false, // requis par le pooler « Transaction » de Supabase
      idle_timeout: 20,
      connect_timeout: 10,
      types: { date: { to: 1082, from: [1082], serialize: (x) => x, parse: (x) => x } }, // les dates restent du texte AAAA-MM-JJ
    });
    return { run: (text, params) => sql.unsafe(text, params) };
  }
  // Base locale : développement, ou essai local explicite avec MGS_LOCAL_DB=1. Jamais en production sans cette variable.
  if (process.env.NODE_ENV === "production" && process.env.MGS_LOCAL_DB !== "1") {
    throw new Error("DATABASE_URL n'est pas défini.");
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const dir = process.env.MGS_DEV_DB_DIR || ".data/pg";
  (await import("node:fs")).mkdirSync(dir, { recursive: true });
  const db = new PGlite(dir);
  return { run: async (text, params) => (await db.query(text, params)).rows };
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS visits (
    id BIGSERIAL PRIMARY KEY, ts TIMESTAMPTZ NOT NULL DEFAULT now(),
    path TEXT NOT NULL, lang TEXT, visitor TEXT NOT NULL, country TEXT, device TEXT, source TEXT)`,
  `CREATE INDEX IF NOT EXISTS visits_ts_idx ON visits (ts)`,
  `CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY, ts TIMESTAMPTZ NOT NULL DEFAULT now(),
    type TEXT NOT NULL, path TEXT, visitor TEXT, label TEXT)`,
  `CREATE INDEX IF NOT EXISTS events_ts_idx ON events (ts)`,
  `CREATE TABLE IF NOT EXISTS briefs (
    id BIGSERIAL PRIMARY KEY, ts TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL, phone TEXT, projects JSONB NOT NULL DEFAULT '[]', needs JSONB NOT NULL DEFAULT '[]',
    delay TEXT, message TEXT, lang TEXT, status TEXT NOT NULL DEFAULT 'nouveau')`,
  `CREATE TABLE IF NOT EXISTS otp_codes (
    id BIGSERIAL PRIMARY KEY, email TEXT NOT NULL, code_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL, attempts INT NOT NULL DEFAULT 0, used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY, email TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL, revoked BOOLEAN NOT NULL DEFAULT false, ip_hash TEXT, ua TEXT)`,
  `CREATE TABLE IF NOT EXISTS auth_log (
    id BIGSERIAL PRIMARY KEY, ts TIMESTAMPTZ NOT NULL DEFAULT now(),
    email_hash TEXT, kind TEXT NOT NULL, ok BOOLEAN NOT NULL, ip_hash TEXT, detail TEXT)`,
  `CREATE INDEX IF NOT EXISTS auth_log_ts_idx ON auth_log (ts)`,
  `CREATE TABLE IF NOT EXISTS site_content (
    key TEXT PRIMARY KEY, value JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, mime TEXT NOT NULL, data BYTEA NOT NULL,
    bytes INT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
];

const TABLES = ["visits", "events", "briefs", "otp_codes", "sessions", "auth_log", "site_content", "media"];

async function ready() {
  if (!g.__mgsDb) {
    g.__mgsDb = (async () => {
      const conn = await connect();
      for (const stmt of SCHEMA) await conn.run(stmt, []);
      // Sécurité Supabase : les tables sont fermées à l'API publique (clé « anon »). Seule notre connexion serveur y accède.
      for (const t of TABLES) await conn.run(`ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY`, []);
      return conn;
    })().catch((e) => {
      g.__mgsDb = null;
      throw e;
    });
  }
  return g.__mgsDb;
}

export async function query(text, params = []) {
  const conn = await ready();
  return conn.run(text, params);
}

