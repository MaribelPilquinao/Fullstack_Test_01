# Decisiones Técnicas
## Maribel Alejandra Pilquinao Manquel

> **Nota**: Este es un archivo opcional pero recomendado. Documentar tus decisiones técnicas demuestra pensamiento crítico y puede sumar puntos extra en la evaluación.

---

## 📋 Información General

- **Nombre del Candidato**: [Maribel Pilquinao]
- **Fecha de Inicio**: [14/11/2025]
- **Fecha de Entrega**: [16/11/2025]
- **Tiempo Dedicado**: [Ej: ~20 horas] --pendiente

---

## 🛠️ Stack Tecnológico Elegido

### Backend

| Tecnología | Versión | Razón de Elección |
|------------|---------|-------------------|
| Node.js | v20.12.2 | La elegí porque es la version estable LTS, garantiza estabilidad y caracteristicas actualizadas |
| Express | 5 | maneja nativamente los errores en funciones asíncronas. Esto permitió eliminar try-catch en los controladores, centralizando todo en el errorHandler |
| Base de Datos | MySQL | [La elegí sobre MongoDB porque la naturaleza de los datos (Usuarios -> Proyectos -> Tareas) es inherentemente relacional. MySQL garantiza la integridad de  los datos (ACID) en estas relaciones.] |
| ORM/ODM | TypeORM| integración con TypeScript. Permite usar Decoradores para definir entidades (@Entity) y su función synchronize: true agilizó el desarrollo al crear/actualizar el esquema de la BD automáticamente |
| Validación | express-validator/Joi/Zod | [no usé] |
| Testing | Jest | [Estándar de la industria. Se usó en conjunto con Supertest para realizar pruebas de integración (E2E) directamente contra los endpoints de la API, probando el flujo real de autenticación] |

### Frontend

| Tecnología | Versión | Razón de Elección |
|------------|---------|-------------------|
| React | 18.x | [Razón] |
| Build Tool | Vite/CRA | [¿Por qué elegiste este?] |
| Estado Global | Context/Redux/Zustand | [Razón] |
| Estilos | CSS/Tailwind/MUI/etc | [Razón] |
| Formularios | react-hook-form/Formik | [Razón] |

---

## 🏗️ Arquitectura

### Estructura del Backend

```
backend/
└── src/
    ├── app.ts                # Configuración de Express
    ├── index.ts              # Punto de entrada (Servidor + Conexión DB)
    ├── config/               # (data-source.ts)
    ├── controllers/          # Manejadores de rutas (HTTP)
    ├── entities/             # Definiciones de tablas (TypeORM)
    ├── middlewares/          # (authMiddleware, errorHandler)
    ├── repositories/         # Lógica de consulta a la BD
    ├── routes/               # Definición de endpoints
    ├── services/             # Lógica de negocio
    ├── tests/                # Pruebas de integración
    └── utils/                # (AppError, response)
```

**Razón de esta estructura:**
[Explica por qué organizaste tu código de esta manera]

Utilicé esta estructura básicamente porque me permite manejar la estrutura del proyecto de la prueba técnica por capas, arquitectura por capas y así lograr una separación
de responsabilidades.

Por ejemplo:
Controllers: Solo manejan la Request y Response. Validan la entrada y llaman al servicio.
Services: Contienen toda la lógica de negocio (ej. "solo el dueño puede editar"). No saben nada de HTTP.
Repositories: Es la única capa que habla con la base de datos (TypeORM). Abstrae las consultas

Si el proyecto se pensará para crecer o cambiar de ORM, no afectaria en la lógica de negocio.
Esta estructura hace que el código sea altamente mantenible, escalable y fácil de testear.



### Estructura del Frontend

```
frontend/
├── src/
│   ├── [tu estructura]
│   └── ...
```

**Razón de esta estructura:**
[Explica por qué organizaste tu código de esta manera]

---

## 🗄️ Diseño de Base de Datos

### Elección: MySQL

**Razones:**
- Relacional: La prueba técnica es naturalmente relacional. Usuarios que poseen Proyectos que contienen Tareas, es relacional.
- Transaccional: MySQL es ACID, garantizando la integridad de los datos, lo cual es crítico al crear/borrar entidades relacionadas.
- Madurez: Es un sistema robusto y probado, con excelente soporte de TypeORM.

### Schema/Modelos

[Describe brevemente tus tablas/colecciones principales]

User: Almacena datos de autenticación (email, passwordHash). Es el "dueño" de Proyectos y el "asignado" de Tareas.

