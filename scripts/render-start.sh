#!/usr/bin/env bash
set -e

echo ">> Render: running database migrations"
npx prisma migrate deploy

echo ">> Render: seeding database"
npx prisma db seed

echo ">> Render: starting Next.js"
exec npm start
