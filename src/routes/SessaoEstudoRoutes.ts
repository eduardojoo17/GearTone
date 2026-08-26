import { Router } from "express";
import { SessaoEstudoController } from "../controllers/SessaoEstudoController.js";

const router = Router();
const sessaoEstudoController = new SessaoEstudoController();

router.post("/", sessaoEstudoController.criar);
// Aceita ?musicaId=uuid e ?instrumentoId=uuid
router.get("/", sessaoEstudoController.listar);
router.get("/:id", sessaoEstudoController.buscar);
router.put("/:id", sessaoEstudoController.atualizar);
router.delete("/:id", sessaoEstudoController.remover);

export const sessaoEstudoRoutes = router;
