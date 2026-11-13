-- Stage ordering so reordering in the admin does not affect production until published.
ALTER TABLE documents ADD COLUMN stage_sort INTEGER;
