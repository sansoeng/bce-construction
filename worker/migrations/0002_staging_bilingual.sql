-- BCE staging workflow + bilingual content.
-- `data`/`km` are the published version. `stage_*` holds the pending
-- version shown on staging.bce-construction.com until it is promoted.

ALTER TABLE documents ADD COLUMN km TEXT;
ALTER TABLE documents ADD COLUMN stage_data TEXT;
ALTER TABLE documents ADD COLUMN stage_km TEXT;
ALTER TABLE documents ADD COLUMN stage_status TEXT;          -- draft | staged | deleted
ALTER TABLE documents ADD COLUMN stage_updated_at TEXT;
ALTER TABLE documents ADD COLUMN stage_updated_by TEXT;

CREATE INDEX IF NOT EXISTS idx_documents_stage_status
  ON documents (stage_status, updated_at DESC);

INSERT INTO meta (key, value, updated_at)
VALUES ('staging_version', '1', datetime('now'))
ON CONFLICT(key) DO NOTHING;
