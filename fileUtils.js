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

const updateTask = (id, updatedTask) => {
  return ''; // TODO implement here...
}

const deleteTask = (id) => {
  return ''; // TODO implement here...
}

module.exports = {
  readTasks, createTask, updateTask, deleteTask
}