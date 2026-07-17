import { Receita } from "../Receita";

describe("Receita", () => {

  // TODO 1: Testar criacao com dados corretos
  it("deve criar uma receita com os dados corretos", () => {
    // Criar: const r = new Receita(1, "Bolo", "Delicioso", "30 min");
    // Verificar: expect(r.id).toBe(1)
    // Verificar: expect(r.titulo).toBe("Bolo")
    // Verificar: expect(r.descricao).toBe("Delicioso")
    // Verificar: expect(r.tempo).toBe("30 min")
    // Verificar: expect(r.foto).toBeNull()
  });

  // TODO 2: Testar criacao com foto
  it("deve criar uma receita com foto", () => {
    // Criar: const r = new Receita(1, "Bolo", "Bom", "30 min", "/uploads/foto.jpg");
    // Verificar: expect(r.foto).toBe("/uploads/foto.jpg")
  });

  // TODO 3: Testar validar() com titulo vazio
  it("deve retornar erro quando titulo esta vazio", () => {
    // Chamar: const erros = Receita.validar({ titulo: "" });
    // Verificar: expect(erros).toContain("Titulo obrigatorio")
  });

  // TODO 4: Testar validar() com titulo curto (menos de 3 caracteres)
  it("deve retornar erro quando titulo tem menos de 3 caracteres", () => {
    // Chamar: const erros = Receita.validar({ titulo: "ab" });
    // Verificar: expect(erros).toContain("Titulo deve ter pelo menos 3 caracteres")
  });

  // TODO 5: Testar validar() com dados corretos
  it("deve retornar array vazio quando titulo e valido", () => {
    // Chamar: const erros = Receita.validar({ titulo: "Bolo de Chocolate" });
    // Verificar: expect(erros).toHaveLength(0)
  });

  // TODO 6: Testar fromJSON()
  it("deve criar instancia a partir de JSON", () => {
    // Criar: const json = { id: 5, titulo: "Pao", descricao: "Caseiro", tempo: "2h", foto: null };
    // Chamar: const r = Receita.fromJSON(json);
    // Verificar: expect(r).toBeInstanceOf(Receita)
    // Verificar: expect(r.id).toBe(5)
    // Verificar: expect(r.titulo).toBe("Pao")
  });

  // TODO 7: Testar toJSON()
  it("deve converter para JSON corretamente", () => {
    // Criar: const r = new Receita(1, "Bolo", "Bom", "30 min", "/uploads/foto.jpg");
    // Chamar: const json = r.toJSON();
    // Verificar com toEqual:
    // expect(json).toEqual({ id: 1, titulo: "Bolo", descricao: "Bom", tempo: "30 min", foto: "/uploads/foto.jpg" })
  });

  // TODO 8: Testar setter titulo vazio (deve lancar erro)
  it("deve lancar erro ao setar titulo vazio", () => {
    // Criar: const r = new Receita(1, "Bolo", "", "");
    // Verificar: expect(() => { r.titulo = ""; }).toThrow("Titulo obrigatorio")
  });

  // TODO 9: Testar setter titulo valido (deve atualizar)
  it("deve atualizar titulo com valor valido", () => {
    // Criar: const r = new Receita(1, "Antigo", "", "");
    // Alterar: r.titulo = "Novo titulo";
    // Verificar: expect(r.titulo).toBe("Novo titulo")
  });

  // TODO 10: Testar setter foto
  it("deve atualizar foto", () => {
    // Criar: const r = new Receita(1, "Bolo", "", "");
    // Verificar: expect(r.foto).toBeNull()
    // Alterar: r.foto = "/uploads/nova.jpg";
    // Verificar: expect(r.foto).toBe("/uploads/nova.jpg")
  });

});
