CREATE TABLE IF NOT EXISTS main_keyspace.user (
  id text PRIMARY KEY,
  name text,
  phone_num text,
  address text,
  lat double,
  lon double,
  type text,
  password text,
  salt text
);

CREATE TABLE IF NOT EXISTS main_keyspace.donation (
  id text PRIMARY KEY,
  userId text,
  donationDate bigint,
  startTime time,
  endTime time,
  description text,
  reserved boolean,
  recipients set<text>
);

CREATE TABLE IF NOT EXISTS main_keyspace.tags (
  id uuid PRIMARY KEY,
  name text
);

CREATE TABLE IF NOT EXISTS main_keyspace.usertags (
  tagID uuid,
  donationID text,
  PRIMARY KEY (tagID, donationID)
);

INSERT INTO main_keyspace.tags (id, name) VALUES (uuid(), 'Canned Food');
INSERT INTO main_keyspace.tags (id, name) VALUES (uuid(), 'Grains');
INSERT INTO main_keyspace.tags (id, name) VALUES (uuid(), 'Long Life Milk');
INSERT INTO main_keyspace.tags (id, name) VALUES (uuid(), 'Blankets');
INSERT INTO main_keyspace.tags (id, name) VALUES (uuid(), 'Clothes');
INSERT INTO main_keyspace.tags (id, name) VALUES (uuid(), 'Toiletries');
INSERT INTO main_keyspace.tags (id, name) VALUES (uuid(), 'Dried Fruit');
INSERT INTO main_keyspace.tags (id, name) VALUES (uuid(), 'Other');


CREATE INDEX IF NOT EXISTS ON main_keyspace.user(phone_num);
CREATE INDEX IF NOT EXISTS ON main_keyspace.user(type);
CREATE INDEX IF NOT EXISTS ON main_keyspace.donation(userId);
CREATE INDEX IF NOT EXISTS ON main_keyspace.usertags(donationID);