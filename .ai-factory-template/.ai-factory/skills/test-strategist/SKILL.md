# test-strategist

## Purpose

Estratégia de testes para AI Factory. Esta skill define estratégias de teste abrangentes, cria planos de teste, desenvolve casos de teste, estabelece pirâmide de testes, e implementa testes automatizados. Especializada em TDD, testes unitários, de integração, E2E, e garantia de qualidade.

## When to Use This Skill

This skill should be used when:
- User needs to create comprehensive test strategy
- User wants to implement Test-Driven Development (TDD)
- User needs to write unit, integration, or E2E tests
- User wants to establish testing standards and best practices
- User needs to achieve code coverage targets
- User wants to set up CI/CD test pipelines
- User needs to create test documentation and reports

## Core Capabilities

1. **Test Strategy** - Define comprehensive testing approach
2. **TDD Implementation** - Red-Green-Refactor workflow
3. **Test Automation** - Unit, integration, E2E test implementation
4. **Coverage Analysis** - Track and improve code coverage
5. **Test Data Management** - Create and manage test fixtures
6. **CI/CD Integration** - Automated test pipelines
7. **Quality Metrics** - Define and track quality indicators

## Testing Pyramid

```
        /\
       /  \
      / E2E \      Few (10%)
     / Tests \     Slow, expensive
    /----------\
   /Integration\   More (30%)
  /    Tests    \  Medium speed
 /---------------\
/    Unit Tests   \ Most (60%)
------------------- Fast, cheap
```

### Unit Tests (60%)
```typescript
// Test individual functions/components in isolation
// Fast execution (<10ms per test)
// High coverage target (>80%)

describe('UserService', () => {
  it('should create user with valid data', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'SecurePass123'
    };
    
    const user = await UserService.create(userData);
    
    expect(user.id).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user.name).toBe(userData.name);
    expect(user.password).not.toBe(userData.password); // Should be hashed
  });
  
  it('should throw error for duplicate email', async () => {
    await UserService.create({
      email: 'existing@example.com',
      name: 'User',
      password: 'Pass123'
    });
    
    await expect(
      UserService.create({
        email: 'existing@example.com',
        name: 'Another User',
        password: 'Pass123'
      })
    ).rejects.toThrow('Email already exists');
  });
});
```

### Integration Tests (30%)
```typescript
// Test component interactions
// Medium speed (<100ms per test)
// Focus on critical paths

describe('Campaign API Integration', () => {
  it('should create campaign and sync with Google Ads', async () => {
    // Arrange
    const campaignData = {
      name: 'Test Campaign',
      platform: 'google_ads',
      budget: 5000
    };
    
    // Act
    const response = await request(app)
      .post('/api/v1/campaigns')
      .send(campaignData)
      .set('Authorization', `Bearer ${validToken}`);
    
    // Assert
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('active');
    
    // Verify external API was called
    expect(googleAdsMock.createCampaign).toHaveBeenCalledWith(
      expect.objectContaining(campaignData)
    );
  });
  
  it('should handle Google Ads API failure gracefully', async () => {
    googleAdsMock.createCampaign.mockRejectedValue(
      new Error('Google Ads API unavailable')
    );
    
    const response = await request(app)
      .post('/api/v1/campaigns')
      .send({ name: 'Test', platform: 'google_ads', budget: 5000 })
      .set('Authorization', `Bearer ${validToken}`);
    
    expect(response.status).toBe(503);
    expect(response.body.error).toBe('External service unavailable');
  });
});
```

### E2E Tests (10%)
```typescript
// Test complete user flows
// Slow execution (<5s per test)
// Critical user journeys only

describe('Campaign Management E2E', () => {
  it('should complete full campaign creation flow', async () => {
    // 1. Login
    await page.goto('http://localhost:5173/login');
    await page.type('#email', 'user@example.com');
    await page.type('#password', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    // 2. Navigate to campaigns
    await page.click('[data-testid="campaigns-nav"]');
    await page.waitForSelector('[data-testid="campaign-list"]');
    
    // 3. Create new campaign
    await page.click('[data-testid="create-campaign-btn"]');
    await page.type('[name="campaignName"]', 'E2E Test Campaign');
    await page.select('[name="platform"]', 'google_ads');
    await page.type('[name="budget"]', '5000');
    await page.click('[type="submit"]');
    
    // 4. Verify campaign created
    await page.waitForSelector('[data-testid="campaign-created"]');
    const campaignName = await page.$eval(
      '[data-testid="campaign-name"]',
      el => el.textContent
    );
    expect(campaignName).toBe('E2E Test Campaign');
    
    // 5. Verify campaign appears in list
    await page.click('[data-testid="campaigns-nav"]');
    const campaigns = await page.$$('[data-testid="campaign-item"]');
    expect(campaigns.length).toBeGreaterThan(0);
  });
});
```

