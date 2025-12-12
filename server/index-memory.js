const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Stockage en mémoire des CVs
let cvsData = {
  cvs: []
};

// Helper pour initialiser les données
const initializeData = () => {
  // Vous pouvez ajouter ici des données initiales si nécessaire
  // Par exemple :
  cvsData = {
    cvs: [
      {
        id: '1',
        personalInfo: {
          firstName: 'Jean',
          lastName: 'Dupont',
          profession: 'Développeur',
          email: 'jean.dupont@example.com',
          phone: '0123456789',
          address: '123 Rue de Paris'
        },
        summary: 'Développeur expérimenté avec plus de 5 ans d\'expérience',
        experiences: [
          {
            company: 'Entreprise A',
            position: 'Développeur Full Stack',
            startDate: '2020-01-01',
            endDate: '2023-01-01',
            description: 'Développement d\'applications web'
          }
        ],
        educations: [
          {
            institution: 'Université de Paris',
            degree: 'Master en Informatique',
            startDate: '2016-09-01',
            endDate: '2019-06-01'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  };
};

// Initialiser les données
initializeData();

// Routes API

// Créer un nouveau CV
app.post('/api/cv', (req, res) => {
  try {
    const newCv = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    cvsData.cvs.push(newCv);
    res.status(201).json(newCv);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du CV' });
  }
});

// Mettre à jour un CV existant
app.put('/api/cv/:id', (req, res) => {
  try {
    const cvIndex = cvsData.cvs.findIndex(cv => cv.id === req.params.id);

    if (cvIndex === -1) {
      return res.status(404).json({ error: 'CV non trouvé' });
    }

    // Mise à jour des données avec conservation des métadonnées
    cvsData.cvs[cvIndex] = {
      ...cvsData.cvs[cvIndex], // Garde l'ID et les dates existantes
      ...req.body,             // Met à jour avec les nouvelles données
      updatedAt: new Date().toISOString() // Met à jour le timestamp
    };

    res.json(cvsData.cvs[cvIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du CV' });
  }
});

// Lire un CV spécifique
app.get('/api/cv/:id', (req, res) => {
  try {
    const cv = cvsData.cvs.find(cv => cv.id === req.params.id);
    if (cv) {
      res.json(cv);
    } else {
      res.status(404).json({ error: 'CV non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture du CV' });
  }
});

// Lire tous les CVs
app.get('/api/cvs', (req, res) => {
  try {
    res.json(cvsData.cvs);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des CVs' });
  }
});

// Supprimer un CV
app.delete('/api/cv/:id', (req, res) => {
  try {
    const initialLength = cvsData.cvs.length;
    cvsData.cvs = cvsData.cvs.filter(cv => cv.id !== req.params.id);

    if (cvsData.cvs.length !== initialLength) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'CV non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du CV' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Le port ${PORT} est déjà utilisé.`);
  } else {
    console.error('Erreur lors du démarrage du serveur:', err);
  }
});
