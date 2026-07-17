import request from 'supertest';
import fs from 'fs';
import path from 'path';
import app from '../../app';

// Caminho do arquivo de integração para garantir a limpeza
const jsonFilePath = path.resolve(__dirname, '../../../receitas_integracao.json');

// Helper para garantir que os dados comecem limpos a cada teste
const limparDados = () => {
  if (fs.existsSync(jsonFilePath)) {
    fs.unlinkSync(jsonFilePath);
  }
};

beforeEach(() => {
  limparDados();
});

afterAll(() => {
  limparDados();
});

describe('Testes de Integração — API de Receitas', () => {
  
  // a) GET /api/receitas — lista vazia retorna 200 com dados []
  it('should return 200 and an empty array when there are no recipes', async () => {
    const response = await request(app)
      .get('/api/receitas');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  // b) GET /api/receitas — com 2 receitas criadas, retorna toHaveLength(2)
  it('should return 200 and a list with 2 recipes', async () => {
    await request(app)
      .post('/api/receitas')
      .set('Content-Type', 'application/json')
      .send({ titulo: 'Bolo de Cenoura', ingredientes: 'Cenoura, Açúcar', instrucoes: 'Asse' });

    await request(app)
      .post('/api/receitas')
      .set('Content-Type', 'application/json')
      .send({ titulo: 'Brigadeiro', ingredientes: 'Chocolate, Leite condensado', instrucoes: 'Mexa' });

    const response = await request(app).get('/api/receitas');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  // c) GET /api/receitas?q=bolo — filtra por titulo
  it('should filter recipes by title query param', async () => {
    await request(app)
      .post('/api/receitas')
      .set('Content-Type', 'application/json')
      .send({ titulo: 'Bolo de Fubá', ingredientes: 'Fubá', instrucoes: 'Asse' });

    await request(app)
      .post('/api/receitas')
      .set('Content-Type', 'application/json')
      .send({ titulo: 'Torta de Limão', ingredientes: 'Limão', instrucoes: 'Gele' });

    const response = await request(app).get('/api/receitas?q=bolo');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].titulo).toContain('Bolo');
  });

  // d) POST /api/receitas — cria com 201, verifica titulo e id
  it('should create a recipe with 201 and return title and id', async () => {
    const novaReceita = { titulo: 'Panqueca', ingredientes: 'Ovos, Farinha', instrucoes: 'Frite' };
    
    const response = await request(app)
      .post('/api/receitas')
      .set('Content-Type', 'application/json')
      .send(novaReceita);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.titulo).toBe(novaReceita.titulo);
  });

  // e) POST com titulo vazio — retorna 400 com sucesso false
  it('should return 400 and success false when title is empty', async () => {
    const response = await request(app)
      .post('/api/receitas')
      .set('Content-Type', 'application/json')
      .send({ titulo: '', ingredientes: 'Teste', instrucoes: 'Teste' });

    expect(response.status).toBe(400);
    expect(response.body.sucesso).toBe(false);
  });

  // f) PUT /api/receitas/1 — atualiza titulo, verifica 200
  it('should update recipe title and return 200', async () => {
    const criado = await request(app)
      .post('/api/receitas')
      .set('Content-Type', 'application/json')
      .send({ titulo: 'Suco', ingredientes: 'Fruta', instrucoes: 'Bata' });

    const id = criado.body.id;

    const response = await request(app)
      .put(`/api/receitas/${id}`)
      .set('Content-Type', 'application/json')
      .send({ titulo: 'Suco de Laranja Atualizado', ingredientes: 'Fruta', instrucoes: 'Bata' });

    expect(response.status).toBe(200);
    expect(response.body.titulo).toBe('Suco de Laranja Atualizado');
  });

  // g) PUT id 999 — retorna 404
  it('should return 404 when updating a non-existing recipe id', async () => {
    const response = await request(app)
      .put('/api/receitas/999')
      .set('Content-Type', 'application/json')
      .send({ titulo: 'Inexistente', ingredientes: 'Nenhum', instrucoes: 'Nenhuma' });

    expect(response.status).toBe(404);
  });

  // h) DELETE /api/receitas/1 — remove, verifica 200 + GET confirma lista vazia
  it('should delete the recipe, return 200, and ensure it is removed from list', async () => {
    const criado = await request(app)
      .post('/api/receitas')
      .set('Content-Type', 'application/json')
      .send({ titulo: 'Deletável', ingredientes: 'Item', instrucoes: 'Suma' });

    const id = criado.body.id;

    const deleteResponse = await request(app).delete(`/api/receitas/${id}`);
    expect(deleteResponse.status).toBe(200);

    const getResponse = await request(app).get('/api/receitas');
    expect(getResponse.body).toEqual([]);
  });

  // i) DELETE id 999 — retorna 404
  it('should return 404 when deleting a non-existing recipe id', async () => {
    const response = await request(app).delete('/api/receitas/999');
    expect(response.status).toBe(404);
  });

  // --- Desafio Bônus (Item 16) ---
  // Teste de integração para o toggle (ou adaptação de campo alterado)
  it('should toggle recipe completion/status successfully', async () => {
    const criado = await request(app)
      .post('/api/receitas')
      .set('Content-Type', 'application/json')
      .send({ titulo: 'Teste Toggle', ingredientes: 'X', instrucoes: 'Y', concluida: false });

    const id = criado.body.id;

    // Se sua rota for /api/receitas/:id/toggle ou PUT alterando a propriedade:
    const toggleResponse = await request(app)
      .put(`/api/receitas/${id}/toggle`) // ajuste o endpoint caso sua rota mude para PUT /api/receitas/:id informando concluida: true
      .set('Content-Type', 'application/json')
      .send({ concluida: true });

    expect(toggleResponse.status).toBe(200);

    const verifiqueResponse = await request(app).get('/api/receitas');
    expect(verifiqueResponse.body[0].concluida).toBe(true);
  });
});