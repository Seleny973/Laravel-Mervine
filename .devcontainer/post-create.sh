#!/usr/bin/env bash
set -e

ROOT_DIR="$(pwd)"

echo "==> Setup Laravel (Cerces) avec SQLite"

cd "$ROOT_DIR/Cerces"

# Créer .env à partir de .env.example si nécessaire
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  cp .env.example .env
fi

composer install

# Générer la clé d'application si elle n'existe pas
if ! grep -q "^APP_KEY=base64:" .env 2>/dev/null; then
  php artisan key:generate
fi

# Créer la base SQLite si elle n'existe pas
if [ ! -f "database/database.sqlite" ]; then
  mkdir -p database
  touch database/database.sqlite
fi

php artisan migrate --seed

echo "==> Setup Angular (webangular/Anaxa)"

cd "$ROOT_DIR/webangular/Anaxa"
npm install

echo "==> Setup terminé. Pour lancer les serveurs :"
echo "   - API Laravel : cd Cerces && php artisan serve --host=0.0.0.0 --port=8000"
echo "   - Angular     : cd webangular/Anaxa && npm start -- --host 0.0.0.0 --port 4200"


