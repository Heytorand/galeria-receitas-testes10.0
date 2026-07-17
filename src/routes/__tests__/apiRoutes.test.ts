import request from "supertest";
import app from "../../app";
import { ReceitaRepository } from "../../models/ReceitaRepository";
import { rm } from "fs/promises";
import path from "path";

// Nome exato exigido pelo item 14 do roteiro
const ARQUIVO_INTEGRACAO = path.join(__dirname, "../../../dados/receitas_integracao.json");
let repo: ReceitaRepository;

describe("Testes de Integração — apiRoutes", () => {
  
  beforeEach(async () => {
    // Instancia o repositório apontando para o arquivo de teste isolado
    repo = new ReceitaRepository(ARQUIVO_INTEGRACAO);
    
    // Injeta a instância mockada para que as rotas do Express usem o arquivo de integração
    const repoModule = require("../../models/ReceitaRepository");
    jest.spyOn(repoModule, "ReceitaRepository").mockImplementation(() => repo);

    // Garante que cada teste comece com um ambiente limpo (dados [])
    await repo.salvar([]);
  });

  afterAll(async () => {
    // Exigência do item 14: Garante a remoção do arquivo receitas_integracao.json
    try {
      await rm(ARQUIVO_INTEGRACAO, { force: true });
    } catch {
      // Ignora caso o arquivo não tenha sido gerado
    }
    jest.restoreAllMocks();
  });

  // a) GET /api/receitas — lista vazia retorna 200 com dados []
  test("GET /api/receitas — lista vazia retorna 200 com dados []", async () => {
    const res = await request(app)
      .get("/api/receitas");

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados).toEqual([]);
    expect(res.body.total).toBe(0);
  });

  // b) GET /api/receitas — com 2 receitas criadas, retorna toHaveLength(2)
  test("GET /api/receitas — com 2 receitas criadas, retorna toHaveLength(2)", async () => {
    await repo.criar("Bolo de Chocolate", "Bolo fofinho", "40 min", null);
    await repo.criar("Salada de Frutas", "Saudável", "10 min", null);

    const res = await request(app)
      .get("/api/receitas");

    expect(res.status).toBe(200);
    expect(res.body.dados).toHaveLength(2);
    expect(res.body.total).toBe(2);
  });

  // c) GET /api/receitas?q=bolo — filtra por titulo
  test("GET /api/receitas?q=bolo — filtra por titulo", async () => {
    await repo.criar("Bolo de Cenoura", "Com cobertura", "45 min", null);
    await repo.criar("Torta de Frango", "Salgado", "50 min", null);

    const res = await request(app)
      .get("/api/receitas")
      .query({ q: "bolo" });

    expect(res.status).toBe(200);
    expect(res.body.dados).toHaveLength(1);
    expect(res.body.dados[0].titulo).toBe("Bolo de Cenoura");
  });

  // d) POST /api/receitas — cria com 201, verifica titulo e id
  test("POST /api/receitas — cria com 201, verifica titulo e id", async () => {
    const res = await request(app)
      .post("/api/receitas")
      .set("Content-Type", "application/json")
      .send({
        titulo: "Brigadeiro",
        descricao: "Doce de festa",
        tempo: "15 min"
      });

    expect(res.status).toBe(201);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.id).toBeDefined();
    expect(res.body.dados.titulo).toBe("Brigadeiro");
  });

  // e) POST com titulo vazio — retorna 400 com sucesso false
  test("POST com titulo vazio — retorna 400 com sucesso false", async () => {
    const res = await request(app)
      .post("/api/receitas")
      .set("Content-Type", "application/json")
      .send({
        titulo: "",
        descricao: "Invalida",
        tempo: "5 min"
      });

    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
    expect(res.body.erro).toBeDefined();
  });

  // f) PUT /api/receitas/1 — atualiza titulo, verifica 200
  test("PUT /api/receitas/1 — atualiza titulo, verifica 200", async () => {
    const criada = await repo.criar("Mousse", "Chocolate", "20 min", null);

    const res = await request(app)
      .put(`/api/receitas/${criada.id}`)
      .set("Content-Type", "application/json")
      .send({ titulo: "Mousse de Chocolate Belga" });

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.titulo).toBe("Mousse de Chocolate Belga");
  });

  // g) PUT id 999 — retorna 404
  test("PUT id 999 — retorna 404", async () => {
    const res = await request(app)
      .put("/api/receitas/999")
      .set("Content-Type", "application/json")
      .send({ titulo: "Inexistente" });

    expect(res.status).toBe(404);
    expect(res.body.sucesso).toBe(false);
    expect(res.body.erro).toBe("Nao encontrada");
  });

  // h) DELETE /api/receitas/1 — remove, verifica 200 + GET confirma lista vazia
  test("DELETE /api/receitas/1 — remove, verifica 200 + GET confirma lista vazia", async () => {
    const criada = await repo.criar("Deletar", "Teste", "1 min", null);

    const resDelete = await request(app)
      .delete(`/api/receitas/${criada.id}`);

    expect(resDelete.status).toBe(200);
    expect(resDelete.body.sucesso).toBe(true);

    const resGet = await request(app).get("/api/receitas");
    expect(resGet.body.dados).toEqual([]);
  });

  // i) DELETE id 999 — retorna 404
  test("DELETE id 999 — retorna 404", async () => {
    const res = await request(app)
      .delete("/api/receitas/999");

    expect(res.status).toBe(404);
    expect(res.body.sucesso).toBe(false);
    expect(res.body.erro).toBe("Nao encontrada");
  });

  // 16. DESAFIO BÔNUS — Adaptado para testar alteração de descrição diferente
  test("Desafio Bônus — POST para criar, PUT para alterar descrição e GET para confirmar alteração", async () => {
    const resPost = await request(app)
      .post("/api/receitas")
      .set("Content-Type", "application/json")
      .send({ titulo: "Escondidinho", descricao: "Gosto antigo", tempo: "40 min" });

    const id = resPost.body.dados.id;

    const resPut = await request(app)
      .put(`/api/receitas/${id}`)
      .set("Content-Type", "application/json")
      .send({ descricao: "Nova receita com muito mais queijo!" });

    expect(resPut.status).toBe(200);
    expect(resPut.body.dados.descricao).toBe("Nova receita com muito mais queijo!");

    const resGet = await request(app).get("/api/receitas");
    expect(resGet.body.dados[0].descricao).toBe("Nova receita com muito mais queijo!");
  });
});