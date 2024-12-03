const jsonServer = require('json-server');
const cors = require('cors');

// Crear un servidor json-server
const server = jsonServer.create();
const router = jsonServer.router('db.json');  // Ruta al archivo JSON

// Usar CORS para permitir solicitudes de otros orígenes
server.use(cors());

// Usar los middlewares predeterminados de json-server (CORS, logging, etc.)
server.use(jsonServer.defaults());

// Usar bodyParser para manejar JSON en las solicitudes
server.use(jsonServer.bodyParser);

// Middleware para manejar el registro de usuarios en memoria
let users = [];

// Ruta para recibir un nuevo usuario
server.post('/users', (req, res) => {
  try {
    const user = req.body;  // Datos del usuario enviados desde el frontend
    users.push(user);  // Almacena el usuario en la memoria (esto es temporal)
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: user
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Error al crear el usuario',
      error: error.message
    });
  }
});

// Ruta para autenticar un usuario
server.get('/users', (req, res) => {
  const { email, password } = req.query;

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.status(200).json({
      message: 'Usuario autenticado correctamente',
      user: user
    });
  } else {
    res.status(401).json({
      message: 'Credenciales inválidas',
      error: 'Correo o contraseña incorrectos'
    });
  }
});

// Usar el router de json-server para manejar las rutas predeterminadas
server.use(router);

// Iniciar el servidor (puedes cambiar el puerto si es necesario)
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
