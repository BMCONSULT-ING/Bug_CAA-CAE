# Suivi CAA / CAE

Application web pour le suivi des passages CAA et CAE avec formulaire et tableau des entrées.

## Colonnes du formulaire

| Colonne | Description |
|---------|-------------|
| Préfecture | Nom de la préfecture |
| Date entretien | Date de l'entretien |
| Passage CAA | Oui/Non ou détails |
| Mis à jour | Date de mise à jour |
| Passage CAE | Oui/Non ou détails |
| Complément en CAA | Détails complémentaires CAA |
| Complément en CAE | Détails complémentaires CAE |
| SCEC | Information SCEC |

## Installation en local

```bash
npm install
npm start
```

Ouvrir http://localhost:3000

## Déploiement sur Render

⚠️ **Important** : Créer un **Web Service** (et non un Static Site). Voir [DEPLOY.md](DEPLOY.md) pour les instructions détaillées.

### Résumé rapide
1. [render.com](https://render.com) → **New** → **Web Service** (ou **Blueprint**)
2. Connecter le dépôt GitHub
3. Build : `npm install` | Start : `npm start`
4. Ne pas définir de "Publish Directory"

> **Note** : Sur Render (plan gratuit), le système de fichiers est éphémère. Les données JSON sont perdues au redémarrage. Pour une persistance durable, envisagez PostgreSQL (gratuit sur Render).
