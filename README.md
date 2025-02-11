# **Documentation du projet To-Do Manager**

## **📌 Introduction**

Cette API REST permet de gérer une liste de tâches (_To-Do List_). Elle permet aux utilisateurs de **créer, lire, mettre à jour et supprimer** des tâches, tout en offrant des fonctionnalités avancées comme la **pagination** et le **filtrage** des tâches complétées.

## **📌 Technologies utilisées**

- **Node.js** : environnement d'exécution JavaScript.
    
- **Express.js** : framework pour gérer les routes et les requêtes HTTP.
    
- **MongoDB** : base de données NoSQL pour stocker les tâches.
    
- **Mongoose** : ODM pour interagir avec MongoDB.
    
---

## **📌 Installation et configuration**

### **1️⃣ Cloner le projet et installer les dépendances**

```
# Cloner le dépôt
git clone https://github.com/mon-compte/todo-manager.git
cd todo-manager

# Installer les dépendances
npm install
```

### **2️⃣ Configurer la base de données MongoDB**

- Option 1 : Utiliser MongoDB en local (assurez-vous qu'il est installé et en cours d'exécution).
    
- Option 2 : Utiliser MongoDB Atlas (créez un compte et obtenez une URI de connexion).
    

Créer un fichier `.env` à la racine du projet :

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/todoDB  # Remplacez par votre URI Atlas si besoin
```

### **3️⃣ Lancer le serveur**

```
npm start
```

L'API sera accessible à l'adresse : **http://localhost:5000**

---

## **📌 Modèle de données (MongoDB)**

Chaque tâche a la structure suivante :

```
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
```

---

## **📌 Routes de l'API**

### **🟢 1. Créer une tâche**

- **Méthode** : `POST`
    
- **URL** : `/api/tasks`
    
- **Exemple de requête** :
    
    ```
    {
      "title": "Acheter du lait",
      "description": "Aller au supermarché avant 18h"
    }
    ```
    
- **Réponse** :
    
    ```
    {
      "_id": "65a3f9a2e9d8f5b23c4f7d1b",
      "title": "Acheter du lait",
      "description": "Aller au supermarché avant 18h",
      "completed": false,
      "createdAt": "2025-02-01T12:00:00.000Z"
    }
    ```
    

---

### **🔵 2. Lire toutes les tâches (avec pagination et filtrage)**

- **Méthode** : `GET`
    
- **URL** : `/api/tasks?page=1&limit=5&completed=true`
    
- **Paramètres optionnels** :
    
    - `page` : numéro de page (par défaut 1).
        
    - `limit` : nombre de tâches par page (par défaut 5).
        
    - `completed` : filtre sur le statut (`true` ou `false`).
        
- **Réponse** :
    
    ```
    {
      "page": 1,
      "limit": 5,
      "totalTasks": 12,
      "totalPages": 3,
      "data": [ { ...tâches... } ]
    }
    ```
    

---

### **🟡 3. Lire une tâche spécifique**

- **Méthode** : `GET`
    
- **URL** : `/api/tasks/:id`
    
- **Exemple** : `/api/tasks/65a3f9a2e9d8f5b23c4f7d1b`
    
- **Réponse** :
    
    ```
    {
      "_id": "65a3f9a2e9d8f5b23c4f7d1b",
      "title": "Acheter du lait",
      "description": "Aller au supermarché avant 18h",
      "completed": false,
      "createdAt": "2025-02-01T12:00:00.000Z"
    }
    ```
    

---

### **🟠 4. Mettre à jour une tâche**

- **Méthode** : `PUT`
    
- **URL** : `/api/tasks/:id`
    
- **Exemple de requête** :
    
    ```
    {
      "title": "Acheter du pain",
      "completed": true
    }
    ```
    
- **Réponse** :
    
    ```
    {
      "_id": "65a3f9a2e9d8f5b23c4f7d1b",
      "title": "Acheter du pain",
      "description": "Aller au supermarché avant 18h",
      "completed": true,
      "createdAt": "2025-02-01T12:00:00.000Z"
    }
    ```
    

---

### **🔴 5. Supprimer une tâche**

- **Méthode** : `DELETE`
    
- **URL** : `/api/tasks/:id`
    
- **Exemple** : `/api/tasks/65a3f9a2e9d8f5b23c4f7d1b`
    
- **Réponse** :
    
    ```
    {
      "message": "Tâche supprimée avec succès"
    }
    ```
    

---

## **📌 Tester l'API avec Postman**

1. Ouvrir Postman.
    
2. Créer une nouvelle requête.
    
3. Choisir la méthode (`GET`, `POST`, `PUT`, `DELETE`).
    
4. Entrer l'URL (ex : `http://localhost:5000/api/tasks`).
    
5. Ajouter le corps JSON pour les requêtes `POST` et `PUT`.
    
6. Envoyer la requête et observer la réponse.
