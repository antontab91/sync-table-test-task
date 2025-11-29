CREATE TABLE IF NOT EXISTS creatives (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    status          TEXT NOT NULL,
    owner           TEXT NOT NULL,
    channel         TEXT NOT NULL,
    campaign        TEXT NOT NULL,
    budget          NUMERIC(12,2) NOT NULL,
    impressions     INTEGER NOT NULL,
    clicks          INTEGER NOT NULL,
    ctr             NUMERIC(5,2) NOT NULL,
    conversions     INTEGER NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