Project: Contiene la información del proyecto y sus relaciones.

Task: Contiene la información de la tarea, incluyendo status y priority como enum.

**Decisiones importantes:**
- **Normalización** (si usas MySQL): [La base de datos está en 3FN (Tercera Forma Normal). Al separar Users, Projects y Tasks en tablas distintas y conectarlas por IDs foráneos, se evita la redundancia de dato]
- **Índices**: [TypeORM crea índices automáticamente en las PrimaryGeneratedColumn (id) y en las columnas marcadas como @Column({ unique: true }) (como email en la entidad User), asegurando búsquedas rápidas]
- **Relaciones**:
      - Dueño (1:N): User (1) -> Project (N). Un usuario tiene muchos proyectos.
      - Colaboradores (M:N): User (M) <-> Project (N). Se usa @ManyToMany con una tabla de unión (project_collaborators_users) para permitir que muchos usuarios colaboren en muchos proyectos.
      - Tareas (1:N): Project (1) -> Task (N). Un proyecto tiene muchas tareas.
      - Asignado (1:N): User (1) -> Task (N). Un usuario puede tener muchas tareas asignadas.
- **IDs con UUID**: Se usó PrimaryGeneratedColumn("uuid") en lugar de IDs auto-incrementales (1, 2, 3) para prevenir ataques de enumeración (IDOR) y asegurar IDs únicos en el entorno.
---

## 🔐 Seguridad

### Implementaciones de Seguridad

- [x] **Hash de contraseñas**: Se usó bcrypt (salt 10) para hashear contraseñas en el registro y compararlas en el login.
- [x] **JWT**: Se usó jsonwebtoken. El token guarda solo el userId y se envía como Bearer Token en la cabecera Authorization.
- [ ] **Validación de inputs**: Se implementó en los Controladores (para body/params) y Servicios (lógica de negocio),
                                  arrojando una AppError que es capturada por el errorHandler.
- [x] **CORS**: Habilitado globalmente usando el middleware cors
- [x] **Headers de seguridad**: Se implementó un authMiddleware para proteger todas las rutas de negocio. Se implementó lógica de autorización
                                  granular en los servicios. Por ejemplo, checkProjectMembership asegura que solo el dueño o colaboradores puedan
                                  ver/editar tareas de un proyecto.
- [ ] **Rate limiting**: [No implementado por falta de tiempo, pero sería un siguiente paso crucial para producción usando express-rate-limit]
- Se usaron UUIDs para los IDs de las entidades para prevenir ataques de enumeración (IDOR). Toda la lógica de autorización se maneja explícitamente en la capa de Servicio
### Consideraciones Adicionales

[¿Qué otras medidas de seguridad tomaste? ¿Qué vulnerabilidades consideraste?]

---

## 🎨 Decisiones de UI/UX

### Framework/Librería de UI

**Elegí**: [Ninguna / Material-UI / Ant Design / TailwindCSS / etc.]

**Razón**: [¿Por qué elegiste esto sobre otras opciones?]

### Patrones de Diseño

- **Responsive Design**: [¿Cómo lo abordaste? Mobile-first?]
- **Loading States**: [¿Cómo manejaste los estados de carga?]
- **Error Handling**: [¿Cómo muestras errores al usuario?]
- **Feedback Visual**: [Toasts, modales, etc.]

### Decisiones de UX

[Explica algunas decisiones importantes de experiencia de usuario que tomaste]

---

## 🧪 Testing

### Estrategia de Testing

**Backend:**
Se implementaron tests de integración para el flujo de Autenticación.

Se probaron los 5 escenarios clave: registro exitoso, registro duplicado (error 409), login exitoso, login fallido (error 401) y acceso a ruta protegida (/me).

Herramientas usadas: Jest (framework), Supertest (peticiones HTTP) y ts-jest (soporte TypeScript).

Se configuró un setup.ts para conectar y desconectar la BD en los tests, y un beforeEach para limpiar la tabla de usuarios.

**Frontend:**
- [Tipo de tests que escribiste]
- [¿Qué componentes decidiste probar y por qué?]
- [Herramientas usadas]

### Cobertura

- **Backend**: [5 tests]
- **Frontend**: [X%]

[¿Por qué decidiste este nivel de cobertura dado el tiempo disponible?]

---

## 🐳 Docker

### Implementación

- [ ] Dockerfile backend
- [ ] Dockerfile frontend
- [x] docker-compose.yml

