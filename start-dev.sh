#!/usr/bin/env sh
set -e
cd "$(dirname "$0")"
if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi
echo "Starting the React frontend and Node.js backend..."
npm run dev
