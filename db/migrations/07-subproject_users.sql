CREATE TABLE subproject_users(
  subproject_user_id uuid PRIMARY KEY DEFAULT NULL, -- public.uuid_generate_v7(),
  account_id uuid DEFAULT NULL REFERENCES accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE,
  subproject_id uuid DEFAULT NULL REFERENCES subprojects(subproject_id) ON DELETE CASCADE ON UPDATE CASCADE,
  user_id uuid DEFAULT NULL REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  role text DEFAULT NULL,
  label text DEFAULT NULL,
  deleted boolean DEFAULT NULL -- FALSE
);

-- CREATE INDEX ON subproject_users USING btree(subproject_user_id);
CREATE INDEX ON subproject_users USING btree(account_id);

CREATE INDEX ON subproject_users USING btree(subproject_id);

CREATE INDEX ON subproject_users USING btree(user_id);

CREATE INDEX ON subproject_users USING btree(label);

COMMENT ON COLUMN subproject_users.account_id IS 'redundant account_id enhances data safety';

COMMENT ON COLUMN subproject_users.role IS 'TODO: One of: "manager", "editor", "reader". Preset: "reader"';

COMMENT ON TABLE subproject_users IS 'A way to give users access to subprojects (without giving them access to the whole project). TODO: define what data from the project the user can see.';

ALTER TABLE subproject_users ENABLE electric;

