import express from "express";
import produtoController from "../controllers/produtoController.js";

const router = express.Router();

router.get("/produtos", produtoController.getAllProducts);
router.get("/produtos/:id", produtoController.getProductById);
router.get("/busca", produtoController.buscarPorNome);
router.get("/busca/:categoria", produtoController.bucarPorCategoria);
router.get("/preco", produtoController.buscaPreco);
router.get("/categorias", produtoController.getCategorias);
router.post("/produtos", produtoController.addProduct);
router.delete("/produtos/:id", produtoController.delteProduct);

export default router;
