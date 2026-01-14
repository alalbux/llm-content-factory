-- 002_pgvector.sql
-- Vector search support

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS kb_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL,
  source_id INTEGER NOT NULL,
  chunk TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kb_embeddings_vector
  ON kb_embeddings USING ivfflat (embedding vector_cosine_ops);
