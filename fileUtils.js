const fs = require('fs');
const path = require('path');
const tasksPath = path.join(__dirname, 'tasks.json');

// util to write tasks to the JSON file
const writeTasks = (tasks) => {
  fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2));
}

// util to check file existence
const fileExists = () => fs.existsSync(tasksPath);

// Read tasks from the JSON file
const readTasks = () => {
  if (!fileExists()) {
    return [{ message: 'No existe el archivo.' }];
  }

  const tasksData = fs.readFileSync(tasksPath);
  return JSON.parse(tasksData);
}

// Create a new task
const createTask = (task) => {
  if (!fileExists()) {
    return null;
  }

  const tasks = readTasks();
  const currentId = tasks.at(-1)?.id || 0;
  const newTask = { id: currentId + 1, ...task };
  tasks.push(newTask);
  writeTasks(tasks);
  return newTask;
}

// Update an existing task
const updateTask = (id, updatedTask) => {
  if (!fileExists()) {
    return null;
  }

  const tasks = readTasks();
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id, 10));
  if (taskIndex === -1) {
    return null;
  }

  tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
  writeTasks(tasks);
  return tasks[taskIndex];
}

// Delete a task
const deleteTask = (id) => {
  if (!fileExists()) {
    return null;
  }

  const tasks = readTasks();
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id, 10));
  if (taskIndex === -1) {
    return null;
  }

  tasks.splice(taskIndex, 1);
  writeTasks(tasks);
  return true;
}

module.exports = {
  readTasks, createTask, updateTask, deleteTask
}