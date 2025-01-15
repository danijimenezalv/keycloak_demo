import express from 'express';
import session, { MemoryStore } from 'express-session';
import Keycloak from 'keycloak-connect';

const app = express();
const memoryStore = new MemoryStore();

// Configurar sesión
app.use(session({
  secret: '1234', 
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// Configuración de Keycloak
const keycloak = new Keycloak({ store: memoryStore }, {
  "realm": "RealmRSE",
  "auth-server-url": "http://localhost:8080",
  "ssl-required": "none",
  "resource": "demoapp",
//   "public-client": false,
//   "credentials": {
//     "secret": "cLcBfql12gfToDuUvddXQeNO9tSYucX4A"   //Client Secret del Cliente (demoapp)
//   }
});

// Rutas protegidas y públicas
app.use(keycloak.middleware());

// Ruta pública
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando 🚀');
});

// Ruta protegida para cualquier usuario
app.get('/protegido' , keycloak.protect(), (req, res) => {
  res.send('Estás autenticado ✅');
});

// Ruta protegida para usuarios con el rol "admin"
app.get('/admin' , keycloak.protect('admin'), (req, res) => {
    res.send('Estás autenticado como un administrador 🛠️​');
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
