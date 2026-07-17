import request from "supertest";
import app from "../../app";
import { ReceitaRepository } from "../../models/ReceitaRepository";
import { existsSync, unlinkSync } from "fs";

const ARQUIVO = "dados/receitas_integracao.json";
const repo = new ReceitaRepository(ARQUIVO);

beforeEach(async () => { await repo.salvar([]); });
afterAll(() => { if (existsSync(ARQUIVO)) unlinkSync(ARQUIVO); });

describe("GET /api/receitas", () => {

  // TODO 1: Testar lista vazia
  it("deve retornar lista vazia com status 200", async () => {
    // const res = await request(app).get("/api/receitas");
    // expect(res.status).toBe(200);
    // expect(res.body.sucesso).toBe(true);
    // expect(res.body.dados).toHaveLength(0);
  });

  // TODO 2: Testar lista com dados
  it("deve retornar receitas existentes", async () => {
    // await repo.criar("Bolo", "Bom", "30 min", null);
    // await repo.criar("Pao", "Caseiro", "2h", null);
    // const res = await request(app).get("/api/receitas");
    // expect(res.body.dados).toHaveLength(2);
    // expect(res.body.dados[0].titulo).toBe("Bolo");
  });

  // TODO 3: Testar busca com ?q=
  it("deve filtrar por titulo com query string", async () => {
    // await repo.criar("Bolo de Chocolate", "", "", null);
    // await repo.criar("Coxinha", "", "", null);
    // const res = await request(app).get("/api/receitas?q=bolo");
    // expect(res.body.dados).toHaveLength(1);
    // expect(res.body.dados[0].titulo).toBe("Bolo de Chocolate");
  });

});

describe("POST /api/receitas", () => {

  // TODO 4: Testar criar com 201
  it("deve criar receita e retornar 201", async () => {
    // const res = await request(app)
    //   .post("/api/receitas")
    //   .send({ titulo: "Brigadeiro", descricao: "Doce", tempo: "20 min" })
    //   .set("Content-Type", "application/json");
    // expect(res.status).toBe(201);
    // expect(res.body.sucesso).toBe(true);
    // expect(res.body.dados.titulo).toBe("Brigadeiro");
    // expect(res.body.dados.id).toBe(1);
  });

  // TODO 5: Testar criar com titulo vazio — 400
  it("deve retornar 400 com titulo vazio", async () => {
    // const res = await request(app)
    //   .post("/api/receitas")
    //   .send({ titulo: "" })
    //   .set("Content-Type", "application/json");
    // expect(res.status).toBe(400);
    // expect(res.body.sucesso).toBe(false);
    // expect(res.body.erro).toBeTruthy();
  });

});

describe("PUT /api/receitas/:id", () => {

  // TODO 6: Testar atualizar titulo
  it("deve atualizar titulo e retornar 200", async () => {
    // await repo.criar("Antiga", "", "", null);
    // const res = await request(app)
    //   .put("/api/receitas/1")
    //   .send({ titulo: "Nova" })
    //   .set("Content-Type", "application/json");
    // expect(res.status).toBe(200);
    // expect(res.body.dados.titulo).toBe("Nova");
  });

  // TODO 7: Testar id inexistente — 404
  it("deve retornar 404 para id inexistente", async () => {
    // const res = await request(app)
    //   .put("/api/receitas/999")
    //   .send({ titulo: "X" })
    //   .set("Content-Type", "application/json");
    // expect(res.status).toBe(404);
  });

});

describe("DELETE /api/receitas/:id", () => {

  // TODO 8: Testar remover
  it("deve remover e retornar 200", async () => {
    // await repo.criar("Teste", "", "", null);
    // const res = await request(app).delete("/api/receitas/1");
    // expect(res.status).toBe(200);
    // expect(res.body.sucesso).toBe(true);
    // // Verificar que removeu:
    // const check = await request(app).get("/api/receitas");
    // expect(check.body.dados).toHaveLength(0);
  });

  // TODO 9: Testar id inexistente — 404
  it("deve retornar 404 para id inexistente", async () => {
    // const res = await request(app).delete("/api/receitas/999");
    // expect(res.status).toBe(404);
  });

});
