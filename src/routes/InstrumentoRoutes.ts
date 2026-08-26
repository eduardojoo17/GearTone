import { Router } from "express";
import { InstrumentoController } from "../controllers/InstrumentoController.js";

const router = Router();
const instrumentoController = new InstrumentoController();

router.post("/", instrumentoController.criar);
router.get("/", instrumentoController.listar);
router.get("/:id", instrumentoController.buscar);
router.put("/:id", instrumentoController.atualizar);

// RF05/UC04 - histórico de status
router.patch("/:id/status", instrumentoController.alterarStatus);
// RF03/UC02 e RF04/UC03 - favorito e instrumento em uso
router.patch("/:id/favorito", instrumentoController.definirFavorito);
router.patch("/:id/atual", instrumentoController.definirAtual);

router.delete("/:id", instrumentoController.remover);

export const instrumentoRoutes = router;
