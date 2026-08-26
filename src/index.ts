import "reflect-metadata";
import express from "express";
import type { Application } from "express";
import { AppDataSource } from "./data-source.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { verificar } from "./middleware/authMiddleware.js";
import { usuarioRoutes } from "./routes/UsuarioRoutes.js";
import { authRoutes } from "./routes/AuthRoutes.js";
import { instrumentoRoutes } from "./routes/InstrumentoRoutes.js";
import { repertorioRoutes } from "./routes/RepertorioRoutes.js";
import { sessaoEstudoRoutes } from "./routes/SessaoEstudoRoutes.js";
import { dashboardRoutes } from "./routes/DashboardRoutes.js";

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Rota pública
app.use("/api/auth", authRoutes);

// RNF03 - tudo abaixo exige token
app.use("/api/usuarios", verificar, usuarioRoutes);
app.use("/api/instrumentos", verificar, instrumentoRoutes);
app.use("/api/repertorio", verificar, repertorioRoutes);
app.use("/api/sessoes", verificar, sessaoEstudoRoutes);
app.use("/api/dashboard", verificar, dashboardRoutes);

app.use(errorMiddleware);

AppDataSource.initialize()
  .then(() => {
    console.log("Banco conectado!");
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  })
  .catch((error) => console.log("Erro ao conectar no banco: ", error));
