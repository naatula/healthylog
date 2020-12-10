## Database setup

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL UNIQUE,
  password CHAR(60) NOT NULL
);

CREATE TABLE morning_reports (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  sleep_duration NUMERIC(6,2) NOT NULL,
  sleep_quality SMALLINT NOT NULL,
  mood SMALLINT NOT NULL
);

CREATE TABLE evening_reports (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  exercise NUMERIC(6,2) NOT NULL,
  studying NUMERIC(6,2) NOT NULL,
  eating SMALLINT NOT NULL,
  mood SMALLINT NOT NULL
);

CREATE INDEX users_email_index ON users (email);

CREATE INDEX morning_reports_user_id_index ON morning_reports (user_id);

CREATE INDEX evening_reports_user_id_index ON evening_reports (user_id);

CREATE INDEX morning_reports_date_index ON morning_reports (date);

CREATE INDEX evening_reports_date_index ON evening_reports (date);
```
