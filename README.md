# CV Manager - Gestionnaire de CVs
=====================================

Ce projet est une application full-stack permettant de gérer des CVs stockés dans un fichier JSON.
Technologies utilisées : React, Next.js, Node.js et Express.

---

## Prérequis
- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Un éditeur de code (VSCode, Sublime Text, etc.)

---

## Installation
1. Cloner le dépôt :
```bash
git clone https://github.com/Champomix/cv-manager.git
cd cv-manager
```
2. Installer les dépendances du backend :
```bash
cd server
npm install express cors body-parser
```
3. Installer les dépendances du frontend :
```bash
cd ../client
npm install axios react-hook-form @hookform/resolvers yup
```
---

## Structure du projet
```
/cv-manager
├── client/          # Application Next.js (frontend)
├── server/          # API Node.js (backend)
└── cv-data.json     # Fichier de stockage des CVs (créé automatiquement)
```
---

## Lancement du projet
1. Démarrer le backend :
```bash
cd server
node index-datafile.js
```
(Accès : http://localhost:5000)

2. Démarrer le frontend :
```bash
cd ../client
npm run dev
```
(Accès : http://localhost:3000)

---

## Structure des données (cv-data.json)
Exemple de format :
```json
{
  "cvs": [
    {
      "id": "1625097600000",
      "personalInfo": {
        "firstName": "Jean",
        "lastName": "Dupont",
        "email": "jean@example.com"
      },
      "experiences": [
        {
          "company": "Tech Corp",
          "position": "Développeur Senior",
          "startDate": "2020-01",
          "endDate": "Présent"
        }
      ],
      "educations": [
        {
          "institution": "Université ParisTech",
          "degree": "Master en Informatique",
          "startDate": "2015-09",
          "endDate": "2017-06"
        }
      ],
      "skills": ["JavaScript", "React", "Node.js"],
      "createdAt": "2021-06-30T12:00:00.000Z",
      "updatedAt": "2021-07-15T09:30:00.000Z"
    }
  ]
}
```

---

## Endpoints API
- GET    /api/cvs        : Liste tous les CVs
- GET    /api/cv/:id     : Récupère un CV spécifique
- POST   /api/cv         : Crée ou met à jour un CV
- DELETE /api/cv/:id     : Supprime un CV

---

## Améliorations possibles
- Authentification (next-auth)
- Upload de fichiers (multer)
- Export PDF (jspdf)
- Base de données (mongoose)
- Tests (Jest)

---

## Résolution des problèmes
- Backend ne démarre pas : Vérifiez que le port 5000 est libre
- Erreur CORS : Activez le middleware cors() dans server/index.js
- Modifications non sauvegardées : Vérifiez les permissions du fichier cv-data.json

---

## Déploiement
Frontend (Vercel) :
cd client
npm install -g vercel
vercel

Backend (Heroku) :
cd server
heroku create
git push heroku main

---

## Licence
Ce projet est sous licence MIT.
