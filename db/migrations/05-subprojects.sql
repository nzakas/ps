CREATE TABLE subprojects(
  subproject_id uuid PRIMARY KEY DEFAULT NULL, -- public.uuid_generate_v7(),
  account_id uuid DEFAULT NULL REFERENCES accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE,
  project_id uuid DEFAULT NULL REFERENCES projects(project_id) ON DELETE CASCADE ON UPDATE CASCADE,
  name text DEFAULT NULL,
  since_year integer DEFAULT NULL,
  -- data jsonb DEFAULT NULL,
  files boolean DEFAULT NULL, -- TRUE,
  deleted boolean DEFAULT NULL -- FALSE
);

CREATE INDEX ON subprojects USING btree(subproject_id);

CREATE INDEX ON subprojects USING btree(account_id);

CREATE INDEX ON subprojects USING btree(project_id);

CREATE INDEX ON subprojects USING btree(name);

CREATE INDEX ON subprojects USING btree(since_year);

COMMENT ON COLUMN subprojects.account_id IS 'redundant account_id enhances data safety';

COMMENT ON COLUMN subprojects.name IS 'Example: a species name like "Pulsatilla vulgaris"';

COMMENT ON COLUMN subprojects.since_year IS 'Enables analyzing a development since a certain year, like the begin of the project';

-- COMMENT ON COLUMN subprojects.data IS 'Room for subproject specific data, defined in "fields" table';
COMMENT ON COLUMN subprojects.files IS 'Whether files are used. Preset: true';

COMMENT ON TABLE subprojects IS 'Goal: manage subprojects. Will most often be a species that is promoted. Can also be a (class of) biotope(s).';

ALTER TABLE subprojects ENABLE electric;

