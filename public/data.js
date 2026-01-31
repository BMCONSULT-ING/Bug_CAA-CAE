// Liste des préfectures françaises (101 départements) - ordre alphabétique
const PREFECTURES = [
  'Agen', 'Ajaccio', 'Albi', 'Alençon', 'Amiens', 'Angers', 'Angoulême', 'Annecy',
  'Arras', 'Aurillac', 'Auxerre', 'Avignon', 'Bar-le-Duc', 'Bastia', 'Basse-Terre',
  'Beauvais', 'Belfort', 'Besançon', 'Blois', 'Bobigny', 'Bordeaux', 'Bourges', 'Bourg-en-Bresse',
  'Caen', 'Cahors', 'Carcassonne', 'Cayenne', 'Cergy', 'Châlons-en-Champagne', 'Chambéry',
  'Charleville-Mézières', 'Chartres', 'Chaumont', 'Châteauroux', 'Clermont-Ferrand', 'Colmar',
  'Créteil', 'Digne-les-Bains', 'Dijon', 'Épinal', 'Évreux', 'Évry-Courcouronnes',
  'Foix', 'Fort-de-France', 'Gap', 'Grenoble', 'Guéret', 'Laon', 'La Rochelle',
  'La Roche-sur-Yon', 'Laval', 'Le Mans', 'Le Puy-en-Velay', 'Lille', 'Limoges', 'Lons-le-Saunier',
  'Lyon', 'Mâcon', 'Mamoudzou', 'Marseille', 'Melun', 'Mende', 'Metz',
  'Montauban', 'Mont-de-Marsan', 'Montpellier', 'Moulins', 'Nancy', 'Nanterre',
  'Nantes', 'Nevers', 'Nice', 'Nîmes', 'Niort', 'Orléans', 'Pau', 'Paris', 'Perpignan',
  'Périgueux', 'Poitiers', 'Privas', 'Quimper', 'Rennes', 'Rodez', 'Rouen',
  'Saint-Brieuc', 'Saint-Denis', 'Saint-Étienne', 'Saint-Lô', 'Strasbourg', 'Tarbes',
  'Toulon', 'Toulouse', 'Tours', 'Troyes', 'Tulle', 'Valence', 'Vannes', 'Versailles',
  'Vesoul'
].sort((a, b) => a.localeCompare(b, 'fr'));

// Compléments possibles (documents demandés)
const COMPLEMENTS = [
  'Fiche de paie',
  'CAF',
  'Attestation France Travail',
  'Justificatif de domicile',
  'Attestation d\'hébergement',
  'Acte de naissance',
  'Livret de famille',
  'Pièce d\'identité',
  'Contrat de travail',
  'Avis d\'imposition',
  'Attestation Pôle emploi',
  'Relevé de compte',
  'Factures',
  'Titre de séjour',
  'Autre'
];

// Types de mise à jour
const TYPES_MISE_A_JOUR = [
  'Titre de séjour',
  'Changement d\'adresse',
  'Mariage',
  'Ressources',
  'Emploi',
  'Divorce',
  'Naissance',
  'Décès',
  'Changement situation familiale',
  'Renouvellement',
  'Autre'
];

// Méthodes de mise à jour
const METHODES_MISE_A_JOUR = [
  'Mail',
  'ANEF'
];
