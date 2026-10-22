import "server-only";
import { query } from "./db";

const n = (v) => Number(v || 0);

export async function dashboard(days) {
  const d = [days];
  const [tot, briefs, byEvent, series, pages, sources, countries, devices, langs, recent] = await Promise.all([
    query(
      `SELECT count(*) AS views, count(distinct visitor) AS visitors,
              (SELECT count(*) FROM (SELECT 1 FROM visits WHERE ts > now() - make_interval(days => $1::int) GROUP BY date_trunc('day', ts), visitor) x) AS visits
       FROM visits WHERE ts > now() - make_interval(days => $1::int)`, d),
    query(`SELECT count(*) n FROM briefs WHERE ts > now() - make_interval(days => $1::int)`, d),
    query(`SELECT type, count(*) n FROM events WHERE ts > now() - make_interval(days => $1::int) GROUP BY type`, d),
    query(
      `SELECT g::date AS day, COALESCE(v.visits,0) AS visits, COALESCE(v.views,0) AS views
       FROM generate_series((now() at time zone 'utc')::date - ($1::int - 1), (now() at time zone 'utc')::date, interval '1 day') g
       LEFT JOIN (SELECT (ts at time zone 'utc')::date AS day, count(distinct visitor) AS visits, count(*) AS views
                  FROM visits WHERE ts > now() - make_interval(days => $1::int + 1) GROUP BY 1) v ON v.day = g::date
       ORDER BY 1`, d),
    query(`SELECT path AS label, count(*) AS n FROM visits WHERE ts > now() - make_interval(days => $1::int) GROUP BY 1 ORDER BY 2 DESC LIMIT 8`, d),
    query(`SELECT COALESCE(source,'direct') AS label, count(*) AS n FROM visits WHERE ts > now() - make_interval(days => $1::int) GROUP BY 1 ORDER BY 2 DESC LIMIT 8`, d),
    query(`SELECT COALESCE(country,'?') AS label, count(*) AS n FROM visits WHERE ts > now() - make_interval(days => $1::int) GROUP BY 1 ORDER BY 2 DESC LIMIT 8`, d),
    query(`SELECT COALESCE(device,'?') AS label, count(*) AS n FROM visits WHERE ts > now() - make_interval(days => $1::int) GROUP BY 1 ORDER BY 2 DESC`, d),
    query(`SELECT COALESCE(lang,'?') AS label, count(*) AS n FROM visits WHERE ts > now() - make_interval(days => $1::int) GROUP BY 1 ORDER BY 2 DESC`, d),
    query(`SELECT id, ts, name, projects, status FROM briefs ORDER BY ts DESC LIMIT 5`, []),
  ]);
  const ev = Object.fromEntries(byEvent.map((r) => [r.type, n(r.n)]));
  const rows = (r) => r.map((x) => ({ label: x.label, n: n(x.n) }));
  return {
    views: n(tot[0]?.views),
    visits: n(tot[0]?.visits),
    briefs: n(briefs[0]?.n),
    quoteOpens: ev.quote_open || 0,
    whatsapp: ev.whatsapp_click || 0,
    series: series.map((s) => ({ day: String(s.day).slice(0, 10), visits: n(s.visits), views: n(s.views) })),
    pages: rows(pages),
    sources: rows(sources),
    countries: rows(countries),
    devices: rows(devices),
    langs: rows(langs),
    recent,
  };
}

export async function listBriefs({ q = "", status = "" } = {}) {
  const params = [];
  const where = [];
  if (status) {
    params.push(status);
    where.push(`status = $${params.length}`);
  }
  if (q) {
    params.push(`%${q.replace(/[%_\\]/g, "\\$&")}%`);
    where.push(`(name ILIKE $${params.length} OR phone ILIKE $${params.length} OR message ILIKE $${params.length})`);
  }
  return query(
    `SELECT id, ts, name, phone, projects, needs, delay, message, lang, status FROM briefs
     ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY ts DESC LIMIT 200`,
    params
  );
}

export const authJournal = () =>
  query(`SELECT ts, kind, ok, detail, ip_hash FROM auth_log ORDER BY ts DESC LIMIT 60`, []);

export const activeSessions = () =>
  query(`SELECT id, email, created_at, expires_at, ua FROM sessions WHERE revoked=false AND expires_at > now() ORDER BY created_at DESC LIMIT 20`, []);
