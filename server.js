const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Fichier de stockage des données
const DATA_FILE = path.join(__dirname, 'data', 'entries.json');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// S'assurer que le dossier data existe
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialiser le fichier JSON s'il n'existe pas
function initDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
}

// Lire les entrées
function getEntries() {
  initDataFile();
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Sauvegarder les entrées
function saveEntries(entries) {
  initDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
}

// Routes API

// GET - Récupérer toutes les entrées
app.get('/api/entries', (req, res) => {
  try {
    const entries = getEntries();
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la lecture des données' });
  }
});

// POST - Ajouter une nouvelle entrée
app.post('/api/entries', (req, res) => {
  try {
    const entries = getEntries();
    const newEntry = {
      id: Date.now().toString(),
      prefecture: req.body.prefecture || '',
      dateEntretien: req.body.dateEntretien || '',
      passageCAA: req.body.passageCAA || '',
      misAJour: req.body.misAJour || '',
      typeMisAJour: req.body.typeMisAJour || '',
      methodeMisAJour: req.body.methodeMisAJour || '',
      passageCAE: req.body.passageCAE || '',
      complementCAA: req.body.complementCAA || '',
      complementCAE: req.body.complementCAE || '',
      sCEC: req.body.sCEC || '',
      createdAt: new Date().toISOString()
    };
    entries.push(newEntry);
    saveEntries(entries);
    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement' });
  }
});

// PUT - Modifier une entrée
app.put('/api/entries/:id', (req, res) => {
  try {
    const entries = getEntries();
    const index = entries.findIndex(e => e.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Entrée non trouvée' });
    }
    entries[index] = {
      ...entries[index],
      prefecture: req.body.prefecture ?? entries[index].prefecture,
      dateEntretien: req.body.dateEntretien ?? entries[index].dateEntretien,
      passageCAA: req.body.passageCAA ?? entries[index].passageCAA,
      misAJour: req.body.misAJour ?? entries[index].misAJour,
      typeMisAJour: req.body.typeMisAJour ?? entries[index].typeMisAJour,
      methodeMisAJour: req.body.methodeMisAJour ?? entries[index].methodeMisAJour,
      passageCAE: req.body.passageCAE ?? entries[index].passageCAE,
      complementCAA: req.body.complementCAA ?? entries[index].complementCAA,
      complementCAE: req.body.complementCAE ?? entries[index].complementCAE,
      sCEC: req.body.sCEC ?? entries[index].sCEC
    };
    saveEntries(entries);
    res.json(entries[index]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la modification' });
  }
});

// Page principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
