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

// TODO Implementar la actualización de tareas

// TODO Implementar el borrado de tareas

// Iniciamos el servidor
app.listen(PORT, () => console.log(RUNNING_SERVER_MSG));