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

1. Créer un compte sur [render.com](https://render.com)
2. Connecter votre dépôt GitHub
3. Créer un nouveau **Web Service**
4. Choisir ce dépôt
5. Render détectera automatiquement :
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
6. Déployer

### Avec render.yaml (Blueprint)

Si vous utilisez le fichier `render.yaml`, Render configurera automatiquement le service.

> **Note** : Sur Render (plan gratuit), le système de fichiers est éphémère. Les données JSON sont perdues au redémarrage du service. Pour une persistance durable, envisagez d'ajouter une base de données PostgreSQL (gratuite sur Render).
