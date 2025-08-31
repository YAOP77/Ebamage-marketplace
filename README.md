# Ebamage Marketplace

## Description
Ebamage Marketplace est une application backend qui gère les fonctionnalités essentielles d'une plateforme de commerce électronique. Elle inclut des fonctionnalités telles que l'inscription, la connexion, la gestion des tokens OTP, et la gestion des tokens de périphérique.

## Fonctionnalités Implémentées

### Authentification
- **Inscription d'utilisateur** :
  - Permet aux utilisateurs de s'inscrire avec leur nom, email, téléphone, mot de passe, et type d'utilisateur (client ou boutique).
  - Génération d'un OTP pour la vérification de l'email.

- **Connexion d'utilisateur** :
  - Authentification via email et mot de passe.
  - Vérification que le compte est validé avant d'autoriser la connexion.

- **Renvoi d'OTP** :
  - Permet de générer et renvoyer un nouveau code OTP si l'utilisateur n'a pas validé son compte.

- **Vérification OTP** :
  - Permet de vérifier un compte utilisateur en validant le code OTP envoyé par email.

### Gestion des Tokens de Périphérique
- **Mise à jour du Device Token** :
  - Permet de mettre à jour ou d'ajouter un token de périphérique pour un utilisateur connecté.

- **Suppression du Device Token** :
  - Permet de supprimer le token de périphérique lors de la déconnexion.

## Installation
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/YAOP77/Ebamage-marketplace.git
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Configurez les variables d'environnement dans un fichier `.env`.

## Démarrage
Lancez le serveur avec la commande suivante :
```bash
node server.js
```

## Structure du Projet
- **controllers/** : Contient les fichiers pour la logique métier (ex: `auth.controllers.js`, `otpVerify.js`).
- **middlewares/** : Contient les middlewares pour l'authentification et autres vérifications.
- **models/** : Définit les schémas Mongoose pour les collections MongoDB.
- **routes/** : Définit les routes pour les différentes fonctionnalités.
- **config/** : Contient les fichiers de configuration (ex: connexion à la base de données).

## Auteur
- **YAOP77**

## Licence
Ce projet est sous licence MIT.
