const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;
const DATA_FILE = path.join(__dirname, '../cv-data.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialiser le fichier de données s'il n'existe pas
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ cvs: [] }, null, 2));
}

// Helper pour lire/écrire les données
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// Routes API

// Créer un nouveau CV
app.post('/api/cv', (req, res) => {
  try {
    const data = readData();
    const newCv = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.cvs.push(newCv);
    writeData(data);
    res.status(201).json(newCv);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du CV' });
  }
});

// Mettre à jour un CV existant (NOUVEAU)
app.put('/api/cv/:id', (req, res) => {
  try {
    const data = readData();
    const cvIndex = data.cvs.findIndex(cv => cv.id === req.params.id);

    if (cvIndex === -1) {
      return res.status(404).json({ error: 'CV non trouvé' });
    }

    // Mise à jour des données avec conservation des métadonnées
    data.cvs[cvIndex] = {
      ...data.cvs[cvIndex], // Garde l'ID et les dates existantes
      ...req.body,          // Met à jour avec les nouvelles données
      updatedAt: new Date().toISOString() // Met à jour le timestamp
    };

    writeData(data);
    res.json(data.cvs[cvIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du CV' });
  }
});

// Lire un CV spécifique
app.get('/api/cv/:id', (req, res) => {
  try {
    const data = readData();
    const cv = data.cvs.find(cv => cv.id === req.params.id);
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
    const data = readData();
    res.json(data.cvs);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des CVs' });
  }
});

// Supprimer un CV
app.delete('/api/cv/:id', (req, res) => {
  try {
    const data = readData();
    const initialLength = data.cvs.length;
    data.cvs = data.cvs.filter(cv => cv.id !== req.params.id);

    if (data.cvs.length !== initialLength) {
      writeData(data);
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
