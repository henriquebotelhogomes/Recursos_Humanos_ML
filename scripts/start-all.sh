#!/usr/bin/env sh
set -e

echo ">> Starting FastAPI inference on :8000"
python -m uvicorn analysis.inference.main:app --host 0.0.0.0 --port 8000 &
INFERENCE_PID=$!

echo ">> Running Prisma migrations and seed"
npx prisma migrate deploy
npx prisma db seed

echo ">> Starting Next.js on :3000"
node server.js &
NEXT_PID=$!

trap 'kill $INFERENCE_PID $NEXT_PID' INT TERM
wait $INFERENCE_PID $NEXT_PID
