# api-designer

## Purpose

Design de APIs RESTful e GraphQL para AI Factory. Esta skill cria contratos de API bem definidos, documentação OpenAPI/Swagger, padrões de versionamento, estratégias de autenticação, e guidelines de design de endpoints. Especializada em API-first development.

## When to Use This Skill

This skill should be used when:
- User needs to design REST or GraphQL APIs
- User wants to create OpenAPI/Swagger specifications
- User needs to establish API versioning strategy
- User wants to design authentication and authorization for APIs
- User needs to create API documentation
- User wants to establish API design guidelines and standards
- User needs to design API rate limiting and throttling

## Core Capabilities

1. **REST API Design** - Resource-oriented endpoint design
2. **GraphQL Schema Design** - Type definitions and resolvers
3. **OpenAPI Specification** - API documentation and contracts
4. **Authentication Design** - JWT, OAuth2, API keys
5. **Versioning Strategy** - URL, header, or query parameter versioning
6. **Error Handling** - Standardized error responses
7. **Rate Limiting** - Throttling and quota management

## REST API Design Principles

### Resource Naming
```
✅ Good Practices:
GET    /api/v1/users              # List users
POST   /api/v1/users              # Create user
GET    /api/v1/users/{id}         # Get user by ID
PUT    /api/v1/users/{id}         # Update user (full)
PATCH  /api/v1/users/{id}         # Update user (partial)
DELETE /api/v1/users/{id}         # Delete user

GET    /api/v1/users/{id}/campaigns          # User's campaigns
POST   /api/v1/users/{id}/campaigns          # Create campaign for user
GET    /api/v1/campaigns/{id}/metrics        # Campaign metrics

❌ Bad Practices:
GET    /api/v1/getUsers          # No verbs in endpoints
POST   /api/v1/createUser        # Action in endpoint
GET    /api/v1/userById/123      # ID in path, not parameter
```

### HTTP Methods Semantics
```
GET: Retrieve resource(s) - Safe, idempotent, cacheable
POST: Create resource - Not safe, not idempotent, not cacheable
PUT: Replace resource - Not safe, idempotent, not cacheable
PATCH: Partial update - Not safe, not idempotent, not cacheable
DELETE: Remove resource - Not safe, idempotent, not cacheable
```

### HTTP Status Codes
```
2xx Success:
200 OK - Request successful
201 Created - Resource created
204 No Content - Success, no response body

3xx Redirection:
301 Moved Permanently - Resource moved
304 Not Modified - Cached version valid

4xx Client Errors:
400 Bad Request - Invalid input
401 Unauthorized - Authentication required
403 Forbidden - Insufficient permissions
404 Not Found - Resource doesn't exist
409 Conflict - Resource conflict (duplicate)
422 Unprocessable Entity - Validation error
429 Too Many Requests - Rate limit exceeded

5xx Server Errors:
500 Internal Server Error - Generic server error
502 Bad Gateway - Upstream service error
503 Service Unavailable - Temporary unavailability
504 Gateway Timeout - Upstream timeout
```

## OpenAPI Specification Template

