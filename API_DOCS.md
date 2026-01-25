# Problems API Documentation

## Base URL
`/api/problems`

## Endpoints

### GET `/api/problems`
Fetch all problems.

**Response:**
```json
{
  "success": true,
  "message": "Problems fetched successfully",
  "data": [
    {
      "id": "string",
      "title": "string",
      "slug": "string",
      "difficulty": "EASY|MEDIUM|HARD",
      "statement": "string",
      "constraints": "string",
      "tags": ["string"],
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "testCases": [
        {
          "input": "string",
          "output": "string",
          "isSample": true
        }
      ]
    }
  ]
}
```

### POST `/api/problems`
Create a new problem. **Requires authentication.**

**Request Body:**
```json
{
  "title": "string (1-200 chars)",
  "slug": "string (1-100 chars, lowercase, numbers, hyphens)",
  "difficulty": "EASY|MEDIUM|HARD",
  "statement": "string",
  "constraints": "string",
  "tags": ["string"] (max 10 tags),
  "testCases": [
    {
      "input": "string",
      "output": "string",
      "isSample": "boolean"
    }
  ] (min 1 test case)
}
```

**Response:**
```json
{
  "success": true,
  "message": "Problem created successfully",
  "data": { /* full problem object */ }
}
```

### GET `/api/problems/[slug]`
Fetch a single problem by slug.

**Response:**
```json
{
  "success": true,
  "message": "Problem fetched successfully",
  "data": { /* problem object with sample test cases */ }
}
```

### PUT `/api/problems/[slug]`
Update an existing problem. **Requires authentication.**

**Request Body:** (all fields optional)
```json
{
  "title": "string",
  "slug": "string",
  "difficulty": "EASY|MEDIUM|HARD",
  "statement": "string",
  "constraints": "string",
  "tags": ["string"],
  "testCases": [
    {
      "input": "string",
      "output": "string",
      "isSample": "boolean"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Problem updated successfully",
  "data": { /* updated problem object */ }
}
```

### DELETE `/api/problems/[slug]`
Delete a problem. **Requires authentication.**

**Response:**
```json
{
  "success": true,
  "message": "Problem deleted successfully"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Only for validation errors
}
```

### HTTP Status Codes
- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (No authentication)
- `404` - Not Found (Problem doesn't exist)
- `409` - Conflict (Duplicate slug)
- `500` - Internal Server Error

## Authentication

POST, PUT, and DELETE endpoints require a valid user session. The session is automatically checked using Better Auth cookies.

## Validation

- Uses Zod schemas for request validation
- Slug must be unique and follow pattern: `^[a-z0-9-]+$`
- At least one test case is required
- Maximum 10 tags per problem
- All required fields must be present for POST