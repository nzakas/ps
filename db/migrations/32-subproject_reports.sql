CREATE TABLE subproject_reports(
  subproject_report_id uuid PRIMARY KEY DEFAULT NULL, -- public.uuid_generate_v7(),
  account_id uuid DEFAULT NULL REFERENCES accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE,
  subproject_id uuid DEFAULT NULL REFERENCES subprojects(subproject_id) ON DELETE CASCADE ON UPDATE CASCADE,
  year integer DEFAULT NULL, -- DATE_PART('year', now()::date),
  data jsonb DEFAULT NULL,
  files_active boolean DEFAULT NULL, -- TRUE,
  deleted boolean DEFAULT NULL -- FALSE
);

CREATE INDEX ON subproject_reports USING btree(subproject_report_id);

CREATE INDEX ON subproject_reports USING btree(account_id);

CREATE INDEX ON subproject_reports USING btree(subproject_id);

CREATE INDEX ON subproject_reports USING btree(year);

-- CREATE INDEX ON subproject_reports((1))
-- WHERE
--   deleted;
COMMENT ON TABLE subproject_reports IS 'Reporting on the success of subprojects.';

COMMENT ON COLUMN subproject_reports.account_id IS 'redundant account_id enhances data safety';

COMMENT ON COLUMN subproject_reports.year IS 'Year of report. Preset: current year';

COMMENT ON COLUMN subproject_reports.data IS 'Room for subproject report specific data, defined in "fields" table';

COMMENT ON COLUMN subproject_reports.files_active IS 'Whether files are used. Preset: true';

ALTER TABLE subproject_reports ENABLE electric;

