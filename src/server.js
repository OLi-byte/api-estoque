import express from "express";
import router from "./routes/produtoRoutes.js";
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(router);

app.listen(PORT, () => {
  console.log(`Servidos rodando na porta ${PORT}`);
});
