# Instructions de réinitialisation et utilisation

## Étape 1 : Réinitialiser la base de données Supabase

1. Allez sur votre projet Supabase : https://supabase.com/dashboard
2. Cliquez sur "SQL Editor" dans le menu de gauche
3. Créez une nouvelle requête
4. Copiez-collez tout le contenu du fichier `reset_database.sql`
5. Exécutez la requête (bouton "Run" ou Ctrl+Enter)
6. Vous devriez voir un message de succès

## Étape 2 : Vérifier les variables d'environnement

Assurez-vous d'avoir un fichier `.env.local` à la racine du projet avec vos clés Supabase :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
```

Vous pouvez trouver ces informations dans :
Supabase Dashboard → Settings → API

## Étape 3 : Installer les dépendances et lancer l'application

```bash
npm install
npm run dev
```

L'application sera accessible sur http://localhost:3000

## Fonctionnalités de l'application

### Page d'inscription (`/auth/sign-up`)
- Créer un nouveau compte avec :
  - Pseudo
  - Email
  - Mot de passe (minimum 6 caractères)

### Page de connexion (`/auth/login`)
- Se connecter avec email et mot de passe
- Redirection automatique vers la page d'accueil après connexion

### Page d'accueil (`/`)
- Affiche "Bienvenue {pseudo}" une fois connecté
- Bouton de déconnexion
- Si vous n'êtes pas connecté, redirection automatique vers `/auth/login`
- **La session persiste** : F5 ne vous déconnecte pas !

## Architecture de la base de données

### Table `profiles`
- `id` : UUID (référence à auth.users)
- `email` : Email de l'utilisateur
- `username` : Pseudo de l'utilisateur
- `created_at` : Date de création
- `updated_at` : Date de dernière modification

### Triggers automatiques
- Création automatique du profil lors de l'inscription
- Mise à jour automatique de `updated_at`

### Row Level Security (RLS)
- Tout le monde peut lire les profils
- Seul l'utilisateur peut créer et modifier son propre profil

## Gestion de la session

La session est gérée par Supabase Auth avec des cookies sécurisés :
- Persistance automatique (F5 safe)
- Cookies HttpOnly et Secure
- Durée de vie : 1 an (configurable)

## Structure simplifiée

Le code a été simplifié pour ne garder que l'essentiel :
- Pas de navbar ni footer
- Uniquement 3 pages : login, inscription, accueil
- Interface simple et épurée
- Pas de rôles ni de profils complexes

## Problèmes courants

### La session ne persiste pas
- Vérifiez que vos cookies ne sont pas bloqués
- Vérifiez que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont bien configurés

### Erreur lors de l'inscription
- Vérifiez que l'email n'existe pas déjà
- Vérifiez que le mot de passe fait au moins 6 caractères
- Vérifiez que le script SQL a bien été exécuté

### Erreur "profiles table does not exist"
- Exécutez à nouveau le script SQL `reset_database.sql`
