## Database setup

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password CHAR(60) NOT NULL
);

CREATE TABLE morning_reports (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  sleep_duration NUMERIC(6,2) NOT NULL,
  sleep_quality SMALLINT NOT NULL
);

CREATE TABLE evening_reports (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  exercise INT NOT NULL,
  studying NUMERIC(6,2) NOT NULL,
  eating SMALLINT NOT NULL,
  mood SMALLINT NOT NULL
);
