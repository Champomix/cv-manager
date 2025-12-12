# Projet CV Manager - Initialisation et Configuration

Ce guide vous accompagne dans la mise en place du projet **CV Manager** utilisant **React**, **Next.js** et **Node.js** pour gérer des CVs stockés dans un fichier JSON.

---

## Prérequis

Assurez-vous d'avoir installé sur votre machine :
- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Un éditeur de code (VSCode, Sublime Text, etc.)

---

## Structure du Projet
```
/cv-manager
  ├── client/          # Application Next.js (frontend)
  ├── server/          # API Node.js (backend)
  └── cv-data.json     # Fichier de stockage des CVs (créé automatiquement)
```

---

## Étape 1 : Initialisation du Projet Backend (Node.js)
### Créer les dossiers du projet
```bash
mkdir cv-manager
cd cv-manager
```

### Initialiser le projet backend
```bash
mkdir server
cd server
npm init -y
```

### Installer les dépendances du backend
```bash
npm install express cors body-parser
```

### Créer le fichier server/index.js

```js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, '../cv-data.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialiser le fichier de données s'il n'existe pas
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ cvs: [] }, null, 2));
}

// Routes API

// Créer ou mettre à jour un CV
app.post('/api/cv', (req, res) => {
  const { id, ...cvData } = req.body;
  const data = JSON.parse(fs.readFileSync(DATA_FILE));

  if (id) {
    // Mise à jour
    const index = data.cvs.findIndex(cv => cv.id === id);
    if (index !== -1) {
      data.cvs[index] = { id, ...cvData };
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      res.json(data.cvs[index]);
    } else {
      res.status(404).json({ error: 'CV non trouvé' });
    }
  } else {
    // Création
    const newCv = {
      id: Date.now().toString(),
      ...cvData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.cvs.push(newCv);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(201).json(newCv);
  }
});

// Lire un CV spécifique
app.get('/api/cv/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const cv = data.cvs.find(cv => cv.id === req.params.id);
  if (cv) {
    res.json(cv);
  } else {
    res.status(404).json({ error: 'CV non trouvé' });
  }
});

// Lire tous les CVs
app.get('/api/cvs', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data.cvs);
});

// Supprimer un CV
app.delete('/api/cv/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const initialLength = data.cvs.length;
  data.cvs = data.cvs.filter(cv => cv.id !== req.params.id);

  if (data.cvs.length !== initialLength) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'CV non trouvé' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
```

## Étape 2 : Initialisation du Projet Frontend (Next.js)
### Créer l'application Next.js
```bash
cd ..
npx create-next-app@latest client
```

Pendant la création, vous pouvez accepter les options par défaut.
### Se déplacer dans le dossier client

    cd client

### Installer les dépendances supplémentaires

    npm install axios react-hook-form @hookform/resolvers yup

## Étape 3 : Configuration des Fichiers Frontend
### Structure des fichiers à créer dans client/
```
/client
  ├── pages/
  │   ├── api/         # (Optionnel, pour proxy API)
  │   ├── cv/
  │   │   ├── [id].js  # Page d'édition d'un CV
  │   │   └── new.js   # Page de création d'un CV
  │   ├── index.js     # Liste des CVs (déjà créé par Next.js)
  │   └── _app.js      # (Déjà créé par Next.js)
  ├── components/
  │   ├── CVForm.js    # Formulaire de CV
  │   ├── CVList.js    # Liste des CVs
  │   └── CVView.js    # Affichage d'un CV
  ├── styles/
  │   └── globals.css  # (Déjà créé par Next.js, à modifier)
  └── utils/
      └── validation.js # Validation des données
```

### Mettre à jour les fichiers
Remplacez le contenu des fichiers suivants avec le code fourni précédemment :

    pages/index.js
    pages/cv/[id].js
    pages/cv/new.js
    components/CVForm.js
    components/CVList.js
    styles/globals.css

## Étape 4 : Lancement du Projet
### Dans un premier terminal, démarrer le backend :
```bash
cd server
node index.js
```

Le serveur backend sera accessible à l'adresse : http://localhost:5000
### Dans un second terminal, démarrer le frontend :
```bash
cd ../client
npm run dev
```
L'application frontend sera accessible à l'adresse : http://localhost:3000

## Étape 5 : Vérification du Fonctionnement

    Ouvrez votre navigateur et accédez à http://localhost:3000
    Vous devriez voir la page principale avec un bouton pour créer un nouveau CV.
    Testez les fonctionnalités :
        Création d'un nouveau CV
        Édition d'un CV existant
        Suppression d'un CV
        Affichage de la liste des CVs

## Étape 6 : Structure des Données

Les CVs sont stockés dans le fichier cv-data.json à la racine du projet. Voici un exemple de structure :
```json
{
  "cvs": [
    {
      "id": "1625097600000",
      "personalInfo": {
        "firstName": "Jean",
        "lastName": "Dupont",
        "profession": "Développeur Full-Stack",
        "email": "jean.dupont@example.com",
        "phone": "+33 1 23 45 67 89"
      },
      "summary": "Développeur Full-Stack avec 5 ans d'expérience...",
      "experiences": [
        {
          "id": "1",
          "company": "Tech Solutions",
          "position": "Développeur Senior",
          "startDate": "2020-01",
          "endDate": "Présent"
        }
      ],
      "educations": [
        {
          "id": "1",
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

## Étape 7 : Améliorations Possibles (Optionnel)
Pour aller plus loin, vous pouvez implémenter les fonctionnalités suivantes :

### Authentification :

    cd client
    npm install next-auth

### Upload de fichiers :

    cd server
    npm install multer

### Export PDF :

    cd client
    npm install jspdf html2canvas

### Base de données :

    cd server
    npm install mongoose

### Tests :

    cd client
    npm install --save-dev @testing-library/react @testing-library/jest-dom jest

## Résolution des Problèmes Courants
### Problème : Le backend ne se connecte pas

    Vérifiez que le serveur backend est bien démarré (node index.js dans le dossier server).
    Assurez-vous que le port 5000 n'est pas déjà utilisé.

### Problème : CORS Error dans le navigateur

    Vérifiez que le middleware cors() est bien activé dans server/index.js.
    Assurez-vous que l'URL de l'API dans le frontend est correcte (http://localhost:5000).

### Problème : Les modifications ne sont pas sauvegardées

    Vérifiez les permissions d'écriture sur le fichier cv-data.json.
    Assurez-vous que le chemin vers le fichier est correct dans server/index.js.

## Commandes Utiles

| Action 	                      | Commande (Backend)    | Commande (Frontend)  |
|---------------------------------|-----------------------|----------------------| 
| Démarrer le serveur 	          | node index.js 	      | npm run dev          | 
| Installer une dépendance        | npm install <package> | npm install <package>|
| Lancer les tests (si configuré) |	npm test 	          |npm test              |

## Déploiement (Optionnel)
### Déploiement du Frontend (Vercel)

    cd client
    npm install -g vercel
    vercel

### Déploiement du Backend (Heroku)

    cd server
    # Installer l'outil Heroku CLI puis :
    heroku create
    git init
    git add .
    git commit -m "Initial commit"
    git push heroku master

## Licence
Ce projet est sous licence MIT. Vous êtes libre de l'utiliser et de le modifier selon vos besoins.