import { Router, Request, Response } from "express";
import { ReceitaRepository } from "../models/ReceitaRepository";
import { upload } from "../middlewares/upload";

export const apiRoutes = Router();
const repo = new ReceitaRepository();

apiRoutes.get("/api/receitas", async (req: Request, res: Response) => {
  try {
    const receitas = await repo.listar(req.query.q?.toString());
    res.json({ sucesso: true, dados: receitas.map(r => r.toJSON()), total: receitas.length });
  } catch (e: any) { res.status(500).json({ sucesso: false, erro: e.message }); }
});

apiRoutes.post("/api/receitas", upload.single("foto"), async (req: Request, res: Response) => {
  try {
    const { titulo, descricao, tempo } = req.body;
    const foto = req.file ? `/uploads/${req.file.filename}` : null;
    const nova = await repo.criar(titulo, descricao || "", tempo || "", foto);
    res.status(201).json({ sucesso: true, dados: nova.toJSON() });
  } catch (e: any) { res.status(400).json({ sucesso: false, erro: e.message }); }
});

apiRoutes.put("/api/receitas/:id", async (req: Request, res: Response) => {
  try {
    const receita = await repo.atualizar(Number(req.params.id), req.body);
    if (!receita) { res.status(404).json({ sucesso: false, erro: "Nao encontrada" }); return; }
    res.json({ sucesso: true, dados: receita.toJSON() });
  } catch (e: any) { res.status(400).json({ sucesso: false, erro: e.message }); }
});

apiRoutes.delete("/api/receitas/:id", async (req: Request, res: Response) => {
  const removido = await repo.remover(Number(req.params.id));
  if (!removido) { res.status(404).json({ sucesso: false, erro: "Nao encontrada" }); return; }
  res.json({ sucesso: true });
});
