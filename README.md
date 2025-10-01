# Ejercicio individual

## Contexto

Desarrollar una pequeña aplicación en Node.js que permita gestionar tareas, almacenarlas en archivos JSON, leerlas, modificarlas y eliminarlas, todo sin usar base de datos. La persistencia se hará mediante archivos de texto plano.

## Instrucciones

### 1. Configura el Proyecto

- Crea un proyecto Node.js utilizando `npm init` y asegúrate de tener un archivo `package.json`.
- Instala los siguientes paquetes:
  - `fs` (modulo nativo de Node.js para interactuar con el sistema de archivos).
  - `express` para montar el servidor web.
- Crea un archivo `server.js` para configurar el servidor Express.

### 2. Creación de la Estructura de Archivos

- En la raíz del proyecto, crea un archivo llamado `tasks.json`. Este archivo almacenará las tareas en formato JSON. El contenido inicial será un arreglo vacío [].

### 3. Implementar la Funcionalidad

1. Crear una tarea
     - Crea una ruta `POST /tasks` para permitir que el usuario envíe una tarea en formato JSON (con propiedades como id, title, completed).
     - La tarea debe guardarse en el archivo `tasks.json`.
2. Obtener todas las tareas
     - Crea una ruta `GET /tasks` que lea el archivo `tasks.json` y devuelva todas las tareas en formato JSON.
3. Modificar una tarea
     - Crea una ruta `PUT /tasks/:id` para actualizar una tarea específica. Los datos que se actualizarán pueden ser el title o el estado de completed.
4. Eliminar una tarea
     - Crea una ruta `DELETE /tasks/:id` para eliminar una tarea según su id.

### 4. Uso del sistema de archivos

- Para todas las rutas mencionadas, deberás leer y escribir en el archivo `tasks.json`. Usa el módulo `fs` de Node.js para manejar la persistencia de la siguiente manera:
  - Escribir en el archivo: Utiliza `fs.writeFileSync()` para guardar los datos actualizados.
  - Leer desde el archivo: Utiliza `fs.readFileSync()` para cargar los datos cuando se necesiten.

### 5. Modularización del código

- Separa la lógica de lectura, escritura y eliminación de datos en un archivo independiente (`fileUtils.js`). Este archivo exportará funciones para interactuar con el archivo `tasks.json`.
- En `server.js`, importa estas funciones y úsalas dentro de las rutas correspondientes.

## Implementación

1. Creamos proyecto con `npm init -y`
2. Instalamos express con `npm install express` y nodemon con `npm install --save-dev nodemon`
3. Creamos archivo `server.js` y `fileUtils.js`
4. Creamos archivo `tasks.json` con contenido inicial `[]`
5. Comenzamos a implementar las rutas en `server.js`:
   1. `POST /tasks` valida el body para que tenga todos los campos solicitados: title, completed. Si no los tiene, responde con un error 400. Si los tiene, llama a la función `createTask` de `fileUtils.js` para agregar la tarea al archivo `tasks.json`. Internamente, `createTask` utiliza `writeTasks` para escribir en el archivo.
   2. `GET /tasks` llama a la función `readTasks` de `fileUtils.js` para obtener todas las tareas y devolverlas en la respuesta.
   3. `PUT /tasks/:id` valida que el id sea un número y que el body tenga al menos uno de los campos a actualizar (title o completed). Si no cumple, responde con error 400. Si cumple, llama a la función `updateTask` de `fileUtils.js` para actualizar la tarea. Internamente, `updateTask` utiliza `writeTasks` para escribir en el archivo.
   4. `DELETE /tasks/:id` valida que el id sea un número. Si no lo es, responde con error 400. Si lo es, llama a la función `deleteTask` de `fileUtils.js` para eliminar la tarea. Internamente, `deleteTask` utiliza `writeTasks` para escribir en el archivo.

## Testeando los endpoints

Aunque puedes utilizar Postman, Insomnia o similares para probar los endpoints, yo los probé con `curl` y dejo documentado el set de comandos para testear todos los endpoints:

```bash
# Crear una tarea
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Mi primera tarea","completed":false}'

# Leer todas las tareas. No utilizamos el verbo GET
# explícitamente porque es el método default de curl
curl http://localhost:3000/tasks

# Si tienes instalado jq, puedes formatear la salida:
curl http://localhost:3000/tasks | jq

# Actualizar una tarea (utilizaremos el id 1 como ejemplo)
# puedes agregar el pipe a jq para una mejor visualización " | jq"
curl -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"title":"Tarea actualizada","completed":true}'

# Eliminar una tarea (nuevamente utilizaremos el id 1)
curl -X DELETE http://localhost:3000/tasks/1
```

## Potenciales mejoras para otras entregas

- Implementar paginación en `GET /tasks` para manejar grandes cantidades de tareas.
- Mejorar las validaciones de los datos de entrada y los id.
- Mejorar el manejo de errores y respuestas, ej.: dividir "no encontrado o no se pudo [acción]" en dos funciones diferentes.
- Implementar una capa de servicio para mejorar la separación de responsabilidades y mejorar las respuestas.