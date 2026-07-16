import { describe, it, expect, afterEach } from 'vitest';
import bcrypt from 'bcryptjs';
import { usersRepository } from '../src/repositories/users.repository';
import { authService } from '../src/services/auth.service';

// ---------------------------------------------------------------------------
// Mutation Tests — Proteção Contra o Bug do Double-Bcrypt
//
// O bug anterior: users.repository.ts aplicava bcrypt.hash() no password
// recebido do auth.service.ts, que JÁ havia hasheado a senha. Isso causava
// dupla hasheamento: bcrypt(bcrypt(password)). Nenhum login funcionava.
//
// Estes testes são "guard rails": se alguém reintroduzir bcrypt no
// repositório, estes testes QUEBRAM.
// ---------------------------------------------------------------------------

describe('🔬 Mutation Guard — Password Hashing', () => {
  const emailSuffix = Date.now();

  // =========================================================================
  // INVARIANTE 1: Repository.create() NUNCA deve hashear a senha
  // =========================================================================

  it('deve armazenar a senha EXATAMENTE como recebida em create()', async () => {
    const plainPassword = 'plain-password-not-hashed-123!@#';
    const email = `mutation-create-${emailSuffix}@test.com`;

    const user = await usersRepository.create({
      name: 'Mutation Create Test',
      email,
      password: plainPassword,
    });

    expect(user.password).toBe(plainPassword);
    // Se o repositório tiver bcrypt.hash(), user.password seria algo como
    // "$2b$12$..." e a asserção falharia.

    // Verificação dupla: lê do banco e confirma que está EXATAMENTE igual
    const fromDb = await usersRepository.findByEmail(email);
    expect(fromDb).toBeDefined();
    expect(fromDb!.password).toBe(plainPassword);
  });

  // =========================================================================
  // INVARIANTE 2: Repository.update() NUNCA deve hashear a senha
  // =========================================================================

  it('deve armazenar a senha EXATAMENTE como recebida em update()', async () => {
    const originalPassword = 'original-password-123';
    const newPlainPassword = 'updated-plain-password-456!@#';
    const email = `mutation-update-${emailSuffix}@test.com`;

    const created = await usersRepository.create({
      name: 'Mutation Update Test',
      email,
      password: originalPassword,
    });

    const updated = await usersRepository.update(created.id, {
      password: newPlainPassword,
    });

    expect(updated).toBeDefined();
    expect(updated!.password).toBe(newPlainPassword);
    // Se o repositório aplicar bcrypt.hash() no update, a asserção falha

    // Verificação dupla: lê do banco
    const fromDb = await usersRepository.findByEmail(email);
    expect(fromDb!.password).toBe(newPlainPassword);
  });

  // =========================================================================
  // INVARIANTE 3: Update SEM password preserva a senha existente
  // =========================================================================

  it('deve preservar a senha existente quando update() não inclui password', async () => {
    const existingPassword = 'keep-this-password-789';
    const email = `mutation-update-no-pw-${emailSuffix}@test.com`;

    const created = await usersRepository.create({
      name: 'No Password Update',
      email,
      password: existingPassword,
    });

    // Update sem password
    const updated = await usersRepository.update(created.id, {
      name: 'Nome Atualizado',
    });

    expect(updated).toBeDefined();
    expect(updated!.password).toBe(existingPassword);
    // Password original deve ser preservado

    const fromDb = await usersRepository.findByEmail(email);
    expect(fromDb!.password).toBe(existingPassword);
  });

  // =========================================================================
  // INVARIANTE 4: authService.register() + authService.login()
  // Verifica que a cadeia completa de hashing funciona:
  //   authService hasheia → repository armazena → authService compara
  // =========================================================================

  it('authService.register + login deve funcionar (cadeia completa de hash)', async () => {
    const email = `mutation-auth-chain-${emailSuffix}@test.com`;
    const password = 'MutationChain@123';

    // Register (authService hasheia, repository salva o hash)
    const registerResponse = await authService.register(
      'Mutation Chain Test',
      email,
      password,
    );

    expect(registerResponse).toBeDefined();
    expect(registerResponse.user.email).toBe(email);

    // Login (authService busca user, bcrypt.compare)
    const loginResponse = await authService.login(email, password);
    expect(loginResponse).toBeDefined();
    expect(loginResponse.user.email).toBe(email);
    expect(loginResponse.tokens.accessToken).toBeTruthy();
  });

  // =========================================================================
  // INVARIANTE 5: Login falha com senha duplamente hasheada
  // Provando que authService.login EXIGE que o hash seja único
  // =========================================================================

  let negativeTestUserId: string | null = null;

  afterEach(async () => {
    if (negativeTestUserId) {
      await usersRepository.delete(negativeTestUserId);
      negativeTestUserId = null;
    }
  });

  it('deve falhar ao logar com senha duplamente hasheada (simula bug)', async () => {
    const email = `mutation-negative-${emailSuffix}@test.com`;
    const password = 'RealTest@123';

    // Simula o que authService faz: hasheia a senha uma vez
    const correctHash = await bcrypt.hash(password, 12);

    // Simula o que o repository faria SE tivesse o bug: re-hasheia
    const brokenHash = await bcrypt.hash(correctHash, 12);

    // Cria um user com o hash QUEBRADO (como se o bug existisse)
    const user = await usersRepository.create({
      name: 'Teste Negativo',
      email,
      password: brokenHash, // hash duplo com bug
    });

    negativeTestUserId = user.id;

    // Tenta login com a senha real — deve falhar
    await expect(
      authService.login(email, password),
    ).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });
  });
});
