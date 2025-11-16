# Prueba Técnica - Fullstack Developer (Node.js + React)

¡Bienvenido(a) a la prueba técnica para el puesto de **Desarrollador Fullstack**!

Esta prueba evaluará tus habilidades en el desarrollo de aplicaciones full-stack modernas utilizando **Node.js**, **Express**, **React**, y bases de datos. Tendrás **48 horas** para completar el desafío.

---

## 📋 Descripción del Proyecto

Desarrollarás una **plataforma de gestión de proyectos y tareas colaborativa** donde los usuarios pueden:

- Registrarse e iniciar sesión de forma segura
- Crear y gestionar proyectos
- Asignar tareas a diferentes proyectos
- Colaborar con otros usuarios en proyectos compartidos
- Filtrar, buscar y ordenar tareas por diferentes criterios
- Ver estadísticas básicas de sus proyectos

---

## 🛠️ Stack Tecnológico Requerido

### Backend
- **Runtime**: Node.js (v18 o superior)
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **Base de Datos**: MySQL **o** MongoDB (elige una)
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación API**: Swagger/OpenAPI

### Frontend
- **Framework**: React (v18 o superior)
- **Lenguaje**: TypeScript
- **Routing**: React Router v6
- **Estilos**: TailwindCSS (preferencia)

### DevOps (Opcional)
- **Containerización**: Docker + Docker Compose

**Nota**: Puedes usar cualquier otra librería o herramienta que consideres necesaria. Documenta tus decisiones técnicas en el archivo `TECHNICAL_DECISIONS.md`.

---

## 📦 Funcionalidades Requeridas

### 1. Autenticación y Usuarios

**Backend:**
- Registro de usuarios con validación
- Login con generación de JWT
- Middleware de autenticación para proteger rutas
- Hash de contraseñas
- Endpoint para obtener perfil del usuario autenticado

**Frontend:**
- Formularios de registro y login con validaciones
- Almacenamiento del token de autenticación
- Rutas protegidas que requieren autenticación
- Redirección automática según estado de autenticación

---

### 2. Gestión de Proyectos

**Backend:**
- CRUD completo de proyectos
- Solo el creador del proyecto puede editarlo o eliminarlo
- Sistema de colaboradores: añadir usuarios a proyectos
- Paginación en listado de proyectos

**Frontend:**
- Lista de proyectos con diseño responsive
- Crear, editar y eliminar proyectos
- Búsqueda y filtrado de proyectos
- Gestión de colaboradores

---

### 3. Gestión de Tareas

**Backend:**
- CRUD completo de tareas
- Las tareas pertenecen a un proyecto
- Estados: "pendiente", "en progreso", "completada"
- Prioridades: "baja", "media", "alta"
- Asignar tareas a colaboradores del proyecto
- Filtros por estado, prioridad, proyecto, usuario asignado
- Ordenamiento flexible

**Frontend:**
- Visualización de tareas (lista, kanban, o tu propuesta)
- Crear, editar y eliminar tareas
- Cambiar estado de tareas
- Filtros interactivos
- Asignación de tareas a usuarios

---

### 4. Dashboard y Estadísticas

**Backend:**
- Endpoint con estadísticas del usuario:
  - Total de proyectos
  - Total de tareas
  - Tareas por estado
  - Otras métricas relevantes

**Frontend:**
- Dashboard con visualización de estadísticas
- Resumen de actividad del usuario

---

## 📊 Criterios de Evaluación

Tu proyecto será evaluado en base a:

| Criterio | Peso |
|----------|------|
| **Funcionalidad** | 30% |
| **Calidad del Código** | 25% |
| **Arquitectura y Diseño** | 15% |
| **Seguridad** | 10% |
| **UI/UX** | 10% |
| **Documentación** | 5% |
| **Testing** | 5% |

### Puntos Extra (hasta +30%)
- Docker implementation completa (+10%)
- Tests exhaustivos (+5%)
- Funcionalidades adicionales (+5%)
- CI/CD pipeline (+5%)
- Deploy en producción (+5%)

---

## 📝 Instrucciones de Entrega

1. **Fork del repositorio**: Crea un fork de este repositorio

