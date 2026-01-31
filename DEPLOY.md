# Déploiement sur Render

## ⚠️ Important : Web Service, pas Static Site

Ce projet est une **application Node.js/Express**. Vous devez créer un **Web Service**, **PAS** un Static Site.

L'erreur « Publish directory build does not exist » signifie que vous avez créé un **Static Site** par erreur.

---

## Option 1 : Blueprint (recommandé)

1. Allez sur [dashboard.render.com](https://dashboard.render.com)
2. Cliquez sur **« New »** → **« Blueprint »**
3. Connectez votre dépôt GitHub `danjar2014/Bug_CAA-CAE`
4. Render lira le fichier `render.yaml` et créera automatiquement le **Web Service**
5. Cliquez sur **« Apply »**

---

## Option 2 : Création manuelle

1. Allez sur [dashboard.render.com](https://dashboard.render.com)
2. Cliquez sur **« New »** → **« Web Service »** (et non « Static Site »)
3. Connectez votre dépôt GitHub `danjar2014/Bug_CAA-CAE`
4. Configurez :
   - **Name** : `bug-caa-cae-form` (ou autre)
   - **Region** : Frankfurt (ou le plus proche)
   - **Branch** : `main`
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Instance Type** : Free
5. **Ne pas renseigner** « Publish Directory » (réservé aux sites statiques)
6. Cliquez sur **« Create Web Service »**

---

## Vérification

Après le déploiement, l'application sera disponible sur une URL du type :
`https://bug-caa-cae-form.onrender.com`