```yaml
openapi: 3.0.3
info:
  title: Polymarketing API
  description: API para gerenciamento de campanhas de marketing
  version: 1.0.0
  contact:
    name: API Support
    email: support@polymarketing.com

servers:
  - url: https://api.polymarketing.com/v1
    description: Production
  - url: https://staging-api.polymarketing.com/v1
    description: Staging
  - url: http://localhost:3000/api/v1
    description: Local development

tags:
  - name: Users
    description: User management
  - name: Campaigns
    description: Campaign management
  - name: Analytics
    description: Analytics and reporting

paths:
  /users:
    get:
      tags:
        - Users
      summary: List all users
      description: Returns paginated list of users
      operationId: listUsers
      parameters:
        - name: page
          in: query
          description: Page number
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          description: Items per page
          schema:
            type: integer
            default: 20
            maximum: 100
        - name: sort
          in: query
          description: Sort field
          schema:
            type: string
            enum: [name, email, created_at]
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserList'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '429':
          $ref: '#/components/responses/RateLimitExceeded'
      security:
        - bearerAuth: []

    post:
      tags:
        - Users
      summary: Create a new user
      operationId: createUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: User created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
      security:
        - bearerAuth: []

  /users/{userId}:
    get:
      tags:
        - Users
      summary: Get user by ID
      operationId: getUserById
      parameters:
        - name: userId
          in: path
          required: true
          description: User ID
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          $ref: '#/components/responses/NotFound'
      security:
        - bearerAuth: []

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token obtained from /auth/login endpoint

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
        role:
          type: string
          enum: [admin, manager, viewer]
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    CreateUserRequest:
      type: object
      required:
        - email
        - name
        - password
      properties:
        email:
          type: string
          format: email
        name:
          type: string
          minLength: 2
          maxLength: 100
        password:
          type: string
          minLength: 8
        role:
          type: string
          enum: [admin, manager, viewer]
          default: viewer

    UserList:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/User'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        totalPages:
          type: integer

  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    RateLimitExceeded:
      description: Rate limit exceeded
      headers:
        X-RateLimit-Limit:
          schema:
            type: integer
          description: Request limit per window
        X-RateLimit-Remaining:
          schema:
            type: integer
          description: Remaining requests
        X-RateLimit-Reset:
          schema:
            type: integer
          description: Unix timestamp for reset
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    Error:
      type: object
      properties:
        error:
          type: string
        message:
          type: string
        code:
          type: string
        details:
          type: object
```

## API Versioning Strategies

### URL Versioning (Recommended)
```
GET /api/v1/users
GET /api/v2/users

Pros: Clear, explicit, easy to cache
Cons: URL changes, not RESTful purist
```

### Header Versioning
```
GET /api/users
Accept-Version: v2

Pros: Clean URLs, RESTful
Cons: Less visible, harder to test in browser
```

### Query Parameter Versioning
```
GET /api/users?version=2

Pros: Easy to implement, visible
Cons: Can be cached incorrectly, less explicit
```

## Authentication Patterns

### JWT Authentication Flow
```
1. Client sends credentials to /auth/login
2. Server validates and returns JWT token
3. Client stores token (localStorage, secure cookie)
4. Client includes token in Authorization header
5. Server validates token on each request

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### JWT Token Structure
```json
{
  "sub": "user-123",
  "email": "user@example.com",
  "role": "manager",
  "iat": 1625097600,
  "exp": 1625184000,
  "iss": "polymarketing-api",
  "aud": "polymarketing-client"
}
```

### OAuth2 Flows
```
Authorization Code Flow (for web apps):
1. Redirect to OAuth provider
2. User authorizes
3. Provider redirects back with code
4. Exchange code for access token
5. Use access token for API calls

Client Credentials Flow (for service-to-service):
1. Client sends client_id and client_secret
2. Server returns access token
3. Use access token for API calls
```

## Error Response Standard

```json
{
  "error": "ValidationError",
  "message": "Invalid input data",
  "code": "ERR_VALIDATION_001",
  "details": {
    "field": "email",
    "reason": "Invalid email format",
    "value": "not-an-email"
  },
  "timestamp": "2026-07-02T16:00:00Z",
  "path": "/api/v1/users",
  "requestId": "req_abc123"
}
```

## Rate Limiting Strategies

### Fixed Window
```
Limit: 100 requests per minute
Window: 00:00 - 00:59

Simple but allows burst at window boundaries
```

### Sliding Window
```
Limit: 100 requests per rolling minute
More accurate, prevents boundary bursts
```

### Token Bucket
```
Bucket capacity: 100 tokens
Refill rate: 10 tokens/second
Allows bursting up to capacity
```

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1625097660
Retry-After: 60
```

## API Documentation Guidelines

### Endpoint Documentation
```markdown
## GET /api/v1/campaigns

### Description
Returns paginated list of marketing campaigns

### Authentication
Required: Bearer token with `campaigns:read` scope

### Query Parameters
| Name | Type | Default | Description |
|------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 20 | Items per page (max 100) |
| status | string | - | Filter by status (active, paused, completed) |
| sort | string | -created_at | Sort field |

### Response
**Status:** 200 OK
**Content-Type:** application/json

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Error Responses
- 401: Unauthorized - Invalid or missing token
- 403: Forbidden - Insufficient permissions
- 429: Too Many Requests - Rate limit exceeded
```

