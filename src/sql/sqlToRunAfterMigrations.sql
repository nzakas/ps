CREATE INDEX ON users((1))
WHERE
  deleted;

CREATE INDEX ON projects((1))
WHERE
  deleted;

CREATE INDEX ON place_levels((1))
WHERE
  deleted;

CREATE INDEX ON subprojects((1))
WHERE
  deleted;

CREATE INDEX ON project_users((1))
WHERE
  deleted;

CREATE INDEX ON subproject_users((1))
WHERE
  deleted;

CREATE INDEX ON taxonomies((1))
WHERE
  obsolete;

CREATE INDEX ON taxonomies((1))
WHERE
  deleted;

CREATE INDEX ON taxa((1))
WHERE
  obsolete;

CREATE INDEX ON taxa((1))
WHERE
  deleted;

CREATE INDEX ON subproject_taxa((1))
WHERE
  deleted;

CREATE INDEX ON lists((1))
WHERE
  obsolete;

CREATE INDEX ON lists((1))
WHERE
  deleted;

CREATE INDEX ON list_values((1))
WHERE
  obsolete;

CREATE INDEX ON list_values((1))
WHERE
  deleted;

CREATE INDEX ON units((1))
WHERE
  deleted;

CREATE INDEX ON places((1))
WHERE
  deleted;

CREATE INDEX ON actions((1))
WHERE
  relevant_for_reports;

CREATE INDEX ON actions((1))
WHERE
  deleted;

CREATE INDEX ON action_values((1))
WHERE
  deleted;

CREATE INDEX ON action_reports((1))
WHERE
  deleted;

CREATE INDEX ON action_report_values((1))
WHERE
  deleted;

CREATE INDEX ON checks((1))
WHERE
  relevant_for_reports;

CREATE INDEX ON checks((1))
WHERE
  deleted;

CREATE INDEX ON check_values((1))
WHERE
  deleted;

