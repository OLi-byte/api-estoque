import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  async getAllProducts(req, res) {
    const produtos = await prisma.produtos.findMany();
    res.status(200).json(produtos);
  },

  async getProductById(req, res) {
    const { id } = req.params;
    const produto = await prisma.produtos.findUnique({
      where: { id: Number(id) },
    });
    res.status(200).json(produto);
  },

  async addProduct(req, res) {
    const { nome, categoria, quantidade, precoUnitario, descricao } = req.body;
    const produto = await prisma.produtos.create({
      data: { nome, categoria, quantidade, precoUnitario, descricao },
    });
    res.status(201).json(produto);
  },

  async delteProduct(req, res) {
    const { id } = req.params;
    await prisma.produtos.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Produto deletado com sucesso!" });
  },

  async buscarPorNome(req, res) {
    const { keyword } = req.query;

    const produtos = await prisma.produtos.findMany({
      where: { nome: { contains: keyword } },
    });

    if (produtos.length === 0) {
      return res.status(404).json({ message: "Nenhum produto encontrado" });
    }

    res.status(200).json(produtos);
  },

  async bucarPorCategoria(req, res) {
    const { categoria } = req.params;

    const produtos = await prisma.produtos.findMany({
      where: { categoria: categoria },
    });

    if (produtos.length === 0) {
      return res.status(404).json({ message: "Nenhum produto encontrado" });
    }

    res.status(200).json(produtos);
  },

  async getCategorias(req, res) {
    const categorias = await prisma.produtos.findMany({
      select: { categoria: true },
      distinct: ["categoria"],
    });

    const listCategorias = categorias.map((item) => item.categoria);

    res.status(200).json(listCategorias);
  },

  async buscaPreco(req, res) {
    try {
      const { precoMin, precoMax } = req.query;

      if (!precoMin || !precoMax) {
        return res.status(400).json({
          message: "Os parâmetros precoMin e precoMax são obrigatórios.",
        });
      }

      const min = parseFloat(precoMin);
      const max = parseFloat(precoMax);

      if (isNaN(min) || isNaN(max)) {
        return res
          .status(400)
          .json({ message: "precoMin e precoMax devem ser números válidos." });
      }

      const produtos = await prisma.produtos.findMany({
        where: {
          precoUnitario: {
            gt: min,
            lt: max,
          },
        },
      });

      if (produtos.length === 0) {
        return res.status(404).json({ message: "Nenhum produto encontrado" });
      }

      res.status(200).json(produtos);
    } catch (error) {
      console.error("Erro ao buscar produtos por faixa de preço:", error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  },
};
