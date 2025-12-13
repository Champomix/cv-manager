const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;

// Configuration de Multer pour l'upload des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers JPEG et PNG sont autorisés'));
    }
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Remplacez par l'URL de votre frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Chemin vers le fichier de données (un niveau au-dessus)
const DATA_FILE = path.join(__dirname, './cv-data.json');

// Stockage des CVs
let cvsData = {
  cvs: []
};

// Données par défaut
const getDefaultData = () => {
  return {
    cvs: [
      {
        id: '1',
        personalInfo: {
          firstName: 'Jean',
          lastName: 'Dupont',
          profession: 'Développeur',
          email: 'jean.dupont@example.com',
          phone: '0123456789',
          address: '123 Rue de Paris',
          photo: null
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

// Charger les données depuis le fichier
const loadData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf8');

      // Vérifier si le fichier est vide ou contient juste des espaces
      if (!fileData.trim()) {
        console.log('Fichier cv-data.json est vide, initialisation avec les données par défaut');
        cvsData = getDefaultData();
        saveData();
      } else {
        cvsData = JSON.parse(fileData);
        console.log('Données chargées depuis ./cv-data.json');
      }
    } else {
      // Fichier n'existe pas, créer avec données par défaut
      console.log('Fichier ./cv-data.json introuvable, création avec données par défaut');
      cvsData = getDefaultData();
      saveData();
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    // En cas d'erreur (JSON invalide, etc.), initialiser avec des données par défaut
    console.log('Initialisation avec les données par défaut suite à une erreur');
    cvsData = getDefaultData();
    saveData();
  }
};

// Sauvegarder les données dans le fichier
const saveData = () => {
  try {
    // Créer le répertoire parent si nécessaire
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Écrire les données dans le fichier
    fs.writeFileSync(DATA_FILE, JSON.stringify(cvsData, null, 2), 'utf8');
    console.log('Données sauvegardées dans ./cv-data.json');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données:', error);
  }
};

// Initialiser les données
loadData();

// Helper pour initialiser les données
const initializeData = () => {
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
          address: '123 Rue de Paris',
          photo: null
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
loadData();

// Fonction pour supprimer une photo si elle existe
const deletePhotoIfExists = (photoPath) => {
  if (photoPath) {
    // Extraire le nom de fichier de l'URL API
    const filename = photoPath.replace('/api/image/', '');
    const fullPath = path.join(__dirname, 'uploads', filename);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Photo supprimée: ${fullPath}`);
    }
  }
};

// Routes API
// (Les routes restent identiques, seule la gestion du fichier de données change)

// Créer un nouveau CV
app.post('/api/cv', upload.single('photo'), (req, res) => {
  try {
    const cvData = JSON.parse(req.body.cvData);
    const newCv = {
      id: Date.now().toString(),
      ...cvData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      personalInfo: {
        ...cvData.personalInfo,
        photo: null
      }
    };

    if (req.file) {
      newCv.personalInfo.photo = `/api/image/${req.file.filename}`; // Changement ici
    }

    cvsData.cvs.push(newCv);
    saveData();
    res.status(201).json(newCv);
  } catch (error) {
    console.error('Erreur lors de la création du CV:', error);
    res.status(500).json({ error: 'Erreur lors de la création du CV', details: error.message });
  }
});

// Mettre à jour un CV existant
app.put('/api/cv/:id', upload.single('photo'), (req, res) => {
  try {
    const cvIndex = cvsData.cvs.findIndex(cv => cv.id === req.params.id);
    if (cvIndex === -1) return res.status(404).json({ error: 'CV non trouvé' });

    const cvData = JSON.parse(req.body.cvData);
    let photoPath = cvsData.cvs[cvIndex].personalInfo.photo;

    if (req.file) {
      if (photoPath) deletePhotoIfExists(photoPath.replace('/api/image/', '')); // Adaptation pour la suppression
      photoPath = `/api/image/${req.file.filename}`; // Changement ici
    }

    cvsData.cvs[cvIndex] = {
      ...cvsData.cvs[cvIndex],
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        photo: photoPath
      },
      updatedAt: new Date().toISOString()
    };

    saveData();
    res.json(cvsData.cvs[cvIndex]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du CV:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du CV', details: error.message });
  }
});

// Lire un CV spécifique
app.get('/api/cv/:id', (req, res) => {
  try {
    const cv = cvsData.cvs.find(cv => cv.id === req.params.id);
    if (cv) res.json(cv);
    else res.status(404).json({ error: 'CV non trouvé' });
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
    const cvIndex = cvsData.cvs.findIndex(cv => cv.id === req.params.id);
    if (cvIndex === -1) return res.status(404).json({ error: 'CV non trouvé' });

    const photoPath = cvsData.cvs[cvIndex].personalInfo.photo;
    if (photoPath) deletePhotoIfExists(photoPath);

    cvsData.cvs.splice(cvIndex, 1);
    saveData();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du CV' });
  }
});

// Route pour supprimer une photo spécifique
app.delete('/api/cv/:id/photo', (req, res) => {
  try {
    const cvIndex = cvsData.cvs.findIndex(cv => cv.id === req.params.id);
    if (cvIndex === -1) return res.status(404).json({ error: 'CV non trouvé' });

    const photoPath = cvsData.cvs[cvIndex].personalInfo.photo;
    if (!photoPath) return res.status(400).json({ error: 'Aucune photo à supprimer' });

    deletePhotoIfExists(photoPath);
    cvsData.cvs[cvIndex].personalInfo.photo = null;
    cvsData.cvs[cvIndex].updatedAt = new Date().toISOString();
    saveData();

    res.json({ success: true, message: 'Photo supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la photo' });
  }
});

// Ajoutez cette route à la place :
app.get('/api/image/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'uploads', filename);

    // Vérifier si le fichier existe
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image non trouvée' });
    }

    // Déterminer le type MIME en fonction de l'extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'image/jpeg'; // par défaut

    if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    }

    // Envoyer le fichier avec le bon Content-Type
    res.setHeader('Content-Type', contentType);
    const fileStream = fs.createReadStream(imagePath);
    fileStream.pipe(res);

    // Gestion des erreurs de lecture
    fileStream.on('error', (err) => {
      console.error('Erreur lors de la lecture de l\'image:', err);
      res.status(500).json({ error: 'Erreur lors de la lecture de l\'image' });
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'image' });
  }
});


// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Dossier d'upload: ${path.join(__dirname, 'uploads')}`);
  console.log(`Fichier de données: ${DATA_FILE}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Le port ${PORT} est déjà utilisé.`);
  } else {
    console.error('Erreur lors du démarrage du serveur:', err);
  }
});
