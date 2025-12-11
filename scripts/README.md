# Scripts SQL pour Prest'Event

Ce dossier contient les scripts SQL pour configurer et maintenir la base de données Supabase.

## Liste des scripts

### 002_add_images_featured.sql
- Ajoute la colonne `images` à la table `annonces`
- Ajoute la colonne `featured` aux tables `annonces` et `profiles`
- Ajoute la colonne `is_admin` à la table `profiles`

### 003_create_admin_user.sql
- Script pour créer un utilisateur administrateur
- À exécuter après avoir créé un compte utilisateur

### 004_fix_featured_rls.sql
- **NOUVEAU** - Corrige les politiques RLS pour la colonne `featured`
- Permet aux administrateurs de mettre à jour le statut de mise en vedette des prestataires
- **Important** : Ce script doit être exécuté via le SQL Editor de Supabase

## Comment appliquer les scripts

1. Connectez-vous à votre projet Supabase
2. Allez dans l'onglet "SQL Editor"
3. Copiez le contenu du script souhaité
4. Cliquez sur "Run" pour exécuter le script

## Ordre d'exécution

Les scripts doivent être exécutés dans l'ordre numérique :
1. `002_add_images_featured.sql`
2. `003_create_admin_user.sql`
3. `004_fix_featured_rls.sql` ← **NOUVEAU - À exécuter maintenant**

## Problème résolu par le script 004

Le script `004_fix_featured_rls.sql` résout un problème où les administrateurs ne pouvaient pas mettre à jour le statut de mise en vedette (`featured`) des prestataires dans le panneau d'administration.

**Symptômes** :
- La mise en vedette des annonces fonctionne correctement
- La mise en vedette des prestataires ne s'enregistre pas en base de données
- Aucune erreur visible côté client

**Cause** :
Les politiques RLS (Row Level Security) de Supabase n'autorisaient pas les admins à mettre à jour la colonne `featured` de la table `profiles`.

**Solution** :
Création d'une politique RLS spécifique permettant aux utilisateurs avec `is_admin = true` de mettre à jour n'importe quel profil.
