FROM node:20-alpine
WORKDIR /app
COPY apps/worker/package*.json ./
RUN npm install
COPY apps/worker ./
CMD ["npm", "run", "dev"]
