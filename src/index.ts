import "reflect-metadata";
import express from "express";
import type { Application } from "express";
import { AppDataSource } from "./data-source.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { verificar } from "./middleware/authMiddleware.js";
import { usuarioRoutes } from "./routes/UsuarioRoutes.js";
import { authRoutes } from "./routes/AuthRoutes.js";

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", verificar, usuarioRoutes);
app.use(errorMiddleware);

AppDataSource.initialize()
  .then(() => {
    console.log("Banco conectado!");
    app.listen(process.env.PORT, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  })
  .catch((error) => console.log("Erro ao conectar no banco: ", error));
