import { ReceitaRepository } from "../ReceitaRepository";
import { Receita } from "../../entities/Receita";
import { existsSync, unlinkSync } from "fs";

const ARQUIVO_TESTE = "dados/receitas_teste.json";

describe("ReceitaRepository", () => {
  let repo: ReceitaRepository;

  // Antes de cada teste: repo limpo
  beforeEach(async () => {
    repo = new ReceitaRepository(ARQUIVO_TESTE);
    await repo.salvar([]);
  });

  // Depois de todos: apagar arquivo temporario
  afterAll(() => {
    if (existsSync(ARQUIVO_TESTE)) unlinkSync(ARQUIVO_TESTE);
  });

  // TODO 11: Testar criar receita
  it("deve criar uma receita e retornar com id", async () => {
    // Chamar: const r = await repo.criar("Bolo", "Delicioso", "30 min", null);
    // Verificar: expect(r).toBeInstanceOf(Receita)
    // Verificar: expect(r.id).toBe(1)
    // Verificar: expect(r.titulo).toBe("Bolo")
    // Verificar: expect(r.foto).toBeNull()
  });

  // TODO 12: Testar criar com foto
  it("deve criar uma receita com foto", async () => {
    // Chamar: const r = await repo.criar("Bolo", "Bom", "30 min", "/uploads/foto.jpg");
    // Verificar: expect(r.foto).toBe("/uploads/foto.jpg")
  });

  // TODO 13: Testar listar receitas
  it("deve listar as receitas criadas", async () => {
    // Criar 2: await repo.criar("Bolo", "", "", null); await repo.criar("Pao", "", "", null);
    // Chamar: const lista = await repo.listar();
    // Verificar: expect(lista).toHaveLength(2)
    // Verificar: expect(lista[0].titulo).toBe("Bolo")
    // Verificar: expect(lista[1].titulo).toBe("Pao")
  });

  // TODO 14: Testar buscar por id
  it("deve encontrar receita por id", async () => {
    // Criar: await repo.criar("Bolo", "Bom", "30 min", null);
    // Chamar: const r = await repo.buscarPorId(1);
    // Verificar: expect(r).toBeDefined()
    // Verificar: expect(r!.titulo).toBe("Bolo")
  });

  // TODO 15: Testar buscar id inexistente
  it("deve retornar undefined para id que nao existe", async () => {
    // Chamar: const r = await repo.buscarPorId(999);
    // Verificar: expect(r).toBeUndefined()
  });

  // TODO 16: Testar remover
  it("deve remover receita existente", async () => {
    // Criar: await repo.criar("Bolo", "", "", null);
    // Remover: const ok = await repo.remover(1);
    // Verificar: expect(ok).toBe(true)
    // Verificar: const lista = await repo.listar(); expect(lista).toHaveLength(0)
  });

  // TODO 17: Testar remover id inexistente
  it("deve retornar false ao remover id inexistente", async () => {
    // Chamar: const ok = await repo.remover(999);
    // Verificar: expect(ok).toBe(false)
  });

  // TODO 18: Testar criar com titulo vazio (deve lancar erro)
  it("deve lancar erro ao criar com titulo vazio", async () => {
    // Verificar: await expect(repo.criar("", "", "", null)).rejects.toThrow()
  });

});
