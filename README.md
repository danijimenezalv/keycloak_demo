# Guía del Programador: Integración de Keycloak con Express

Este proyecto muestra cómo integrar Keycloak, un sistema de gestión de identidades y accesos (IAM), con un servidor Express para proteger recursos públicos y privados mediante autenticación y autorización.

## Requisitos previos

Antes de empezar, asegúrate de tener:

- Node.js (v14 o superior) y npm instalados.
- Un servidor de Keycloak configurado y ejecutándose.
- Un cliente configurado en Keycloak (en este caso, `demoapp`) con el realm `RealmRSE`.
- Opcional: Familiaridad básica con Express y Keycloak.

## Instalación

1. Clona este repositorio o copia el código fuente en tu entorno de desarrollo.

2. Instala las dependencias del proyecto ejecutando el siguiente comando:

   ```bash
   npm install 
   ```

## Configuración

### Servidor Express

- **Sesiones**: Se utiliza `express-session` con un `MemoryStore` para almacenar las sesiones en memoria.
- **Rutas**:
  - `/`: Ruta pública accesible sin autenticación.
  - `/protegido`: Ruta protegida que requiere autenticación.
  - `/admin`: Ruta protegida que requiere autenticación y el rol `admin`.

### Keycloak

- **Realm**: `RealmRSE`.
- **URL del servidor de Keycloak**: `http://localhost:8080/`.
- **Cliente**: `demoapp`.

Asegúrate de que la configuración en Keycloak coincida con estos valores o modifica el código acorde a las modificaciones que realices.

## Uso

1. **Iniciar el servidor**:

   Ejecuta el siguiente comando:

   ```bash
   node index.js
   ```

2. **Acceso al servidor**:

   - Abre un navegador y visita `http://localhost:3000/` para acceder a la ruta pública.
   - Visita `http://localhost:3000/protegido` para acceder a la ruta protegida (requiere inicio de sesión).
   - Visita `http://localhost:3000/admin` para acceder a la ruta protegida con rol `admin` (requiere inicio de sesión con el rol adecuado).

## Detalles del código

### Configuración de la sesión

```javascript
app.use(session({
  secret: 'XXX', 
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));
```
Se configura `express-session` con un almacenamiento en memoria. Cambia el `secret` por un valor seguro en producción.

### Integración con Keycloak
Como se está conectando a un localhost, htpp, desbilitamos el cifrado ssl.
```javascript
const keycloak = new Keycloak({ store: memoryStore }, {
  "realm": "RealmRSE",
  "auth-server-url": "http://localhost:8080/",
  "ssl-required": "none",
  "resource": "demoapp"
});
```

Se inicializa una instancia de Keycloak con la configuración necesaria. Asegúrate de habilitar las credenciales del cliente si es necesario.

### Middleware y rutas

- **Middleware de Keycloak**:

  ```javascript
  app.use(keycloak.middleware());
  ```

  Este middleware integra Keycloak con Express para manejar autenticación y autorización.

- **Ruta pública**:

  ```javascript
  app.get('/', (req, res) => {
    res.send('Servidor Express funcionando 🚀');
  });
  ```

- **Ruta protegida**:

  ```javascript
  app.get('/protegido', keycloak.protect(), (req, res) => {
    res.send('Estás autenticado ✅');
  });
  ```

- **Ruta con roles**:

  ```javascript
  app.get('/admin', keycloak.protect('admin'), (req, res) => {
    res.send('Estás autenticado como un administrador 🛠️​');
  });
  ```

## Notas adicionales

- Este proyecto utiliza `MemoryStore`, que no es adecuado para producción pero es óptimo para la propuesta que hemos realizado. Considera usar una solución más robusta como Redis o una base de datos.
