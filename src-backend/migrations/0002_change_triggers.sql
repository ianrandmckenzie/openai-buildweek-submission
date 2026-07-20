CREATE TRIGGER IF NOT EXISTS records_change_after_insert
AFTER INSERT ON records
BEGIN
  INSERT INTO changes(store, record_id, updated_at)
  VALUES (NEW.store, NEW.id, NEW.updated_at);
END;

CREATE TRIGGER IF NOT EXISTS records_change_after_update
AFTER UPDATE OF data, updated_at, deleted_at ON records
WHEN NEW.updated_at >= OLD.updated_at
BEGIN
  INSERT INTO changes(store, record_id, updated_at)
  VALUES (NEW.store, NEW.id, NEW.updated_at);
END;
