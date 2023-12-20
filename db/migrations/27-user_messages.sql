CREATE TABLE user_messages(
  user_message_id uuid PRIMARY KEY DEFAULT NULL, -- public.uuid_generate_v7(),
  user_id uuid DEFAULT NULL REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  message_id uuid DEFAULT NULL REFERENCES messages(message_id) ON DELETE CASCADE ON UPDATE CASCADE,
  read boolean DEFAULT NULL -- FALSE
);

-- CREATE INDEX ON user_messages USING btree(user_message_id);
CREATE INDEX ON user_messages USING btree(user_id);

CREATE INDEX ON user_messages USING btree(message_id);

ALTER TABLE user_messages ENABLE electric;

