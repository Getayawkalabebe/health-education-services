CREATE TABLE IF NOT EXISTS stripe_events (id TEXT PRIMARY KEY, type TEXT NOT NULL, received_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS orders (session_id TEXT PRIMARY KEY, kind TEXT NOT NULL CHECK(kind IN ('order','donation')), amount INTEGER NOT NULL, currency TEXT NOT NULL, payment_status TEXT NOT NULL, fulfillment_status TEXT NOT NULL DEFAULT 'awaiting_review', items JSONB NOT NULL DEFAULT '[]', created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS request_limits (key TEXT PRIMARY KEY, window_id BIGINT NOT NULL, hits INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS booking_requests (key TEXT PRIMARY KEY, payload_hash TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'pending', result JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());

