# Guide d'installation des dépendances

## ✅ Dépendances Angular installées

Les dépendances npm pour le projet Angular ont été installées avec succès.

## ⚠️ Dépendances Laravel à installer

Pour installer les dépendances Laravel, vous devez avoir **PHP** et **Composer** installés sur votre système.

### Vérification de l'installation

1. **Vérifier PHP** :
   ```powershell
   php -v
   ```
   Si PHP n'est pas reconnu, vous devez l'installer ou l'ajouter au PATH.

2. **Vérifier Composer** :
   ```powershell
   composer --version
   ```
   Si Composer n'est pas reconnu, vous devez l'installer ou l'ajouter au PATH.

### Installation de PHP et Composer

#### Option 1 : Utiliser XAMPP ou Laragon
- Téléchargez et installez [XAMPP](https://www.apachefriends.org/) ou [Laragon](https://laragon.org/)
- Ces outils incluent PHP et facilitent l'installation de Composer

#### Option 2 : Installer PHP manuellement
1. Téléchargez PHP depuis [php.net](https://www.php.net/downloads.php)
2. Extrayez-le dans un dossier (ex: `C:\php`)
3. Ajoutez le chemin au PATH système
4. Installez Composer depuis [getcomposer.org](https://getcomposer.org/download/)

### Installation des dépendances Laravel

Une fois PHP et Composer installés, exécutez dans le dossier `Cerces` :

```powershell
cd Cerces
composer install
```

### Configuration supplémentaire

Après l'installation de Composer, vous devrez également :

1. **Créer le fichier .env** :
   ```powershell
   copy .env.example .env
   ```
   (Si le fichier .env.example n'existe pas, créez un fichier .env avec les paramètres de base)

2. **Générer la clé d'application** :
   ```powershell
   php artisan key:generate
   ```

3. **Configurer la base de données** :
   - Pour SQLite : `touch database/database.sqlite`
   - Pour MySQL : Configurez les paramètres dans le fichier .env

4. **Exécuter les migrations** :
   ```powershell
   php artisan migrate
   ```

5. **Remplir la base de données avec des données de test** :
   ```powershell
   php artisan db:seed
   ```

## Résumé

- ✅ **Angular** : Dépendances installées
- ⚠️ **Laravel** : Nécessite PHP et Composer pour installer les dépendances

Une fois PHP et Composer installés, exécutez `composer install` dans le dossier `Cerces`.


