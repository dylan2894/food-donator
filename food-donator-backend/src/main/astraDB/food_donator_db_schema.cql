CREATE TABLE IF NOT EXISTS main_keyspace.user (
   id text PRIMARY KEY,
   name text,
   phone_num text,
   lat double,
   lon double,
   type text,
   password text,
   salt text
);

CREATE TABLE IF NOT EXISTS donation (
   id text PRIMARY KEY,
   userId text,
   donationDate bigint,
   startTime time,
   endTime time
);

CREATE INDEX IF NOT EXISTS ON main_keyspace.user(phone_num);
CREATE INDEX IF NOT EXISTS ON main_keyspace.user(type);
CREATE INDEX IF NOT EXISTS ON main_keyspace.donation(userId);

INSERT INTO main_keyspace.donation (id, userId, donationDate, startTime, endTime) VALUES ('someDonationId', 'f9f60df3-2e15-4b9d-9501-bf02a1537c07', 738945, '17:00:00', '19:00:00');