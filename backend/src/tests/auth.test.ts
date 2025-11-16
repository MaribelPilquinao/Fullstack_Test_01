import request from "supertest";
import app from "../app";
import { AppDataSource } from "../config/data-source";


describe("Auth Routes", () => {
  beforeEach(async () => {
    await AppDataSource.getRepository("User").query("DELETE FROM users");
  });

  // --- Test 1: Registro Exitoso ---
  it("debería registrar un nuevo usuario exitosamente", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      fullName: "Test User",
      password: "password123",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.email).toEqual("test@example.com");
    expect(res.body.passwordHash).toBeUndefined();
  });

  // --- Test 2: Error de Registro (Email Duplicado) ---
  it("debería fallar al registrar un email duplicado", async () => {
    await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      fullName: "Test User",
      password: "password123",
    });

    // Segundo, intentamos crearlo de nuevo
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      fullName: "Test User 2",
      password: "password456",
    });

    // Comprobamos que devuelva 409 Conflict
    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toEqual("El email ya está en uso");
  });

  // --- Test 3: Login Exitoso ---
  it("debería iniciar sesión con un usuario existente", async () => {
    await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      fullName: "Test User",
      password: "password123",
    });

    // intenta iniciar sesión
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
  });

  // --- Test 4: Error de Login (Contraseña Incorrecta) ---
  it("debería fallar al iniciar sesión con contraseña incorrecta", async () => {
    await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      fullName: "Test User",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "passwordINCORRECTA",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Credenciales inválidas");
  });

  it("debería obtener el perfil del usuario si está autenticado", async () => {
    await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      fullName: "Test User",
      password: "password123",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    const token = loginRes.body.token;


    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual("test@example.com");
  });
});