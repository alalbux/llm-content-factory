-- 001_init.sql
-- Base schema (app-level, não Strapi tables)

CREATE TABLE IF NOT EXISTS campaigns_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id INTEGER NOT NULL,
  cost_usd NUMERIC(10,4) DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_version_id INTEGER NOT NULL,
  channel TEXT NOT NULL,
  metric TEXT NOT NULL,
  value NUMERIC,
  collected_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_metrics_content
  ON content_metrics(content_version_id);