## Test-Driven Development (TDD)

### Red-Green-Refactor Cycle
```
1. RED: Write a failing test
   - Define expected behavior
   - Run test (should fail)
   - Verify error message is clear

2. GREEN: Write minimal code to pass
   - Implement just enough to pass
   - Don't worry about quality yet
   - Run test (should pass)

3. REFACTOR: Improve code quality
   - Remove duplication
   - Improve naming
   - Apply design patterns
   - Ensure tests still pass

Repeat for each feature
```

### TDD Example
```typescript
// Step 1: RED - Write failing test
describe('DiscountCalculator', () => {
  it('should apply 10% discount for purchases over $100', () => {
    const total = DiscountCalculator.applyDiscount(150);
    expect(total).toBe(135); // 150 - 10% = 135
  });
});

// Test fails: DiscountCalculator is not defined

// Step 2: GREEN - Write minimal implementation
class DiscountCalculator {
  static applyDiscount(total: number): number {
    if (total > 100) {
      return total * 0.9;
    }
    return total;
  }
}

// Test passes

// Step 3: REFACTOR - Improve code
class DiscountCalculator {
  private static readonly DISCOUNT_THRESHOLD = 100;
  private static readonly DISCOUNT_RATE = 0.1;
  
  static applyDiscount(total: number): number {
    const hasDiscount = total > this.DISCOUNT_THRESHOLD;
    const discount = hasDiscount ? this.DISCOUNT_RATE : 0;
    return total * (1 - discount);
  }
}

// Add more tests and repeat cycle
```

## Test Coverage Strategy

### Coverage Targets
```
Overall Coverage: >80%
Critical Modules: >95%
  - Authentication
  - Payment processing
  - Data validation
  - Business logic

Minimum Acceptable: >70%

By Test Type:
- Unit Tests: >80%
- Integration Tests: Critical paths only
- E2E Tests: Key user journeys
```

### Coverage Report Example
```
=============================== Coverage Summary ===============================
File                    | Stmt % | Branch % | Func % | Lines %
------------------------|--------|----------|--------|--------
src/services/           |  92.5% |   88.3%  | 95.2%  |  93.1%
src/controllers/        |  85.7% |   76.4%  | 90.0%  |  86.2%
src/utils/              |  98.2% |   94.1%  | 100%   |  98.5%
src/middleware/         |  78.3% |   65.8%  | 85.7%  |  79.1%
------------------------|--------|----------|--------|--------
All files               |  87.4% |   81.2%  | 92.3%  |  88.1%
================================================================

Files below threshold:
- src/middleware/auth.ts (78.3% < 80%)
  Missing tests: Error handling, edge cases
```

## Test Data Management

### Test Fixtures
```typescript
// fixtures/users.ts
export const testUsers = {
  validUser: {
    email: 'test@example.com',
    name: 'Test User',
    password: 'SecurePass123',
    role: 'manager'
  },
  
  adminUser: {
    email: 'admin@example.com',
    name: 'Admin User',
    password: 'AdminPass123',
    role: 'admin'
  },
  
  invalidUser: {
    email: 'not-an-email',
    name: '',
    password: '123'
  }
};

// fixtures/campaigns.ts
export const testCampaigns = {
  validCampaign: {
    name: 'Test Campaign',
    platform: 'google_ads',
    budget: 5000,
    status: 'active'
  },
  
  expiredCampaign: {
    name: 'Expired Campaign',
    platform: 'facebook_ads',
    budget: 3000,
    status: 'completed',
    endDate: '2025-01-01'
  }
};
```

### Test Database Setup
```typescript
// test/setup.ts
import { TestDatabase } from './helpers/test-database';

let testDb: TestDatabase;

beforeAll(async () => {
  testDb = new TestDatabase();
  await testDb.initialize();
});

beforeEach(async () => {
  await testDb.clear();
  await testDb.seed();
});

afterAll(async () => {
  await testDb.cleanup();
});
```

## CI/CD Test Pipeline

### GitHub Actions Workflow
```yaml
name: Test Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run typecheck
      
      - name: Unit tests
        run: npm run test:unit
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
      
      - name: Integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
      
      - name: Coverage report
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
          fail_ci_if_error: true
          token: ${{ secrets.CODECOV_TOKEN }}
```

## Workflow

### Test Implementation Workflow
1. **Test Planning** (2-3 hours)
   - Review requirements
   - Identify test scenarios
   - Define test data needs
   - Estimate effort

2. **Test Setup** (1-2 hours)
   - Configure test framework
   - Create test database
   - Set up fixtures
   - Configure CI/CD

3. **Unit Test Implementation** (4-8 hours)
   - Write tests for business logic
   - Mock external dependencies
   - Achieve coverage targets
   - Run TDD cycles

4. **Integration Test Implementation** (3-5 hours)
   - Test component interactions
   - Test API endpoints
   - Test database operations
   - Test external services

