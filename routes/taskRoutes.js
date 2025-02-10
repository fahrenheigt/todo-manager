const express = require('express');
const Task = require('../models/task');
const router = express.Router();

// Créer une tâche
router.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/tasks', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const sort = req.query.sort || 'asc';
  
      const filter = {};
      if (req.query.completed !== undefined) {
        filter.completed = req.query.completed === 'true';
      }
  
      const sortOption = { title: sort === 'desc' ? -1 : 1 };
  
      const tasks = await Task.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit);
  
      const totalTasks = await Task.countDocuments(filter);
  
      res.json({
        page,
        limit,
        totalTasks,
        totalPages: Math.ceil(totalTasks / limit),
        data: tasks,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Lire une tâche spécifique
router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour une tâche
router.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Supprimer une tâche
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
