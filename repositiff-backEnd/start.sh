#!/bin/bash

echo "🔧 Subindo containers..."
docker-compose up -d


until docker exec postgress_container_repoIFF pg_isready -U postUser; do
  sleep 1
  echo "⏳ Esperando o banco aceitar conexões..."
done

echo "🚀 Rodando migrações do Prisma..."
npx prisma migrate deploy

echo "🔥 Iniciando servidor..."
npx tsx watch --env-file .env src/server.ts

