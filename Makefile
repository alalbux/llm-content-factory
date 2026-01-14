# ===========================
# Project: LLM Content Factory
# ===========================

# Detect OS
UNAME_S := $(shell uname -s)

# Paths
INFRA_DIR=infra/docker
MIGRATIONS_DIR=infra/migrations

# Docker compose
DC=docker compose
ENV_FILE=$(INFRA_DIR)/.env

# Colors (optional, but nice)
GREEN=\033[0;32m
YELLOW=\033[0;33m
RED=\033[0;31m
NC=\033[0m

.DEFAULT_GOAL := help

# ===========================
# Help
# ===========================
help:
	@echo ""
	@echo "🧠 LLM Content Factory — Makefile"
	@echo ""
	@echo "Infra:"
	@echo "  make infra-up        Start all containers"
	@echo "  make infra-down      Stop all containers"
	@echo "  make infra-restart   Restart containers"
	@echo "  make infra-logs      Tail logs"
	@echo ""
	@echo "Database:"
	@echo "  make migrate         Run database migrations"
	@echo ""
	@echo "Apps:"
	@echo "  make web             Run apps/web locally"
	@echo "  make worker          Run apps/worker locally"
	@echo "  make cms             Run apps/cms locally"
	@echo ""
	@echo "All:"
	@echo "  make dev             Full local dev (infra + migrate)"
	@echo "  make reset           Nuke containers + volumes"
	@echo ""

# ===========================
# Infra (Docker)
# ===========================
infra-up:
	@echo "$(GREEN)▶ Starting infrastructure$(NC)"
	cd $(INFRA_DIR) && $(DC) --env-file .env up -d --build

infra-down:
	@echo "$(YELLOW)■ Stopping infrastructure$(NC)"
	cd $(INFRA_DIR) && $(DC) down

infra-restart:
	@echo "$(GREEN)↻ Restarting infrastructure$(NC)"
	cd $(INFRA_DIR) && $(DC) down && $(DC) --env-file .env up -d

infra-logs:
	cd $(INFRA_DIR) && $(DC) logs -f --tail=100

reset:
	@echo "$(RED)⚠ Removing containers, networks and volumes$(NC)"
	cd $(INFRA_DIR) && $(DC) down -v --remove-orphans

# ===========================
# Database / Migrations
# ===========================
migrate:
	@echo "$(GREEN)▶ Running migrations$(NC)"
	@if [ -z "$$DATABASE_URL" ]; then \
		echo "$(RED)❌ DATABASE_URL not set$(NC)"; \
		exit 1; \
	fi
	cd $(MIGRATIONS_DIR) && ./migrate.sh

# ===========================
# Apps (Local, no Docker)
# ===========================
web:
	@echo "$(GREEN)▶ Running apps/web$(NC)"
	cd apps/web && npm run dev

worker:
	@echo "$(GREEN)▶ Running apps/worker$(NC)"
	cd apps/worker && npm run dev

cms:
	@echo "$(GREEN)▶ Running apps/cms$(NC)"
	cd apps/cms && npm run develop

# ===========================
# High-level flows
# ===========================
dev: infra-up migrate
	@echo ""
	@echo "$(GREEN)✅ Dev environment ready$(NC)"
	@echo ""
	@echo "URLs:"
	@echo "  Web:     http://localhost:3000/admin"
	@echo "  Strapi:  http://localhost:1337/admin"
	@echo ""

