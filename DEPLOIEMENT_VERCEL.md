# Guide de déploiement sur Vercel

## Étape 1 : Réinitialiser la base de données Supabase

### 1.1 Aller dans votre projet Supabase
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet (ou créez-en un nouveau si besoin)

### 1.2 Exécuter le script SQL
1. Cliquez sur **"SQL Editor"** dans le menu de gauche
2. Cliquez sur **"New query"**
3. Copiez-collez tout le contenu du fichier `reset_database.sql`
4. Cliquez sur **"Run"** (ou Ctrl+Enter)
5. Vous devriez voir "Success. No rows returned"

### 1.3 Récupérer vos clés API Supabase
1. Dans le menu de gauche, cliquez sur l'icône **Settings** (roue dentée)
2. Cliquez sur **"API"**
3. Vous verrez deux informations importantes :

   **Project URL :**
   ```
   https://xxxxxxxxxx.supabase.co
   ```

   **anon public (API Key) :**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```

4. **Copiez ces deux valeurs** quelque part, vous en aurez besoin pour Vercel

## Étape 2 : Pousser le code sur GitHub

### 2.1 Initialiser Git (si pas déjà fait)
```bash
git init
git add .
git commit -m "Reset complet de l'application"
```

### 2.2 Créer un repository sur GitHub
1. Allez sur https://github.com
2. Cliquez sur le bouton **"New"** (ou **"+"** en haut à droite → **"New repository"**)
3. Donnez un nom à votre repository (ex: "mon-app")
4. Laissez-le **public** ou **private** selon votre préférence
5. **NE cochez PAS** "Initialize this repository with a README"
6. Cliquez sur **"Create repository"**

### 2.3 Pousser le code
GitHub vous donnera des commandes. Utilisez celles pour un repository existant :
```bash
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git branch -M main
git push -u origin main
```

## Étape 3 : Déployer sur Vercel

### 3.1 Connecter Vercel à GitHub
1. Allez sur https://vercel.com
2. Cliquez sur **"Sign Up"** ou **"Log In"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à vos repositories

### 3.2 Importer votre projet
1. Une fois connecté, cliquez sur **"Add New..."** → **"Project"**
2. Trouvez votre repository dans la liste
3. Cliquez sur **"Import"**

### 3.3 Configurer les variables d'environnement
**IMPORTANT :** Avant de déployer, vous devez ajouter vos clés Supabase !

1. Dans la section **"Environment Variables"**, ajoutez :

   **Première variable :**
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://xxxxxxxxxx.supabase.co` (votre Project URL de l'étape 1.3)

   **Deuxième variable :**
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (votre anon public key de l'étape 1.3)

2. Cliquez sur **"Deploy"**

### 3.4 Attendre le déploiement
- Vercel va construire et déployer votre application (environ 1-2 minutes)
- Une fois terminé, vous verrez "Congratulations!" avec un lien vers votre site

## Étape 4 : Tester votre application

1. Cliquez sur le lien de votre site (ex: `https://votre-app.vercel.app`)
2. Vous devriez être redirigé vers `/auth/login`
3. Cliquez sur **"S'inscrire"**
4. Créez un compte avec :
   - Un pseudo
   - Un email
   - Un mot de passe (min 6 caractères)
5. Connectez-vous avec vos identifiants
6. Vous devriez voir **"Bienvenue {votre_pseudo}"**
7. **Testez le F5** → vous restez connecté ✅
8. Testez la déconnexion

## Étape 5 : Mises à jour futures

Pour mettre à jour votre application :

```bash
git add .
git commit -m "Description de vos changements"
git push
```

Vercel va automatiquement re-déployer votre application !

## Résolution de problèmes

### Erreur "Failed to load data"
- Vérifiez que vous avez bien exécuté le script SQL dans Supabase
- Vérifiez que les variables d'environnement sont bien configurées dans Vercel

### Erreur de connexion
- Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont corrects
- Allez dans Settings → Environment Variables sur Vercel pour vérifier

### Page blanche
- Allez dans l'onglet "Deployments" sur Vercel
- Cliquez sur le dernier déploiement
- Vérifiez les logs pour voir l'erreur

### Besoin de re-configurer les variables d'environnement
1. Allez sur https://vercel.com
2. Sélectionnez votre projet
3. Cliquez sur **"Settings"** → **"Environment Variables"**
4. Modifiez ou ajoutez les variables
5. Allez dans **"Deployments"**
6. Cliquez sur les **"..."** du dernier déploiement → **"Redeploy"**

## Configuration Supabase supplémentaire (si besoin)

### Désactiver la confirmation d'email (pour les tests)
1. Dans Supabase, allez dans **Authentication** → **Settings**
2. Décochez **"Enable email confirmations"**
3. Cela permet de créer des comptes sans avoir à confirmer l'email

### Configurer l'URL de redirection
1. Dans Supabase, allez dans **Authentication** → **URL Configuration**
2. Ajoutez votre URL Vercel dans **"Site URL"** : `https://votre-app.vercel.app`
3. Ajoutez aussi dans **"Redirect URLs"** : `https://votre-app.vercel.app/**`

---

**C'est tout ! Votre application est maintenant en ligne et fonctionnelle !** 🎉