2. **Rama de trabajo**:
   ```
   test/tu-nombre-completo
   ```

3. **Estructura del proyecto**:
   ```
   /
   ├── backend/
   ├── frontend/
   ├── TECHNICAL_DECISIONS.md    # Documenta tus decisiones aquí
   ├── docker-compose.yml         # (opcional)
   └── README.md                  # Actualiza con instrucciones de ejecución
   ```

4. **Documentación requerida**:
   - Actualiza este README con instrucciones de instalación y ejecución
   - Completa el archivo `TECHNICAL_DECISIONS.md` explicando tus elecciones
   - Documenta tu API con Swagger
   - Incluye al menos 5 tests

5. **Pull Request**: Una vez completado, crea un PR hacia el repositorio original

---

## ⏱️ Tiempo

Tienes **48 horas** desde que recibes esta prueba. Gestiona tu tiempo según tus prioridades.

---

## ❓ Preguntas Frecuentes

**¿Puedo usar librerías adicionales?**
Sí, documenta tus elecciones en `TECHNICAL_DECISIONS.md`.

**¿Qué base de datos uso?**
La que prefieras (MySQL o MongoDB). No afecta la evaluación.

**¿Es obligatorio Docker?**
No, pero suma puntos extra.

**¿Puedo usar librerías de UI?**
Sí. Recomendamos TailwindCSS para estilos, pero también puedes usar otras librerías de componentes (Material-UI, Ant Design, etc.).

---

## 🎉 ¡Buena suerte!

Recuerda: evaluamos no solo que funcione, sino **cómo está construido**. Demuestra tu criterio técnico y mejores prácticas.

Si tienes dudas sobre los requisitos, no dudes en contactarnos.

---

# 📖 Instrucciones de Ejecución

> **Nota**: Completa esta sección con las instrucciones para ejecutar tu proyecto.

## Prerrequisitos
Node.js:v20+

NPM: v10 o superior.

Docker Desktop: Es necesario para levantar la base de datos MySQL y el gestor phpMyAdmin

## Instalación
```bash
git clone [https://github.com/MaribelPilquinao/Fullstack_Test_01.git]
cd [Fullstack_Test_01]
```

## Configuración
```bash
# Puerto del servidor API
PORT=3000

# Base de Datos (debe coincidir con docker-compose.yml)
DB_HOST=localhost
DB_PORT=3308 # ¡Importante! Usamos el 3308 para exponerlo
DB_NAME=project_management
DB_USER=user
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

front:
# API Configuration
VITE_API_URL=http://localhost:3000/api
```


## Ejecución
```bash
# Backend
cd backend
npm install
# Frontend
cd frontend
npm install
```
Necesitarás 3 terminales abiertas.

Terminal 1: Base de Datos (Docker) En la carpeta raíz del proyecto (Fullstack_Test_01/), levanta los servicios de MySQL y phpMyAdmin:
docker-compose up -d

Puedes acceder a phpMyAdmin en: http://localhost:8080

(Usuario: root, Contraseña: rootpassword, Servidor: db)

Terminal 2: Servidor Backend Navega a la carpeta backend/ y ejecuta:
npm run dev
El backend correrá en http://localhost:3000

Terminal 3: Aplicación Frontend Navega a la carpeta frontend/ y ejecuta:
npm run dev
El frontend correrá en http://localhost:5173 (o el puerto que Vite indique).
Abre http://localhost:5173 en tu navegador para usar la app

## Tests
```bash
# Comandos de tests
```
Para ejecutar los 5 tests de integración del backend:

Asegúrate de que la base de datos Docker (Paso 1 de Ejecución) esté corriendo.

En la terminal del backend (backend/), ejecuta:
npm test

## API Documentation
API Documentation
La documentación de la API (generada con Swagger/OpenAPI) está disponible una vez que el backend esté corriendo.

- Swagger: [[Tu URL](http://localhost:3000/api-docs)]

## Credenciales de Prueba
Puedes crear un nuevo usuario directamente desde la interfaz gráfica.

Ve a http://localhost:5173/register.

Regístrate (ej. test@example.com / password123).

usuario de prueba:
user: maribel@gmail.com
pass: 123456


