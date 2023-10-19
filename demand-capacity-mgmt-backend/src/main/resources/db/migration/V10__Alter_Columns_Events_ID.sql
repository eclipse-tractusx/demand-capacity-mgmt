SET search_path TO public;

ALTER TABLE logging_history DROP COLUMN id;

ALTER TABLE logging_history
    ADD COLUMN id serial PRIMARY KEY;

ALTER TABLE archived_log DROP COLUMN id;

ALTER TABLE archived_log
    ADD COLUMN id serial PRIMARY KEY;
