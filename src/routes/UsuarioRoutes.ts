import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController.js";
import { somenteAdmin } from "../middleware/authMiddleware.js";

const router = Router();
const usuarioController = new UsuarioController();

// RNF02 - a lista completa de usuários é restrita ao administrador
router.get("/", somenteAdmin, usuarioController.listar);

router.get("/perfil", usuarioController.perfil);
router.get("/:id", usuarioController.buscar);
router.put("/:id", usuarioController.atualizar);
router.delete("/:id", usuarioController.remover);

export const usuarioRoutes = router;