## Workflow

### API Design Workflow
1. **Requirements Analysis** (2-3 hours)
   - Review user stories
   - Identify resources and operations
   - Define use cases

2. **Resource Modeling** (2-4 hours)
   - Identify entities and relationships
   - Design resource hierarchy
   - Define CRUD operations

3. **Endpoint Design** (3-5 hours)
   - Design URL structure
   - Define HTTP methods
   - Specify request/response schemas

4. **Authentication Design** (1-2 hours)
   - Select authentication method
   - Define authorization model
   - Document security requirements

5. **OpenAPI Specification** (4-6 hours)
   - Write OpenAPI YAML/JSON
   - Add descriptions and examples
   - Define error responses

6. **Review and Validation** (2-3 hours)
   - Team review
   - Validate with frontend team
   - Create mock server for testing

## Quality Standards

**API Design:**
- RESTful principles followed
- Consistent naming conventions
- Proper HTTP method usage
- Clear resource hierarchy
- Versioning strategy defined

**Documentation:**
- OpenAPI 3.0+ specification
- All endpoints documented
- Request/response examples
- Error codes documented
- Authentication requirements clear

**Security:**
- Authentication required for all endpoints
- Authorization based on roles/scopes
- Input validation on all parameters
- Rate limiting implemented
- HTTPS enforced

## Error Handling

### Inconsistent API Design
If API design is inconsistent:
```
⚠️  Inconsistent API design detected

Issues:
- Mixed naming: /users vs /getAllCampaigns
- Inconsistent IDs: user_id vs campaignId
- Mixed date formats: ISO vs Unix timestamp

Recommended standards:
- Use kebab-case: /user-profiles
- Use camelCase in JSON: userId
- Use ISO 8601 for dates: 2026-07-02T16:00:00Z

Would you like to:
1. Apply consistent naming automatically
2. Review and choose conventions
3. Document exceptions
```

### Missing Error Handling
If error responses are not defined:
```
⚠️  Error handling not defined for endpoints

Missing:
□ 400 Bad Request response schema
□ 401 Unauthorized response
□ 404 Not Found response
□ 422 Validation error details
□ 500 Server error handling

Proper error handling is critical for API consumers.

Would you like to:
1. Add standard error responses
2. Define custom error codes
3. Create error handling middleware
```

## References

- **OpenAPI Specification**: https://swagger.io/specification/
- **REST API Guidelines**: https://restfulapi.net/
- **API Design Best Practices**: Microsoft REST API Guidelines
- **JSON:API Specification**: https://jsonapi.org/

## Examples

### Complete API Endpoint
```typescript
// POST /api/v1/campaigns
// Create a new marketing campaign

// Request
{
  "name": "Summer Sale 2026",
  "platform": "google_ads",
  "budget": {
    "amount": 5000,
    "currency": "BRL"
  },
  "schedule": {
    "startDate": "2026-07-01",
    "endDate": "2026-08-31"
  },
  "targeting": {
    "locations": ["BR"],
    "ageRange": {
      "min": 25,
      "max": 54
    },
    "interests": ["marketing", "advertising"]
  }
}

// Response (201 Created)
{
  "id": "camp_abc123",
  "name": "Summer Sale 2026",
  "platform": "google_ads",
  "status": "draft",
  "budget": {
    "amount": 5000,
    "currency": "BRL"
  },
  "schedule": {
    "startDate": "2026-07-01",
    "endDate": "2026-08-31"
  },
  "targeting": {
    "locations": ["BR"],
    "ageRange": {
      "min": 25,
      "max": 54
    },
    "interests": ["marketing", "advertising"]
  },
  "createdAt": "2026-07-02T16:00:00Z",
  "updatedAt": "2026-07-02T16:00:00Z"
}

// Error Response (422 Unprocessable Entity)
{
  "error": "ValidationError",
  "message": "Campaign validation failed",
  "code": "ERR_VALIDATION_042",
  "details": [
    {
      "field": "budget.amount",
      "reason": "Must be at least 100",
      "value": 50
    },
    {
      "field": "schedule.endDate",
      "reason": "Must be after start date",
      "value": "2026-06-01"
    }
  ]
}
```