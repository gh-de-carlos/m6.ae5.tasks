const express = require('express');
const app = express();
const PORT = 3000;
const { readTasks, createTask, updateTask, deleteTask } = require('./fileUtils');
const RUNNING_SERVER_MSG = `Server con la paila puesta en http://localhost:${PORT}`;

// Middleware to parse JSON bodies
app.use(express.json());

// Create
app.post('/tasks', (req, res) => {
  const task = req.body;
  if (!task || !task.title || (task.completed !== false && task.completed !== true)) {
    return res.status(400).json({
      message: 'Debe incluir todos los campos: title, completed',
      success: false
    });
  }

  const isCreated = createTask(task);
  if (!isCreated) {
    return res.status(500).json({ message: 'Error interno: no se ha creado la tarea.', success: false });
  }
  res.status(201).json({ message: 'Tarea creada exitosamente', success: true, task: isCreated });
});

// Read all tasks
app.get('/tasks', (req, res) => {
   const tasks = readTasks();
   res.set('Cache-Control', 'no-store');

   if (tasks.length === 0) {
      return res.status(204).json({
        message: 'No se han encontrado tareas',
        success: false,
        tasks: []
      });
   }

   res.status(200).json({
      message: 'Tareas encontradas',
      success: true,
      tasks
   });
});

// Update a task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (isNaN(id)) {
    return res.status(400).json({
      message: 'El id debe ser un número.',
      success: false
    });
  }

  if (!updatedData ||
     (!updatedData.title &&
     (updatedData.completed !== true && updatedData.completed !== false))) {
    return res.status(400).json({
      message: 'Debe incluir al menos un campo para actualizar: title o completed',
      success: false
    });
  }

  const isUpdated = updateTask(id, updatedData);
  if (!isUpdated) {
    return res.status(404).json({
      message: 'Tarea no encontrada o no se ha podido actualizar.',
      success: false
    });
  }

  res.status(200).json({
    message: 'Tarea actualizada exitosamente',
    success: true,
    task: isUpdated
  });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({
      message: 'El id debe ser un número.',
      success: false
    });
  }

  const isDeleted = deleteTask(id);
  if (!isDeleted) {
    return res.status(404).json({
      message: 'Tarea no encontrada o no se ha podido borrar.',
      success: false
    });
  }

  res.status(200).json({
    message: 'Tarea borrada exitosamente',
    success: true
  });
});

// Iniciamos el servidor
app.listen(PORT, () => console.log(RUNNING_SERVER_MSG));