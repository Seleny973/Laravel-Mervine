# Configuration API Laravel pour le projet Angular

## Vue d'ensemble

Ce projet contient une API Laravel qui remplace l'API FakeStore utilisée par le projet Angular `webangular`.

## Structure du projet

- `Cerces/` : Projet Laravel avec l'API
- `webangular/` : Projet Angular qui consomme l'API

## Configuration

### 1. Configuration Laravel (Port 8000)

#### Installation des dépendances
```bash
cd Cerces
composer install
```

#### Configuration de la base de données

Créez un fichier `.env` à la racine du dossier `Cerces` avec la configuration suivante :

```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
# ou pour MySQL :
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=

CORS_ALLOWED_ORIGINS=http://localhost:4200,http://127.0.0.1:4200
```

#### Génération de la clé d'application
```bash
php artisan key:generate
```

#### Création de la base de données SQLite (si vous utilisez SQLite)
```bash
touch database/database.sqlite
```

#### Exécution des migrations
```bash
php artisan migrate
```

#### Exécution des seeders (pour créer des produits de test)
```bash
php artisan db:seed
```

#### Démarrage du serveur Laravel
```bash
php artisan serve
```

Le serveur Laravel sera accessible sur **http://localhost:8000**

### 2. Configuration Angular (Port 4200)

#### Installation des dépendances
```bash
cd webangular/Anaxa
npm install
```

#### Démarrage du serveur Angular
```bash
npm start
# ou
ng serve
```

Le serveur Angular sera accessible sur **http://localhost:4200**

## Endpoints API disponibles

L'API Laravel expose les endpoints suivants (préfixe `/api`) :

### Authentification
- `POST /api/auth/login` - Connexion d'un utilisateur
  - Body: `{ "username": "string", "password": "string" }`
  - Retourne: `{ "token": "string", "user": {...} }`

- `POST /api/users` - Inscription d'un nouvel utilisateur
  - Body: `{ "username": "string", "email": "string", "password": "string" }`
  - Retourne: `{ "id": number, "username": "string", "email": "string", "token": "string" }`

### Utilisateurs
- `GET /api/users` - Récupérer tous les utilisateurs
  - Retourne: `[{ "id": number, "username": "string", "email": "string", ... }]`

### Produits
- `GET /api/products` - Récupérer tous les produits
  - Retourne: `[{ "id": number, "title": "string", "price": number, ... }]`

- `DELETE /api/products/{id}` - Supprimer un produit
  - Retourne: `{ "message": "Product deleted successfully" }`

## Configuration CORS

Le CORS est configuré pour accepter les requêtes depuis :
- `http://localhost:4200`
- `http://127.0.0.1:4200`

Si vous utilisez un autre port pour Angular, modifiez le fichier `Cerces/config/cors.php`.

## Notes importantes sur les ports

- **Laravel** : Port **8000** par défaut (configurable avec `php artisan serve --port=XXXX`)
- **Angular** : Port **4200** par défaut (configurable avec `ng serve --port=XXXX`)

Si vous avez des problèmes de port :
1. Vérifiez que le port 8000 n'est pas déjà utilisé pour Laravel
2. Vérifiez que le port 4200 n'est pas déjà utilisé pour Angular
3. Si nécessaire, modifiez les ports et mettez à jour `environment.ts` dans Angular

## Tests

Pour tester l'API, vous pouvez utiliser :

1. **Postman** ou **Insomnia**
2. **curl** :
   ```bash
   # Tester la récupération des produits
   curl http://localhost:8000/api/products
   
   # Tester la connexion
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"test","password":"password"}'
   ```

## Structure de la base de données

### Table `users`
- `id` (bigint)
- `name` (string)
- `username` (string, unique)
- `email` (string, unique)
- `password` (string, hashed)
- `created_at`, `updated_at`

### Table `products`
- `id` (bigint)
- `title` (string)
- `price` (decimal)
- `description` (text)
- `category` (string)
- `image` (string)
- `rating` (json)
- `created_at`, `updated_at`

