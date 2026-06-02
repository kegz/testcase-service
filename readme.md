# Test Case Service

A microservice for managing test suites, sections, and test cases in a hierarchical structure. Built with Express, TypeScript, and MongoDB.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Development](#development)

## Overview

The Test Case Service provides a complete API for managing quality assurance test cases organized in a three-tier hierarchy:

```
Suite (Project-level container)
  └── Section (Logical grouping)
      └── Test Case (Individual test)
```

### Key Features

- **Hierarchical Organization**: Suite → Section → Test Case structure
- **Auto-generated Keys**: Unique identifiers generated from names
- **Soft Deletes**: Data preservation with `isActive` flags
- **JWT Authentication**: Secure endpoints with bearer token authentication
- **Validation**: Request validation using Joi schemas
- **Timestamps**: Automatic `createdAt` and `updatedAt` tracking

## Architecture

### Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT via `prime-qa-commons` package
- **Validation**: Joi schemas
- **Dev Tools**: ts-node-dev for hot reload

### Project Structure

```
testcase-service/
├── src/
│   ├── index.ts                 # Application entry point
│   ├── config/
│   │   └── index.ts            # Configuration & DB connection
│   ├── controllers/
│   │   ├── suite.controller.ts
│   │   ├── section.controller.ts
│   │   └── testcase.controller.ts
│   ├── models/
│   │   ├── Suite.model.ts
│   │   ├── Section.model.ts
│   │   ├── TestCase.model.ts
│   │   └── _helpers.ts
│   ├── routes/
│   │   ├── suite.routes.ts
│   │   ├── section.routes.ts
│   │   └── testcase.routes.ts
│   └── validation/
│       ├── suite.schema.ts
│       ├── section.schema.ts
│       └── testcase.schema.ts
├── package.json
├── tsconfig.json
├── Dockerfile
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** instance (local or cloud)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd testcase-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=8083
   MONGO_URI=mongodb://localhost:27017/testcase-service
   JWT_SECRET=your_super_secret_jwt_key
   ```

   **Environment Variables:**
   - `PORT` - Server port (default: 8083)
   - `MONGO_URI` - MongoDB connection string (required)
   - `JWT_SECRET` - Secret key for JWT validation (required)

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The service will start on `http://localhost:8083`

### Using Docker

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up
   ```

2. **Build Docker image only**
   ```bash
   npm run docker:build
   ```

### Production Build

```bash
# Compile TypeScript to JavaScript
npm run build

# Run the compiled application
npm start
```

### Verify Installation

Check the health endpoint:
```bash
curl http://localhost:8083/health
```

Expected response:
```json
{
  "status": "ok"
}
```

## API Endpoints

Base URL: `http://localhost:8083`

**Authentication**: All endpoints (except `/health`) require JWT Bearer token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Health Check

### GET /health

Check service health status.

**Authentication**: Not required

**Response**: `200 OK`
```json
{
  "status": "ok"
}
```

---

## Suite Endpoints

Suites are top-level containers for organizing test cases by project. Each suite automatically gets a unique key generated from its name.

### GET /suites

List all test suites, optionally filtered by project.

**Authentication**: Required

**Query Parameters**:
- `projectId` (string, optional) - Filter by MongoDB ObjectId

**Response**: `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "projectId": "507f1f77bcf86cd799439012",
    "name": "Authentication Test Suite",
    "key": "ATS",
    "description": "Test cases for authentication flows",
    "isActive": true,
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-15T10:30:00.000Z"
  }
]
```

---

### GET /suites/:id

Get a single suite by ID.

**Authentication**: Required

**Path Parameters**:
- `id` (string, required) - MongoDB ObjectId of the suite

**Response**: `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "projectId": "507f1f77bcf86cd799439012",
  "name": "Authentication Test Suite",
  "key": "ATS",
  "description": "Test cases for authentication flows",
  "isActive": true,
  "createdAt": "2026-01-15T10:30:00.000Z",
  "updatedAt": "2026-01-15T10:30:00.000Z"
}
```

**Error Responses**:
- `400` - Suite not found or invalid ID

---

### POST /suites

Create a new test suite.

**Authentication**: Required

**Request Body**:
```json
{
  "projectId": "507f1f77bcf86cd799439012",
  "name": "API Test Suite",
  "description": "Test cases for REST API endpoints"
}
```

**Input Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `projectId` | string | Yes | MongoDB ObjectId of the project |
| `name` | string | Yes | Suite name (minimum 2 characters) |
| `description` | string | No | Detailed description (can be empty or null) |

**Auto-Generated Fields**:
- `key` - Generated from name initials (e.g., "API Test Suite" → "ATS")
- `isActive` - Defaults to `true`
- `createdAt`, `updatedAt` - Timestamp fields

**Response**: `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "projectId": "507f1f77bcf86cd799439012",
  "name": "API Test Suite",
  "key": "ATS",
  "description": "Test cases for REST API endpoints",
  "isActive": true,
  "createdAt": "2026-01-20T14:30:00.000Z",
  "updatedAt": "2026-01-20T14:30:00.000Z"
}
```

**Error Responses**:
- `400` - Validation error or invalid projectId

---

### PUT /suites/:id

Update an existing suite.

**Authentication**: Required

**Path Parameters**:
- `id` (string, required) - MongoDB ObjectId of the suite

**Request Body** (all fields optional):
```json
{
  "name": "Updated Suite Name",
  "description": "Updated description",
  "isActive": true
}
```

**Input Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | New suite name (minimum 2 characters) |
| `description` | string | No | New description (can be empty or null) |
| `isActive` | boolean | No | Activate/deactivate the suite |

**Note**: `projectId` and `key` cannot be changed after creation.

**Response**: `200 OK` - Updated suite object

**Error Responses**:
- `400` - Suite not found or validation error

---

### DELETE /suites/:id

Soft delete a suite (sets `isActive` to false).

**Authentication**: Required

**Path Parameters**:
- `id` (string, required) - MongoDB ObjectId of the suite

**Response**: `200 OK` - Suite object with `isActive: false`

**Error Responses**:
- `400` - Suite not found or invalid ID

**Note**: This is a soft delete. Data remains in the database and can be reactivated by updating `isActive` to `true`.

---

## Section Endpoints

Sections are logical groupings within suites that organize test cases by feature or module. Each section automatically gets a unique key with 'SEC-' prefix.

### GET /sections/suite/:suiteId

List all sections for a specific suite.

**Authentication**: Required

**Path Parameters**:
- `suiteId` (string, required) - MongoDB ObjectId of the parent suite

**Response**: `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439021",
    "projectId": "507f1f77bcf86cd799439012",
    "suiteId": "507f1f77bcf86cd799439011",
    "name": "Login Tests",
    "key": "SEC-LT",
    "description": "Test cases for login functionality",
    "isActive": true,
    "createdAt": "2026-01-16T08:00:00.000Z",
    "updatedAt": "2026-01-16T08:00:00.000Z"
  }
]
```

**Error Responses**:
- `400` - Invalid suiteId format

---

### GET /sections/:id

Get a single section by ID.

**Authentication**: Required

**Path Parameters**:
- `id` (string, required) - MongoDB ObjectId of the section

**Response**: `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "projectId": "507f1f77bcf86cd799439012",
  "suiteId": "507f1f77bcf86cd799439011",
  "name": "Login Tests",
  "key": "SEC-LT",
  "description": "Test cases for login functionality",
  "isActive": true,
  "createdAt": "2026-01-16T08:00:00.000Z",
  "updatedAt": "2026-01-16T08:00:00.000Z"
}
```

**Error Responses**:
- `400` - Section not found or invalid ID

---

### POST /sections

Create a new section within a suite.

**Authentication**: Required

**Request Body**:
```json
{
  "suiteId": "507f1f77bcf86cd799439011",
  "name": "Login Tests",
  "description": "Test cases for user login functionality"
}
```

**Input Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `suiteId` | string | Yes | MongoDB ObjectId of the parent suite (must exist) |
| `name` | string | Yes | Section name (minimum 2 characters) |
| `description` | string | No | Detailed description (can be empty or null) |

**Auto-Generated Fields**:
- `key` - Generated as "SEC-" + name initials (e.g., "Login Tests" → "SEC-LT")
- `projectId` - Automatically inherited from parent suite
- `isActive` - Defaults to `true`
- `createdAt`, `updatedAt` - Timestamp fields

**Response**: `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "projectId": "507f1f77bcf86cd799439012",
  "suiteId": "507f1f77bcf86cd799439011",
  "name": "Login Tests",
  "key": "SEC-LT",
  "description": "Test cases for user login functionality",
  "isActive": true,
  "createdAt": "2026-01-20T14:30:00.000Z",
  "updatedAt": "2026-01-20T14:30:00.000Z"
}
```

**Error Responses**:
- `400` - Invalid suiteId or suite not found

---

### PUT /sections/:id

Update an existing section.

**Authentication**: Required

**Path Parameters**:
- `id` (string, required) - MongoDB ObjectId of the section

**Request Body** (all fields optional):
```json
{
  "name": "Updated Section Name",
  "description": "Updated description",
  "isActive": true
}
```

**Input Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | New section name (minimum 2 characters) |
| `description` | string | No | New description (can be empty or null) |
| `isActive` | boolean | No | Activate/deactivate the section |

**Note**: `suiteId`, `projectId`, and `key` cannot be changed after creation.

**Response**: `200 OK` - Updated section object

**Error Responses**:
- `400` - Section not found or validation error

---

### DELETE /sections/:id

Soft delete a section (sets `isActive` to false).

**Authentication**: Required

**Path Parameters**:
- `id` (string, required) - MongoDB ObjectId of the section

**Response**: `200 OK` - Section object with `isActive: false`

**Error Responses**:
- `400` - Section not found or invalid ID

**Note**: This is a soft delete. Related test cases are NOT automatically deleted.

---

## Test Case Endpoints

Test cases are detailed test scenarios with steps, expected results, and metadata like priority and type.

### GET /cases/section/:sectionId

List all test cases for a specific section.

**Authentication**: Required

**Path Parameters**:
- `sectionId` (string, required) - MongoDB ObjectId of the parent section

**Response**: `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439031",
    "projectId": "507f1f77bcf86cd799439012",
    "suiteId": "507f1f77bcf86cd799439011",
    "sectionId": "507f1f77bcf86cd799439021",
    "title": "Verify successful login with valid credentials",
    "priority": "High",
    "type": "Functional",
    "status": "Ready",
    "preconditions": "User account exists and is active",
    "steps": [
      {
        "action": "Navigate to login page",
        "expected": "Login form displayed"
      }
    ],
    "expectedResult": "User is logged in and redirected to dashboard",
    "isActive": true,
    "createdAt": "2026-01-17T10:00:00.000Z",
    "updatedAt": "2026-01-17T10:00:00.000Z"
  }
]
```

**Error Responses**:
- `400` - Invalid sectionId format

---

### GET /cases/:id

Get a single test case by ID.

**Authentication**: Required

**Path Parameters**:
- `id` (string, required) - MongoDB ObjectId of the test case

**Response**: `200 OK` - Test case object (see structure above)

**Error Responses**:
- `400` - Test case not found or invalid ID

---

### POST /cases

Create a new test case.

**Authentication**: Required

**Request Body**:
```json
{
  "title": "Verify successful login with valid credentials",
  "suiteId": "507f1f77bcf86cd799439011",
  "sectionId": "507f1f77bcf86cd799439021",
  "priority": "High",
  "type": "Functional",
  "status": "Draft",
  "preconditions": "User account exists and is active",
  "steps": [
    {
      "action": "Navigate to login page",
      "expected": "Login form is displayed",
      "data": {}
    },
    {
      "action": "Enter valid username and password",
      "expected": "Credentials are accepted",
      "data": {
        "username": "testuser@example.com",
        "password": "Test@123"
      }
    }
  ],
  "expectedResult": "User is logged in and redirected to dashboard"
}
```

**Input Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Test case title (minimum 2 characters) |
| `suiteId` | string | Yes | MongoDB ObjectId of parent suite (must exist) |
| `sectionId` | string | Yes | MongoDB ObjectId of parent section (must exist) |
| `priority` | string | No | One of: `Low`, `Medium`, `High`, `Critical` (default: `Medium`) |
| `type` | string | No | One of: `Functional`, `Regression`, `Performance`, `Security`, `Other` (default: `Functional`) |
| `status` | string | No | One of: `Draft`, `Ready`, `Deprecated` (default: `Draft`) |
| `preconditions` | string | No | Test preconditions (can be empty or null) |
| `steps` | array | No | Array of step objects (default: `[]`) |
| `expectedResult` | string | No | Overall expected result (can be empty or null) |

**Step Object Structure**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `action` | string | Yes | Step description/action to perform |
| `expected` | string | No | Expected outcome for this step |
| `data` | object | No | Test data object (can contain any key-value pairs) |

**Auto-Generated Fields**:
- `projectId` - Automatically inherited from parent section
- `isActive` - Defaults to `true`
- `createdAt`, `updatedAt` - Timestamp fields

**Validation Rules**:
- `priority` must be one of: Low, Medium, High, Critical
- `type` must be one of: Functional, Regression, Performance, Security, Other
- `status` must be one of: Draft, Ready, Deprecated
- Each step must have an `action` field

**Response**: `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439031",
  "projectId": "507f1f77bcf86cd799439012",
  "suiteId": "507f1f77bcf86cd799439011",
  "sectionId": "507f1f77bcf86cd799439021",
  "title": "Verify successful login with valid credentials",
  "priority": "High",
  "type": "Functional",
  "status": "Draft",
  "preconditions": "User account exists and is active",
  "steps": [
    {
      "action": "Navigate to login page",
      "expected": "Login form is displayed",
      "data": {}
    }
  ],
  "expectedResult": "User is logged in and redirected to dashboard",
  "isActive": true,
  "createdAt": "2026-01-20T14:30:00.000Z",
  "updatedAt": "2026-01-20T14:30:00.000Z"
}
```

**Error Responses**:
- `400` - Invalid suiteId/sectionId, entities not found, or validation error

---

### PUT /cases/:id

Update an existing test case.

**Authentication**: Required

**Path Parameters**:
- `id` (string, required) - MongoDB ObjectId of the test case

**Request Body** (all fields optional):
```json
{
  "title": "Updated test case title",
  "priority": "Critical",
  "type": "Regression",
  "status": "Ready",
  "preconditions": "Updated preconditions",
  "steps": [
    {
      "action": "New step action",
      "expected": "New expected result",
      "data": {}
    }
  ],
  "expectedResult": "Updated expected result",
  "isActive": true
}
```

**Input Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | New title (minimum 2 characters) |
| `priority` | string | No | One of: `Low`, `Medium`, `High`, `Critical` |
| `type` | string | No | One of: `Functional`, `Regression`, `Performance`, `Security`, `Other` |
| `status` | string | No | One of: `Draft`, `Ready`, `Deprecated` |
| `preconditions` | string | No | New preconditions (can be empty or null) |
| `steps` | array | No | Updated array of step objects |
| `expectedResult` | string | No | New expected result (can be empty or null) |
| `isActive` | boolean | No | Activate/deactivate the test case |

**Note**: `suiteId`, `sectionId`, and `projectId` cannot be changed after creation.

**Response**: `200 OK` - Updated test case object

**Error Responses**:
- `400` - Test case not found or validation error

---

### DELETE /cases/:id

Soft delete a test case (sets `isActive` to false).

**Authentication**: Required

**Path Parameters**:
- `id` (string, required) - MongoDB ObjectId of the test case

**Response**: `200 OK` - Test case object with `isActive: false`

**Error Responses**:
- `400` - Test case not found or invalid ID

**Note**: This is a soft delete. Data remains in the database for audit trail purposes.

---

## Data Models

### Suite Model

```typescript
{
  _id: ObjectId,              // MongoDB ID
  projectId: ObjectId,         // Reference to Project
  name: string,                // Suite name
  key: string,                 // Auto-generated unique key
  description?: string,        // Optional description
  isActive: boolean,           // Soft delete flag (default: true)
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

### Section Model

```typescript
{
  _id: ObjectId,              // MongoDB ID
  projectId: ObjectId,         // Reference to Project (inherited from Suite)
  suiteId: ObjectId,           // Reference to Suite
  name: string,                // Section name
  key: string,                 // Auto-generated unique key with "SEC-" prefix
  description?: string,        // Optional description
  isActive: boolean,           // Soft delete flag (default: true)
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

### Test Case Model

```typescript
{
  _id: ObjectId,              // MongoDB ID
  projectId: ObjectId,         // Reference to Project (inherited from Section)
  suiteId: ObjectId,           // Reference to Suite
  sectionId: ObjectId,         // Reference to Section
  title: string,               // Test case title
  priority: string,            // "Low" | "Medium" | "High" | "Critical"
  type: string,                // "Functional" | "Regression" | "Performance" | "Security" | "Other"
  status: string,              // "Draft" | "Ready" | "Deprecated"
  preconditions?: string,      // Test preconditions
  steps: Step[],               // Array of test steps
  expectedResult?: string,     // Overall expected result
  isActive: boolean,           // Soft delete flag (default: true)
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

### Step Object

```typescript
{
  action: string,              // Step action/description (required)
  expected?: string,           // Expected result for this step
  data?: object               // Test data (any key-value pairs)
}
```

---

## Development

### NPM Scripts

```bash
# Development with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm start

# Docker commands
npm run docker:build    # Build Docker image
npm run docker:compose  # Run with docker-compose

# Install dependencies (with --force flag)
npm run instal
```

### Code Structure

- **Controllers**: Handle business logic and request/response processing
- **Models**: Mongoose schemas and TypeScript interfaces
- **Routes**: Express route definitions with authentication middleware
- **Validation**: Joi schemas for request validation
- **Config**: Environment configuration and database connection

### Adding New Endpoints

1. **Create/Update Model** in `src/models/`
2. **Create Validation Schema** in `src/validation/`
3. **Create Controller** in `src/controllers/`
4. **Create Routes** in `src/routes/`
5. **Register Routes** in `src/index.ts`

### Database Indexes

Consider adding indexes for frequently queried fields:
- `suiteId` on Section and TestCase collections
- `sectionId` on TestCase collection
- `projectId` on all collections

### Authentication

The service uses JWT authentication via the `prime-qa-commons` package. The `authenticate` middleware:
- Validates JWT tokens in the `Authorization` header
- Expects format: `Bearer <token>`
- Adds user information to the request object

---

## Error Handling

All endpoints return errors in the following format:

```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad request (validation error, not found, invalid ID)
- `401` - Unauthorized (missing or invalid JWT token)

---

## Testing

### Manual Testing with cURL

```bash
# Health check
curl http://localhost:8083/health

# List all suites (requires authentication)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8083/suites

# Create a suite
curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"projectId":"507f1f77bcf86cd799439012","name":"Test Suite","description":"Description"}' \
     http://localhost:8083/suites
```

### Using Postman

Import the provided `testcase-service.postman_collection.json` file for a complete collection of all endpoints with examples.

---

## License

ISC

---

## Support

For issues or questions, please refer to the project repository or contact the development team.