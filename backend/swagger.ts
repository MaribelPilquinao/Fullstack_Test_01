// Ruta: swagger.ts
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "API Plataforma Gestión de Proyectos",
    description: "Documentación de la API para la prueba técnica (autogenerada)",
    version: "1.0.0",
  },
  host: "localhost:3000",
  basePath: "/api", // Importante: todas nuestras rutas empiezan con /api
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  
  // --- AÑADE ESTO PARA LA SEGURIDAD (EL CANDADO) ---
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Ingresa tu token JWT (obtenido de /auth/login)",
      },
    },
  },
  securityDefinitions: {
     BearerAuth: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
          description: "Ingresa tu token JWT (ej: 'Bearer [token]')",
     }
  }
};

const outputFile = "./swagger-output.json";
// Apuntamos al 'index' de las rutas
const routes = ["./src/routes/index.ts"]; 

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);