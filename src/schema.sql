CREATE TABLE IF NOT EXISTS se_users (
 id UUID PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
 password_hash TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS se_sessions (
 token_hash TEXT PRIMARY KEY, user_id UUID NOT NULL REFERENCES se_users(id) ON DELETE CASCADE,
 csrf_token TEXT NOT NULL, expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS se_sessions_user ON se_sessions(user_id);
CREATE TABLE IF NOT EXISTS se_auth_limits (
 key TEXT PRIMARY KEY, attempts INTEGER NOT NULL, expires_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS se_wallets (
 user_id UUID PRIMARY KEY REFERENCES se_users(id), currency TEXT NOT NULL DEFAULT 'CAD' CHECK(currency='CAD'),
 balance_cents BIGINT NOT NULL DEFAULT 0 CHECK(balance_cents>=0)
);
CREATE TABLE IF NOT EXISTS se_ledger (
 id UUID PRIMARY KEY, user_id UUID NOT NULL REFERENCES se_wallets(user_id),
 amount_cents BIGINT NOT NULL CHECK(amount_cents<>0), currency TEXT NOT NULL CHECK(currency='CAD'),
 kind TEXT NOT NULL CHECK(kind IN ('funding','purchase','refund','chargeback')),
 reference TEXT NOT NULL UNIQUE, description TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS se_ledger_user ON se_ledger(user_id,created_at DESC);
CREATE OR REPLACE FUNCTION se_ledger_append_only() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'Ledger entries are append-only'; END;
$$;
DROP TRIGGER IF EXISTS se_ledger_no_mutation ON se_ledger;
CREATE TRIGGER se_ledger_no_mutation BEFORE UPDATE OR DELETE ON se_ledger
FOR EACH ROW EXECUTE FUNCTION se_ledger_append_only();
CREATE TABLE IF NOT EXISTS se_orders (
 id UUID PRIMARY KEY, user_id UUID NOT NULL REFERENCES se_users(id), service_name TEXT NOT NULL,
 quantity INTEGER NOT NULL CHECK(quantity>0), total_cents BIGINT NOT NULL CHECK(total_cents>0),
 currency TEXT NOT NULL DEFAULT 'CAD' CHECK(currency='CAD'), status TEXT NOT NULL
 CHECK(status IN ('pending','processing','completed','partial','failed','refunded')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS se_orders_user ON se_orders(user_id,created_at DESC);
CREATE TABLE IF NOT EXISTS se_order_events (
 id UUID PRIMARY KEY, order_id UUID NOT NULL REFERENCES se_orders(id), status TEXT NOT NULL,
 message TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS se_tickets (
 id UUID PRIMARY KEY, user_id UUID NOT NULL REFERENCES se_users(id), subject TEXT NOT NULL,
 message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','closed')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
