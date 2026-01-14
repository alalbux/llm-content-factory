-- 003_metrics.sql
-- Feedback loop para aprendizado

CREATE TABLE IF NOT EXISTS generation_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_version_id INTEGER NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  decision TEXT CHECK (decision IN ('approve','needs_review')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_version
  ON generation_feedback(content_version_id);
