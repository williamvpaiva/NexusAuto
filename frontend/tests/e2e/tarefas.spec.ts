import { test, expect } from '@playwright/test';

test.describe('CRUD de Tarefas', () => {
  // Configurando a API mockada se o backend não estiver rodando ou usando DB de teste
  // O teste interage com a página completa e depende do frontend/backend
  
  test.beforeEach(async ({ page }) => {
    // Fazemos login simulado para contornar a ProtectedRoute, caso seja guardado localmente
    await page.evaluate(() => {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Admin', email: 'admin@test.com' }));
    });
    
    // Interceptar a API mockando se necessário, mas como é E2E, podemos testar com o banco real
    // Mas para isolamento, mockamos a API:
    await page.route('**/api/v1/crud-tarefas-test*', async route => {
      const method = route.request().method();
      
      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [
              { id: '1', title: 'Tarefa E2E Inicial', description: 'Desc Inicial', completed: false }
            ]
          })
        });
      } else if (method === 'POST') {
        const postData = JSON.parse(route.request().postData() || '{}');
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: '2',
              title: postData.title,
              description: postData.description,
              completed: postData.completed
            }
          })
        });
      } else if (method === 'PUT') {
        const postData = JSON.parse(route.request().postData() || '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: '1',
              title: postData.title || 'Editada',
              description: postData.description,
              completed: postData.completed
            }
          })
        });
      } else if (method === 'DELETE') {
        await route.fulfill({
          status: 204,
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/tarefas');
  });

  test('Teste de Listagem', async ({ page }) => {
    await expect(page.locator('text=Gerenciamento de Tarefas')).toBeVisible();
    await expect(page.locator('text=Tarefa E2E Inicial')).toBeVisible();
  });

  test('Teste de Criação', async ({ page }) => {
    await page.click('button:has-text("Nova Tarefa")');
    
    await expect(page.locator('text=Nova Tarefa').nth(1)).toBeVisible(); // header of form
    
    await page.fill('input[name="title"]', 'Nova Tarefa via Playwright');
    await page.fill('textarea[name="description"]', 'Descrição do teste automatizado');
    
    await page.click('button:has-text("Salvar")');

    // Como mockamos o POST, ele tentará salvar
    // O React Query chamaria invalidation, que engatilharia um novo GET.
    // Vamos apenas checar se a UI emitiu o toast e se voltou pra lista.
    await expect(page.locator('text=Tarefa criada com sucesso!')).toBeVisible();
  });

  test('Teste de Edição', async ({ page }) => {
    // Clica no primeiro botão de editar
    await page.click('button:has-text("Editar")');
    
    await page.fill('input[name="title"]', 'Tarefa Editada');
    await page.click('button:has-text("Salvar")');

    await expect(page.locator('text=Tarefa atualizada com sucesso!')).toBeVisible();
  });

  test('Teste de Exclusão', async ({ page }) => {
    await page.click('button:has-text("Excluir")');
    
    // Aparece o modal
    await expect(page.locator('text=Tem certeza que deseja excluir esta tarefa?')).toBeVisible();
    
    await page.click('button:has-text("Confirmar")');
    
    await expect(page.locator('text=Tarefa excluída com sucesso!')).toBeVisible();
  });
});
