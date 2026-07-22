import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/config/prisma';


const { mockTarefas, prismaMock } = vi.hoisted(() => {
  const mockT: any[] = [];
  return {
    mockTarefas: mockT,
    prismaMock: {
      tarefa: {
        findMany: vi.fn().mockImplementation(() => Promise.resolve(mockT)),
        findUnique: vi.fn().mockImplementation((query) => {
          const t = mockT.find(x => x.id === query.where.id);
          return Promise.resolve(t || null);
        }),
        create: vi.fn().mockImplementation((data) => {
          const newT = { id: Math.random().toString(), ...data.data };
          mockT.push(newT);
          return Promise.resolve(newT);
        }),
        update: vi.fn().mockImplementation((query) => {
          const idx = mockT.findIndex(x => x.id === query.where.id);
          if (idx === -1) {
            const err: any = new Error('Not found');
            err.code = 'P2025';
            return Promise.reject(err);
          }
          mockT[idx] = { ...mockT[idx], ...query.data };
          return Promise.resolve(mockT[idx]);
        }),
        delete: vi.fn().mockImplementation((query) => {
          const idx = mockT.findIndex(x => x.id === query.where.id);
          if (idx === -1) {
            const err: any = new Error('Not found');
            err.code = 'P2025';
            return Promise.reject(err);
          }
          mockT.splice(idx, 1);
          return Promise.resolve(true);
        }),
        deleteMany: vi.fn().mockImplementation(() => {
          mockT.length = 0;
          return Promise.resolve(true);
        }),
      },
      $disconnect: vi.fn().mockResolvedValue(true)
    }
  };
});

vi.mock('../src/config/prisma', () => {
  return {
    prisma: prismaMock
  };
});

describe('CRUD Tarefas API', () => {
  let createdTaskId: string;

  beforeAll(async () => {
    // Limpa a tabela antes dos testes
    await prisma.tarefa.deleteMany();
  });

  afterAll(async () => {
    // Limpa a tabela depois dos testes
    await prisma.tarefa.deleteMany();
    await prisma.$disconnect();
  });

  it('deve criar uma nova tarefa (POST)', async () => {
    const res = await request(app)
      .post('/api/v1/crud-tarefas-test')
      .send({
        title: 'Tarefa de Teste V&V',
        status: 'PENDENTE'
      });

    if(res.status === 500) console.log('POST ERROR:', res.body);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Tarefa de Teste V&V');
    expect(res.body.data.status).toBe('PENDENTE');
    
    // Armazena o ID para os próximos testes
    createdTaskId = res.body.data.id;
  });

  it('deve falhar ao criar sem titulo (POST)', async () => {
    const res = await request(app)
      .post('/api/v1/crud-tarefas-test')
      .send({
        status: 'PENDENTE'
      });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('deve listar todas as tarefas (GET)', async () => {
    const res = await request(app).get('/api/v1/crud-tarefas-test');
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].title).toBe('Tarefa de Teste V&V');
  });

  it('deve obter uma tarefa pelo ID (GET)', async () => {
    const res = await request(app).get(`/api/v1/crud-tarefas-test/${createdTaskId}`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdTaskId);
    expect(res.body.data.title).toBe('Tarefa de Teste V&V');
  });

  it('deve retornar 404 para ID inexistente (GET)', async () => {
    const res = await request(app).get('/api/v1/crud-tarefas-test/id-invalido-123');
    
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('deve atualizar uma tarefa existente (PUT)', async () => {
    const res = await request(app)
      .put(`/api/v1/crud-tarefas-test/${createdTaskId}`)
      .send({
        title: 'Tarefa Atualizada',
        status: 'CONCLUIDA'
      });
      
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Tarefa Atualizada');
    expect(res.body.data.status).toBe('CONCLUIDA');
  });

  it('deve excluir uma tarefa (DELETE)', async () => {
    const res = await request(app).delete(`/api/v1/crud-tarefas-test/${createdTaskId}`);
    
    expect(res.status).toBe(204);
    
    // Verifica se realmente excluiu
    const getRes = await request(app).get(`/api/v1/crud-tarefas-test/${createdTaskId}`);
    expect(getRes.status).toBe(404);
  });
});
