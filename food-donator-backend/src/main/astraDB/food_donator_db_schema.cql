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
   description text
);

CREATE INDEX IF NOT EXISTS ON main_keyspace.user(phone_num);
CREATE INDEX IF NOT EXISTS ON main_keyspace.user(type);
CREATE INDEX IF NOT EXISTS ON main_keyspace.donation(userId);