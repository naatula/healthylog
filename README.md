# Healthylog

A running instance can be found at https://healthylog.herokuapp.com

## Setup

### Requirements

- Deno
- PostgreSQL

### Database

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL UNIQUE,
  password CHAR(60) NOT NULL
);

CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  type SMALLINT NOT NULL,
  sleep_duration NUMERIC(6,2),
  sleep_quality SMALLINT,
  mood SMALLINT,
  exercise NUMERIC(6,2),
  studying NUMERIC(6,2),
  eating SMALLINT
);

CREATE INDEX users_email_index ON users (email);

CREATE INDEX reports_date_user_id_index ON reports (date, user_id);
```

## Running

```
deno run --allow-net --allow-env --allow-read --unstable app.js
```

Pass your database configuration in environment variables `PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` and `PGPORT`. You can use the following example:

```
PGHOST="" PGDATABASE="" PGUSER="" PGPASSWORD="" PGPORT=5432 deno run --allow-net --allow-env --allow-read --unstable app.js
```

Alternatively, you can fill in your database configuration to `config/config.js`

You can use a custom port instead of the default 7777 by giving the desired port number as the last parameter

## Testing

```
deno test --allow-all --unstable
```
Pass database configuration in environmental variables `PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` and `PGPORT`. If you don't have them set by your environment, see the example in section *Running* on how to include them in the command.

**Make sure not to use a production database for testing!**

## Notes
- Static files are accessible to everyone to serve styles etc.
- `/api/summary` serves a summary based on the last 7 days (ambiguous guidelines)
- The landing page lacks a link to reporting functionality because you are required to log in first
- The landing page tells that things are looking bright if mood of yesterday and today are equal. I like positivity
- The week and month selectors seem to work properly only on Chromium-based browsers. The checklist instructed to use them, though
- ¯\\_(ツ)_/¯

## Todo
- On reporting page, fetch old values for custom dates and tell the user if a report on that specific day already exists
- Ability to change email and password
