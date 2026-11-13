-- BCE content platform — initial schema (Cloudflare D1)
-- One generic documents table keeps the admin flexible while D1 stays tiny.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS documents (
  id          TEXT PRIMARY KEY,              -- "<type>:<slug>"
  type        TEXT NOT NULL,                 -- projects | posts | vacancies | resources | businesses | offerings | pages
  slug        TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort        INTEGER NOT NULL DEFAULT 0,
  data        TEXT NOT NULL,                 -- JSON document
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL,
  updated_by  TEXT,
  UNIQUE (type, slug)
);
CREATE INDEX IF NOT EXISTS idx_documents_type_status_sort
  ON documents (type, status, sort, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_updated
  ON documents (updated_at DESC);

CREATE TABLE IF NOT EXISTS leads (
  id          TEXT PRIMARY KEY,
  kind        TEXT NOT NULL DEFAULT 'quote',  -- quote | contact | careers
  status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'won', 'closed', 'spam')),
  name        TEXT,
  phone       TEXT,
  email       TEXT,
  company     TEXT,
  service     TEXT,
  project     TEXT,
  location    TEXT,
  message     TEXT,
  payload     TEXT NOT NULL,                 -- full JSON submitted by the browser
  source      TEXT,
  ip_hash     TEXT,
  user_agent  TEXT,
  notes       TEXT,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL,
  updated_by  TEXT
);
CREATE INDEX IF NOT EXISTS idx_leads_status_created ON leads (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at DESC);

CREATE TABLE IF NOT EXISTS media (
  key          TEXT PRIMARY KEY,
  url          TEXT NOT NULL,
  name         TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size         INTEGER NOT NULL,
  width        INTEGER,
  height       INTEGER,
  alt          TEXT,
  created_at   TEXT NOT NULL,
  created_by   TEXT
);
CREATE INDEX IF NOT EXISTS idx_media_created ON media (created_at DESC);

CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
  id            TEXT PRIMARY KEY,
  actor         TEXT NOT NULL,
  action        TEXT NOT NULL,
  resource_type TEXT,
  resource_id   TEXT,
  detail        TEXT,
  ip_hash       TEXT,
  created_at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log (created_at DESC);

CREATE TABLE IF NOT EXISTS rate_limits (
  key          TEXT PRIMARY KEY,
  count        INTEGER NOT NULL DEFAULT 0,
  window_start INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS meta (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT INTO meta (key, value, updated_at)
VALUES ('content_version', '1', datetime('now'))
ON CONFLICT(key) DO NOTHING;