Se usó docker-compose para orquestar los servicios de mysql:8.0 y phpmyadmin.
Esto garantiza un entorno de base de datos limpio, aislado y 100% reproducible, facilitando la corrección de la prueba.
Se configuraron usuarios (root y uno no-privilegiado user) y volúmenes (mysql_data) para persistencia.

**Decisiones:**
- [¿Por qué elegiste Alpine/Debian como base?]
- [¿Usaste multi-stage builds? ¿Por qué?]
- [¿Cómo optimizaste el tamaño de las imágenes?]

Por ahora, solo se usó docker-compose para los servicios de MySQL y phpMyAdmin

---

## ⚡ Optimizaciones

### Backend

- Uso de Promise.all en el dashboard.service.ts para ejecutar todas las consultas de conteo (COUNT) en paralelo, mejorando la velocidad de respuesta del endpoint de estadísticas
- Uso del QueryBuilder de TypeORM para crear consultas de filtro dinámicas y eficientes, evitando traer datos innecesarios de la BD
- [etc.]

### Frontend

- [Optimización 1]
- [Optimización 2]
- [etc.]

---

## 🚧 Desafíos y Soluciones

### Desafío 1: [Nombre del desafío]

**Problema:**
[Describe el problema que enfrentaste]

**Solución:**
[Cómo lo resolviste]

**Aprendizaje:**
[Qué aprendiste de esto]

### Desafío 2: [Nombre del desafío]

**Problema:**
[Descripción]

**Solución:**
[Tu solución]

**Aprendizaje:**
[Qué aprendiste]

### Desafío 3: [Nombre del desafío]

**Problema:**
[Descripción]

**Solución:**
[Tu solución]

**Aprendizaje:**
[Qué aprendiste]

---

## 🎯 Trade-offs

### Trade-off 1: [Decisión]

**Opciones consideradas:**
Usar synchronize: true de TypeORM
- Opción A: [Usar Migraciones - lento para desarrollo.]
- Opción B: [Usar synchronize: true - rapido para desarrollo]

**Elegí**: [Opción B]

**Razón:**
prioricé la velocidad de desarrollo. synchronize: true es ideal para un prototipo/prueba técnica, ya que la BD se actualiza sola con cada cambio en las entidades.
Sacrificio: No es seguro para producción (riesgo de pérdida de datos). Para producción, esta opción se deshabilitaría y se usaría el sistema de Migraciones

### Trade-off 2: [Decisión]

**Opciones consideradas:**
- [...]

**Elegí**: [...]

**Razón:**
[...]

---

## 🔮 Mejoras Futuras

Si tuviera más tiempo, implementaría:

1. **[Mejora 1]**
   - Descripción: [En el back implementaria la validación express-validator]
   - Beneficio: [Me asegura que puedo validar bien los datos en las peticiones HTTP ]
   - Tiempo estimado: aprox 2h, considerando pruebas para este proyecto.

2. **[Mejora 2]**
   - Descripción: Integración de ESLint + Prettier para estandarizar y corregir automáticamente el código
   - Beneficio: Asegura un estilo de código uniforme en toda la base, previene bugs antes de llegar a producción. Facilita el mantenimiento y la colaboración en equipo.
     Aumenta la calidad global del proyecto y profesionaliza el repositorio.
   - Tiempo estimado: 30-40 min

3. **[Mejora 3]**
   - Descripción: [...]
   - Beneficio: [...]
   - Tiempo estimado: [...]

---

## 📚 Recursos Consultados

Lista de recursos que consultaste durante el desarrollo:

- [Documentación oficial de TypeORM]
- [Documentación de swagger para generar automaticamente la API]

- [etc.]

---

## 🤔 Reflexión Final

### ¿Qué salió bien?

[Reflexiona sobre qué aspectos del proyecto consideras que hiciste particularmente bien]

### ¿Qué mejorarías?

[Con más tiempo o conocimiento, ¿qué harías diferente?]

### ¿Qué aprendiste?

[¿Qué nuevas habilidades o conocimientos adquiriste durante este proyecto?]

---

## 📸 Capturas de Pantalla

[Opcional: Agrega capturas de pantalla de tu aplicación]

### Login
![Login](./screenshots/login.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Lista de Proyectos
![Projects](./screenshots/projects.png)

### Detalle de Tareas
![Tasks](./screenshots/tasks.png)

---

**Fecha de última actualización**: [DD/MM/YYYY]
