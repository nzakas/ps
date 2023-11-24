CREATE EXTENSION IF NOT EXISTS postgis;

---------------------------------------------
-- accounts
--
DROP TABLE IF EXISTS accounts CASCADE;

CREATE TABLE accounts(
  account_id uuid PRIMARY KEY DEFAULT public.uuid_generate_v7(),
  type text DEFAULT NULL,
  period daterange DEFAULT NULL
);

-- how to query if date is in range:
-- where period @> '2023-11-01'::date
CREATE INDEX ON accounts USING btree(account_id);

CREATE INDEX ON accounts USING gist(period);

COMMENT ON COLUMN accounts.type IS 'type of account: "free", "basic", "premium"? (TODO: needs to be defined)';

COMMENT ON COLUMN accounts.period IS 'period of account: free: 1 month, basic: 1 year, premium: 1 year (TODO: needs to be defined)';

---------------------------------------------
-- users
--
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT public.uuid_generate_v7(),
  email text UNIQUE DEFAULT NULL, -- TODO: email needs to be unique
  person_id uuid DEFAULT NULL,
  account_id uuid DEFAULT NULL REFERENCES accounts(account_id) ON DELETE NO action ON UPDATE NO action,
  auth_id uuid DEFAULT NULL,
  deleted boolean DEFAULT FALSE
);

CREATE INDEX ON users USING btree(user_id);

CREATE INDEX ON users USING btree(email);

CREATE INDEX ON users USING btree(person_id);

CREATE INDEX ON users USING btree(account_id);

CREATE INDEX ON users USING btree(deleted);

COMMENT ON COLUMN users.email IS 'email needs to be unique. project manager can list project user by email before this user creates an own login (thus has no user_id yet)';

---------------------------------------------
-- projects
--
DROP TABLE IF EXISTS projects CASCADE;

CREATE TABLE projects(
  project_id uuid PRIMARY KEY DEFAULT public.uuid_generate_v7(),
  account_id uuid DEFAULT NULL REFERENCES accounts(account_id) ON DELETE NO action ON UPDATE NO action,
  name text DEFAULT NULL,
  type text DEFAULT NULL,
  subproject_name_singular text DEFAULT NULL,
  subproject_name_plural text DEFAULT NULL,
  subproject_orderby text DEFAULT NULL,
  values_on_multiple_levels text DEFAULT NULL,
  multiple_action_values_on_same_level text DEFAULT NULL,
  multiple_check_values_on_same_level text DEFAULT NULL,
  data jsonb DEFAULT NULL,
  deleted boolean DEFAULT FALSE
);

CREATE INDEX ON projects USING btree(project_id);

CREATE INDEX ON projects USING btree(account_id);

CREATE INDEX ON projects USING btree(name);

CREATE INDEX ON projects USING btree(deleted);

COMMENT ON COLUMN projects.type IS '"species" or "biotope", preset: "species"';

COMMENT ON COLUMN projects.subproject_name_singular IS 'Preset: "Art"';

COMMENT ON COLUMN projects.subproject_name_plural IS 'Preset: "Arten"';

COMMENT ON COLUMN projects.values_on_multiple_levels IS 'One of: "use first", "use second", "use all". Preset: "use first"';

COMMENT ON COLUMN projects.multiple_action_values_on_same_level IS 'One of: "use all", "use last". Preset: "use all"';

COMMENT ON COLUMN projects.multiple_check_values_on_same_level IS 'One of: "use all", "use last". Preset: "use last"';

COMMENT ON COLUMN projects.data IS 'Room for project specific data, defined in "fields" table';

---------------------------------------------
-- place_levels
--
DROP TABLE IF EXISTS place_levels CASCADE;

CREATE TABLE place_levels(
  place_level_id uuid PRIMARY KEY DEFAULT public.uuid_generate_v7(),
  project_id uuid DEFAULT NULL REFERENCES projects(project_id) ON DELETE CASCADE ON UPDATE CASCADE,
  level integer DEFAULT NULL,
  name_singular text DEFAULT NULL,
  name_plural text DEFAULT NULL,
  name_short text DEFAULT NULL,
  order_by text DEFAULT NULL,
  reports boolean DEFAULT FALSE,
  report_values boolean DEFAULT FALSE,
  actions boolean DEFAULT FALSE,
  action_values boolean DEFAULT FALSE,
  action_reports boolean DEFAULT FALSE,
  checks boolean DEFAULT FALSE,
  check_values boolean DEFAULT FALSE,
  check_taxons boolean DEFAULT FALSE,
  observation_references boolean DEFAULT FALSE,
  deleted boolean DEFAULT FALSE
);

CREATE INDEX ON place_levels USING btree(place_level_id);

CREATE INDEX ON place_levels USING btree(project_id);

CREATE INDEX ON place_levels USING btree(level);

CREATE INDEX ON place_levels USING btree(name_singular);

CREATE INDEX ON place_levels USING btree(deleted);

COMMENT ON COLUMN place_levels.level IS 'level of place: 1, 2';

COMMENT ON COLUMN place_levels.name_singular IS 'Preset: "Population"';

COMMENT ON COLUMN place_levels.name_plural IS 'Preset: "Populationen"';

COMMENT ON COLUMN place_levels.name_short IS 'Preset: "Pop"';

COMMENT ON COLUMN place_levels.order_by IS 'Name of column to order by. Preset: "name_singular". Alternatives: data.nr';

COMMENT ON COLUMN place_levels.reports IS 'Are reports used? Preset: false';

COMMENT ON COLUMN place_levels.report_values IS 'Are report values used? Preset: false';

COMMENT ON COLUMN place_levels.actions IS 'Are actions used? Preset: false';

COMMENT ON COLUMN place_levels.action_values IS 'Are action values used? Preset: false';

COMMENT ON COLUMN place_levels.action_reports IS 'Are action reports used? Preset: false';

COMMENT ON COLUMN place_levels.checks IS 'Are checks used? Preset: false';

COMMENT ON COLUMN place_levels.check_values IS 'Are check values used? Preset: false';

COMMENT ON COLUMN place_levels.check_taxons IS 'Are check taxons used? Preset: false';

COMMENT ON COLUMN place_levels.observation_references IS 'Are observation references used? Preset: false';

---------------------------------------------
-- subprojects
--
DROP TABLE IF EXISTS subprojects CASCADE;

CREATE TABLE subprojects(
  subproject_id uuid PRIMARY KEY DEFAULT public.uuid_generate_v7(),
  project_id uuid DEFAULT NULL REFERENCES projects(project_id) ON DELETE CASCADE ON UPDATE CASCADE,
  name text DEFAULT NULL,
  since_year integer DEFAULT NULL,
  data jsonb DEFAULT NULL,
  deleted boolean DEFAULT FALSE
);

CREATE INDEX ON subprojects USING btree(subproject_id);

CREATE INDEX ON subprojects USING btree(project_id);

CREATE INDEX ON subprojects USING btree(name);

CREATE INDEX ON subprojects USING btree(since_year);

CREATE INDEX ON subprojects USING gin(data);

CREATE INDEX ON subprojects USING btree(deleted);

COMMENT ON COLUMN subprojects.name IS 'Example: a species name like "Pulsatilla vulgaris"';

COMMENT ON COLUMN subprojects.since_year IS 'Enables analyzing a development since a certain year, like the begin of the project';

COMMENT ON COLUMN subprojects.data IS 'Room for subproject specific data, defined in "fields" table';

