#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "❌ DATABASE_URL not set"
  exit 1
fi

echo "▶ Running migrations..."

psql "$DATABASE_URL" <<'SQL'
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMP NOT NULL DEFAULT now()
);
SQL

for file in *.sql; do
  version=$(basename "$file")
  applied=$(psql "$DATABASE_URL" -tAc \
    "SELECT 1 FROM schema_migrations WHERE version='$version'")

  if [[ "$applied" == "1" ]]; then
    echo "✓ $version already applied"
  else
    echo "→ Applying $version"
    psql "$DATABASE_URL" -f "$file"
    psql "$DATABASE_URL" -c \
      "INSERT INTO schema_migrations(version) VALUES ('$version')"
  fi
done

echo "✅ All migrations applied"