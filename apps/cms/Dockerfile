FROM node:20-alpine
WORKDIR /app
COPY apps/cms/package*.json ./
RUN npm install
COPY apps/cms ./
EXPOSE 1337
CMD ["npm", "run", "develop"]
