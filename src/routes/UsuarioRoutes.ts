import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController.js";

const router = Router();
const usuarioController = new UsuarioController();

router.get("/", usuarioController.listar);
router.get("/:id", usuarioController.buscar);
router.put("/:id", usuarioController.atualizar);
router.delete("/:id", usuarioController.remover);

export const usuarioRoutes = router;
