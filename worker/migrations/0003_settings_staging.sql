-- Stage settings alongside content so every admin save reaches staging first.
ALTER TABLE settings ADD COLUMN stage_value TEXT;
ALTER TABLE settings ADD COLUMN stage_updated_at TEXT;
ALTER TABLE settings ADD COLUMN stage_updated_by TEXT;
