Subir tudo
docker compose up --build

URLs

Web (Next): http://localhost:3000/admin

Strapi Admin: http://localhost:1337/admin

Redis: localhost:6379

Postgres: localhost:5432

Primeiro acesso Strapi

Crie o usuário admin no /admin

Crie um API Token (Settings → API Tokens)

Coloque o token em infra/docker/.env como STRAPI_TOKEN

docker compose restart web worker


---

## 4) Falta 1 coisa: Dockerfiles dos apps

O compose acima assume que existem:

- `apps/web/Dockerfile`
- `apps/worker/Dockerfile`
- `apps/cms/Dockerfile`

Se você ainda não tem, aqui vão versões simples.

### `apps/web/Dockerfile`
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY apps/web/package*.json ./
RUN npm install
COPY apps/web ./
EXPOSE 3000
CMD ["npm", "run", "dev"]