5. **E2E Test Implementation** (4-6 hours)
   - Identify critical user journeys
   - Write browser automation tests
   - Test complete workflows
   - Validate UI/UX

6. **Test Execution & Reporting** (1-2 hours)
   - Run test suite
   - Analyze failures
   - Generate coverage report
   - Document results

## Quality Standards

**Test Quality:**
- Tests are independent and isolated
- Tests are repeatable and deterministic
- Tests have clear assertions
- Tests cover happy path and edge cases
- Tests are maintainable and readable
- Tests run fast (<10 minutes total)

**Coverage Requirements:**
- Overall: >80%
- Critical modules: >95%
- No regression in coverage
- All new code covered

**CI/CD Requirements:**
- Tests run on every commit
- Coverage report generated
- Build fails on test failure
- Coverage threshold enforced

## Error Handling

### Flaky Tests
If tests are flaky:
```
⚠️  Flaky tests detected

Tests with inconsistent results:
- UserService.should_create_user (failed 2/10 runs)
- CampaignAPI.should_sync_with_google (failed 3/10 runs)

Common causes:
- Race conditions
- Shared state between tests
- External service dependencies
- Time-based logic

Recommended actions:
1. Isolate test data
2. Mock external services
3. Use fake timers for time-based logic
4. Add proper async/await handling

Would you like to:
1. Fix flaky tests automatically
2. Quarantine flaky tests
3. Investigate root cause
```

### Low Coverage
If coverage is below target:
```
⚠️  Code coverage below target

Current: 72%
Target: 80%
Gap: 8%

Files with low coverage:
- src/services/payment.ts (65%)
- src/utils/validation.ts (58%)
- src/middleware/auth.ts (71%)

Impact:
- Increased risk of undetected bugs
- CI/CD pipeline will fail
- Release blocked

Would you like to:
1. Generate test stubs for uncovered code
2. Identify critical uncovered paths
3. Create coverage improvement plan
```

## References

- **Testing Library**: https://testing-library.com/
- **Jest Documentation**: https://jestjs.io/
- **Vitest**: https://vitest.dev/
- **Playwright**: https://playwright.dev/
- **Test-Driven Development**: Kent Beck

## Examples

### Complete Test Suite
```typescript
// tests/unit/services/UserService.test.ts
import { UserService } from '../../../src/services/UserService';
import { testUsers } from '../../fixtures/users';
import { TestDatabase } from '../../helpers/test-database';

describe('UserService', () => {
  let testDb: TestDatabase;
  
  beforeAll(async () => {
    testDb = new TestDatabase();
    await testDb.initialize();
  });
  
  beforeEach(async () => {
    await testDb.clear();
  });
  
  afterAll(async () => {
    await testDb.cleanup();
  });
  
  describe('create', () => {
    it('should create user with valid data', async () => {
      const user = await UserService.create(testUsers.validUser);
      
      expect(user.id).toBeDefined();
      expect(user.email).toBe(testUsers.validUser.email);
      expect(user.name).toBe(testUsers.validUser.name);
      expect(user.password).not.toBe(testUsers.validUser.password);
      expect(user.role).toBe('viewer'); // Default role
    });
    
    it('should hash password before saving', async () => {
      const user = await UserService.create(testUsers.validUser);
      
      // Password should be hashed (bcrypt starts with $2)
      expect(user.password).toMatch(/^\$2[aby]\$/);
    });
    
    it('should throw error for duplicate email', async () => {
      await UserService.create(testUsers.validUser);
      
      await expect(
        UserService.create(testUsers.validUser)
      ).rejects.toThrow('Email already exists');
    });
    
    it('should throw error for invalid email', async () => {
      const invalidUser = {
        ...testUsers.validUser,
        email: 'not-an-email'
      };
      
      await expect(
        UserService.create(invalidUser)
      ).rejects.toThrow('Invalid email format');
    });
  });
  
  describe('findById', () => {
    it('should return user by ID', async () => {
      const created = await UserService.create(testUsers.validUser);
      const found = await UserService.findById(created.id);
      
      expect(found).toBeDefined();
      expect(found.email).toBe(testUsers.validUser.email);
    });
    
    it('should return null for non-existent user', async () => {
      const found = await UserService.findById('non-existent-id');
      expect(found).toBeNull();
    });
  });
  
  describe('updateRole', () => {
    it('should update user role', async () => {
      const user = await UserService.create(testUsers.validUser);
      const updated = await UserService.updateRole(user.id, 'manager');
      
      expect(updated.role).toBe('manager');
    });
    
    it('should throw error for invalid role', async () => {
      const user = await UserService.create(testUsers.validUser);
      
      await expect(
        UserService.updateRole(user.id, 'invalid-role')
      ).rejects.toThrow('Invalid role');
    });
  });
});
```