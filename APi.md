# API Documentation

## Authentication Endpoints

### Base URL
```
http://localhost:3000/api
```

### 1. Sign Up

Create a new user account.

**Endpoint:** `POST /api/users/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "country": "United States",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "country": "United States"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

**Error Responses:**
- `400` - Validation error or user already exists
- `500` - Server error

---

### 2. Sign In

Authenticate an existing user.

**Endpoint:** `POST /api/users/signin`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "country": "United States"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User signed in successfully"
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Invalid email or password
- `500` - Server error

---

### 3. Student Login

Authenticate a student using their student code and password. The **coupon** (referral code) is **not** used at login; it is used only at **registration** (see Register Student). At login you only send code and password.

**Endpoint:** `POST /api/users/student/login`

**Request Body:**
```json
{
  "code": "ST1234",
  "password": "password123"
}
```

- **code**: Required. The student's own code (used to identify the account).
- **password**: Required. The student's password.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "507f1f77bcf86cd799439011",
      "name": "john_doe",
      "email": "john_doe.1234567890@student.app",
      "phone": "+1234567890",
      "country": "Unknown",
      "userType": "student",
      "username": "john_doe",
      "image": "student-20251224_131940_263340917.png",
      "birthday": "2010-05-15T00:00:00.000Z",
      "studentCode": "ST1234",
      "educationalStageId": "507f1f77bcf86cd799439012",
      "level": 10,
      "totalPoints": 0,
      "stats": {
        "numberOfExams": 5,
        "numberOfPurchasedExams": 3,
        "currentPlan": null,
        "totalPoints": 0,
        "level": 10,
        "successPercentage": 80,
        "failedPercentage": 20
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Student signed in successfully"
}
```

**Student `stats` fields:**
- **numberOfExams** – Number of exams the student has taken (exam results count).
- **numberOfPurchasedExams** – Number of exams the student has bought (approved exam purchases).
- **currentPlan** – Current approved plan purchase, or `null`.
- **totalPoints** / **level** – Student progress.
- **successPercentage** / **failedPercentage** – Pass/fail rate based on exam results.

**Error Responses:**
- `400` - Validation error (missing code or password, invalid format)
- `401` - Invalid student code or password
- `500` - Server error

---

## Using the Authentication Token

After signing up or signing in, you'll receive a JWT token. Include this token in the `Authorization` header for protected routes:

```
Authorization: Bearer <your-token-here>
```

---

## Flow Examples

This section describes complete user flows with example API calls in order.

### Challenge Flow (Student challenges a friend with random questions)

**Actors:** Student A (challenger), Student B (friend). Both must be authenticated as students (`userType: "student"`).

**Overview:**
1. Student A sends a challenge request to Student B.
2. The request is **valid for 5 minutes**. If not accepted or rejected within 5 minutes, it is automatically removed and no longer appears in incoming/outgoing lists. Accept or reject on an expired request returns `400` with message "Challenge request has expired (valid for 5 minutes)".
3. Student B sees incoming request and accepts (or rejects).
4. On accept, a challenge is created with 5 random questions; both can open the challenge and answer.
5. Each student submits answers; results show own score and opponent score (when both have submitted).

---

**Step 1 – Student A: Send challenge request**

Student A (logged in, token in `Authorization` header) sends a challenge request to Student B by `toStudentId`.

**Request:**
```http
POST /api/challenge-requests
Authorization: Bearer <student-a-token>
Content-Type: application/json

{
  "toStudentId": "<student-b-user-id>"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "req_abc123",
    "fromStudentId": "<student-a-id>",
    "toStudentId": "<student-b-id>",
    "fromStudentName": "Alice",
    "toStudentName": "Bob",
    "status": "pending",
    "createdAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "Challenge request sent"
}
```

---

**Step 2 – Student B: List incoming requests**

**Request:**
```http
GET /api/challenge-requests/incoming
Authorization: Bearer <student-b-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "req_abc123",
      "fromStudentId": "<student-a-id>",
      "toStudentId": "<student-b-id>",
      "fromStudentName": "Alice",
      "status": "pending",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "message": "Incoming requests retrieved"
}
```

---

**Step 3 – Student B: Accept the request**

**Request:**
```http
PUT /api/challenge-requests/req_abc123/accept
Authorization: Bearer <student-b-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "challengeId": "challenge_xyz789"
  },
  "message": "Challenge accepted"
}
```

Client should navigate to the challenge play screen using `challengeId` (e.g. `/challenges/play/challenge_xyz789`).

---

**Step 4 – Either student: Get challenge details**

**Request:**
```http
GET /api/challenges/challenge_xyz789
Authorization: Bearer <student-a-token OR student-b-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "challenge_xyz789",
    "challengerStudentId": "<student-a-id>",
    "challengedStudentId": "<student-b-id>",
    "challengerName": "Alice",
    "challengedName": "Bob",
    "questionIds": ["q1", "q2", "q3", "q4", "q5"],
    "status": "active",
    "createdAt": "2024-01-15T10:01:00.000Z"
  },
  "message": "Challenge retrieved"
}
```

---

**Step 5 – Either student: Get questions for the challenge (no correct answers)**

**Request:**
```http
GET /api/challenges/challenge_xyz789/questions
Authorization: Bearer <student-a-token OR student-b-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "q1",
      "type": "individual",
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "points": 10
    },
    {
      "id": "q2",
      "type": "individual",
      "question": "Capital of France?",
      "options": ["London", "Berlin", "Paris", "Madrid"],
      "points": 10
    }
  ],
  "message": "Questions retrieved"
}
```

Questions are in the same order for both students. For partial (passage) questions, each sub-question is one slot in the answers array.

---

**Step 6 – Student A (or B): Submit answers**

`answers` is an array of **option indices** (0-based) in the same order as the flattened questions (individual = one index per question; partial = one index per sub-question).

**Request:**
```http
POST /api/challenges/challenge_xyz789/submit
Authorization: Bearer <student-a-token>
Content-Type: application/json

{
  "answers": [1, 2, 0, 1, 3]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "score": 35,
    "totalPoints": 50,
    "percentage": 70,
    "myResult": { "score": 35, "totalPoints": 50 },
    "opponentResult": null
  },
  "message": "Challenge submitted"
}
```

`opponentResult` is `null` until the other student has also submitted. After both submit, a later call (or same response for the second submitter) may include:

```json
"opponentResult": { "score": 40, "totalPoints": 50 }
```

---

**Optional – Student B: Reject instead of accept**

**Request:**
```http
PUT /api/challenge-requests/req_abc123/reject
Authorization: Bearer <student-b-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Challenge rejected"
}
```

---

**Optional – List outgoing requests (Student A)**

**Request:**
```http
GET /api/challenge-requests/outgoing
Authorization: Bearer <student-a-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "req_abc123",
      "fromStudentId": "<student-a-id>",
      "toStudentId": "<student-b-id>",
      "toStudentName": "Bob",
      "status": "accepted",
      "challengeId": "challenge_xyz789",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "message": "Outgoing requests retrieved"
}
```

---

### 3. Get All Users

Get a list of all users (requires authentication).

**Endpoint:** `GET /api/users`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "country": "United States",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Users retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### 4. Get User By ID

Get a specific user by ID (requires authentication).

**Endpoint:** `GET /api/users/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "country": "United States",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - User not found
- `500` - Server error

---

### 5. Update User

Update user information (requires authentication).

**Endpoint:** `PUT /api/users/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com",
  "phone": "+1234567891",
  "country": "Canada",
  "password": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "johnupdated@example.com",
    "phone": "+1234567891",
    "country": "Canada",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  },
  "message": "User updated successfully"
}
```

**Error Responses:**
- `400` - Validation error or email/phone already taken
- `401` - Authentication required
- `404` - User not found
- `500` - Server error

---

### 6. Delete User

Delete a user (requires authentication).

**Endpoint:** `DELETE /api/users/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - User not found
- `500` - Server error

---

## Example cURL Commands

### Sign Up
```bash
curl -X POST http://localhost:3000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "country": "United States",
    "password": "password123"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:3000/api/users/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Student Login
```bash
curl -X POST http://localhost:3000/api/users/student/login \
  -H "Content-Type: application/json" \
  -d '{
    "code": "ST1234",
    "password": "password123"
  }'
```

### Get All Users
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <your-token-here>"
```

### Get User By ID
```bash
curl -X GET http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>"
```

### Update User
```bash
curl -X PUT http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "country": "Canada"
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>"
```

## Validation Rules

### Sign Up
- **name**: Required, 2-100 characters
- **email**: Required, valid email format, unique
- **phone**: Required, minimum 5 characters, unique
- **country**: Required, minimum 2 characters
- **password**: Required, minimum 6 characters

### Sign In
- **email**: Required, valid email format
- **password**: Required, minimum 6 characters

### Student Login
- **code**: Required, valid student code (minimum 2 characters, automatically converted to uppercase)
- **password**: Required, minimum 6 characters

### Student Register (POST /api/students/register)
- **Public endpoint:** no `Authorization` header; no token in request or response.
- **coupon**: Optional. A friend's student code (trimmed, uppercase). When provided and valid at registration, the owner of that code receives 50 points once (max 20 uses per code); the new student is linked as referred.

### Update User
- At least one field must be provided
- **name**: Optional, 2-100 characters
- **email**: Optional, valid email format, must be unique
- **phone**: Optional, minimum 5 characters, must be unique
- **country**: Optional, minimum 2 characters
- **password**: Optional, minimum 6 characters

---

## Country Endpoints

### 1. Get All Countries

Get a list of all countries (requires authentication).

**Endpoint:** `GET /api/countries`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "United States",
      "code": "US",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Countries retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### 2. Get Country By ID

Get a specific country by ID (requires authentication).

**Endpoint:** `GET /api/countries/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "United States",
    "code": "US",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Country retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Country not found
- `500` - Server error

---

### 3. Create Country

Create a new country (requires authentication).

**Endpoint:** `POST /api/countries`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "United States",
  "code": "US"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "United States",
    "code": "US",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Country created successfully"
}
```

**Error Responses:**
- `400` - Validation error or country already exists
- `401` - Authentication required
- `500` - Server error

---

### 4. Update Country

Update country information (requires authentication).

**Endpoint:** `PUT /api/countries/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "name": "United States of America",
  "code": "USA"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "United States of America",
    "code": "USA",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  },
  "message": "Country updated successfully"
}
```

**Error Responses:**
- `400` - Validation error or name/code already taken
- `401` - Authentication required
- `404` - Country not found
- `500` - Server error

---

### 5. Delete Country

Delete a country (requires authentication).

**Endpoint:** `DELETE /api/countries/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Country deleted successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Country not found
- `500` - Server error

---

## Example cURL Commands for Countries

### Get All Countries
```bash
curl -X GET http://localhost:3000/api/countries \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Country By ID
```bash
curl -X GET http://localhost:3000/api/countries/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>"
```

### Create Country
```bash
curl -X POST http://localhost:3000/api/countries \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "United States",
    "code": "US"
  }'
```

### Update Country
```bash
curl -X PUT http://localhost:3000/api/countries/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "United States of America"
  }'
```

### Delete Country
```bash
curl -X DELETE http://localhost:3000/api/countries/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>"
```

## Validation Rules for Countries

### Create Country
- **name**: Required, 2-100 characters, must be unique
- **code**: Required, 2-3 characters, must be unique, automatically converted to uppercase

### Update Country
- At least one field must be provided
- **name**: Optional, 2-100 characters, must be unique
- **code**: Optional, 2-3 characters, must be unique, automatically converted to uppercase

---

## City Endpoints

### 1. Get All Cities

Get a list of all cities, optionally filtered by country (requires authentication).

**Endpoint:** `GET /api/cities` or `GET /api/cities?countryId=<countryId>`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Query Parameters:**
- `countryId` (optional): Filter cities by country ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "New York",
      "countryId": "507f1f77bcf86cd799439012",
      "country": {
        "id": "507f1f77bcf86cd799439012",
        "name": "United States",
        "code": "US"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Cities retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### 2. Get Cities By Country ID

Get all cities for a specific country (requires authentication).

**Endpoint:** `GET /api/cities/country/:countryId`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "New York",
      "countryId": "507f1f77bcf86cd799439012",
      "country": {
        "id": "507f1f77bcf86cd799439012",
        "name": "United States",
        "code": "US"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Cities retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Country not found
- `500` - Server error

---

### 3. Get City By ID

Get a specific city by ID (requires authentication).

**Endpoint:** `GET /api/cities/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "New York",
    "countryId": "507f1f77bcf86cd799439012",
    "country": {
      "id": "507f1f77bcf86cd799439012",
      "name": "United States",
      "code": "US"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "City retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - City not found
- `500` - Server error

---

### 4. Create City

Create a new city (requires authentication).

**Endpoint:** `POST /api/cities`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New York",
  "countryId": "507f1f77bcf86cd799439012"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "New York",
    "countryId": "507f1f77bcf86cd799439012",
    "country": {
      "id": "507f1f77bcf86cd799439012",
      "name": "United States",
      "code": "US"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "City created successfully"
}
```

**Error Responses:**
- `400` - Validation error, country not found, or city already exists in country
- `401` - Authentication required
- `404` - Country not found
- `500` - Server error

---

### 5. Update City

Update city information (requires authentication).

**Endpoint:** `PUT /api/cities/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "name": "New York City",
  "countryId": "507f1f77bcf86cd799439012"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "New York City",
    "countryId": "507f1f77bcf86cd799439012",
    "country": {
      "id": "507f1f77bcf86cd799439012",
      "name": "United States",
      "code": "US"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  },
  "message": "City updated successfully"
}
```

**Error Responses:**
- `400` - Validation error or city name already exists in country
- `401` - Authentication required
- `404` - City or country not found
- `500` - Server error

---

### 6. Delete City

Delete a city (requires authentication).

**Endpoint:** `DELETE /api/cities/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "City deleted successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - City not found
- `500` - Server error

---

## Example cURL Commands for Cities

### Get All Cities
```bash
curl -X GET http://localhost:3000/api/cities \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Cities by Country ID (Query Parameter)
```bash
curl -X GET "http://localhost:3000/api/cities?countryId=507f1f77bcf86cd799439012" \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Cities by Country ID (Route Parameter)
```bash
curl -X GET http://localhost:3000/api/cities/country/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer <your-token-here>"
```

### Get City By ID
```bash
curl -X GET http://localhost:3000/api/cities/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>"
```

### Create City
```bash
curl -X POST http://localhost:3000/api/cities \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New York",
    "countryId": "507f1f77bcf86cd799439012"
  }'
```

### Update City
```bash
curl -X PUT http://localhost:3000/api/cities/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New York City"
  }'
```

### Delete City
```bash
curl -X DELETE http://localhost:3000/api/cities/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>"
```

## Validation Rules for Cities

### Create City
- **name**: Required, 2-100 characters, must be unique within the same country
- **countryId**: Required, valid MongoDB ObjectId, must reference an existing country

### Update City
- At least one field must be provided
- **name**: Optional, 2-100 characters, must be unique within the same country
- **countryId**: Optional, valid MongoDB ObjectId, must reference an existing country

---

## Educational Stage Endpoints

### 1. Get All Educational Stages

Get a list of all educational stages, sorted by order (requires authentication).

**Endpoint:** `GET /api/educational-stages`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "nameAr": "المرحلة الابتدائية",
      "nameEn": "Elementary School",
      "description": "Primary education for children aged 6-12",
      "order": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "nameAr": "المرحلة المتوسطة",
      "nameEn": "Middle School",
      "description": "Secondary education for children aged 12-15",
      "order": 2,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Educational stages retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### 2. Get Educational Stage By ID

Get a specific educational stage by ID (requires authentication).

**Endpoint:** `GET /api/educational-stages/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "nameAr": "المرحلة الابتدائية",
    "nameEn": "Elementary School",
    "description": "Primary education for children aged 6-12",
    "order": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Educational stage retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Educational stage not found
- `500` - Server error

---

### 3. Create Educational Stage

Create a new educational stage (requires authentication).

**Endpoint:** `POST /api/educational-stages`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body:**
```json
{
  "nameAr": "المرحلة الابتدائية",
  "nameEn": "Elementary School",
  "description": "Primary education for children aged 6-12",
  "order": 1
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "nameAr": "المرحلة الابتدائية",
    "nameEn": "Elementary School",
    "description": "Primary education for children aged 6-12",
    "order": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Educational stage created successfully"
}
```

**Error Responses:**
- `400` - Validation error or name/order already exists
- `401` - Authentication required
- `500` - Server error

---

### 4. Update Educational Stage

Update educational stage information (requires authentication).

**Endpoint:** `PUT /api/educational-stages/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "nameAr": "المرحلة الابتدائية",
  "nameEn": "Primary School",
  "description": "Updated description",
  "order": 1
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "nameAr": "المرحلة الابتدائية",
    "nameEn": "Primary School",
    "description": "Updated description",
    "order": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  },
  "message": "Educational stage updated successfully"
}
```

**Error Responses:**
- `400` - Validation error or name/order already taken
- `401` - Authentication required
- `404` - Educational stage not found
- `500` - Server error

---

### 5. Delete Educational Stage

Delete an educational stage (requires authentication).

**Endpoint:** `DELETE /api/educational-stages/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Educational stage deleted successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Educational stage not found
- `500` - Server error

---

## Example cURL Commands for Educational Stages

### Get All Educational Stages
```bash
curl -X GET http://localhost:3000/api/educational-stages \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Educational Stage By ID
```bash
curl -X GET http://localhost:3000/api/educational-stages/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>"
```

### Create Educational Stage
```bash
curl -X POST http://localhost:3000/api/educational-stages \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "nameAr": "المرحلة الابتدائية",
    "nameEn": "Elementary School",
    "description": "Primary education for children aged 6-12",
    "order": 1
  }'
```

### Update Educational Stage
```bash
curl -X PUT http://localhost:3000/api/educational-stages/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "nameAr": "المرحلة الابتدائية",
    "nameEn": "Primary School",
    "description": "Updated description"
  }'
```

### Delete Educational Stage
```bash
curl -X DELETE http://localhost:3000/api/educational-stages/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>"
```

## Validation Rules for Educational Stages

### Create Educational Stage
- **nameAr**: Required, 2-100 characters (Arabic name)
- **nameEn**: Required, 2-100 characters (English name)
- **description**: Optional, maximum 500 characters
- **order**: Required, positive integer, must be unique (used for sorting)

### Update Educational Stage
- At least one field must be provided
- **nameAr**: Optional, 2-100 characters (Arabic name)
- **nameEn**: Optional, 2-100 characters (English name)
- **description**: Optional, maximum 500 characters
- **order**: Optional, positive integer, must be unique

---

## Educational Material Endpoints

### 1. Get All Educational Materials

Get a list of all educational materials (requires authentication).

**Endpoint:** `GET /api/educational-materials`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "nameAr": "كتاب الرياضيات",
      "nameEn": "Mathematics Book",
      "description": "Comprehensive mathematics textbook for students",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "nameAr": "كتاب العلوم",
      "nameEn": "Science Book",
      "description": "Science textbook covering various topics",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Educational materials retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### 2. Get Educational Material By ID

Get a specific educational material by ID (requires authentication).

**Endpoint:** `GET /api/educational-materials/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "nameAr": "كتاب الرياضيات",
    "nameEn": "Mathematics Book",
    "description": "Comprehensive mathematics textbook for students",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Educational material retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Educational material not found
- `500` - Server error

---

### 3. Create Educational Material

Create a new educational material (requires authentication).

**Endpoint:** `POST /api/educational-materials`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body:**
```json
{
  "nameAr": "كتاب الرياضيات",
  "nameEn": "Mathematics Book",
  "description": "Comprehensive mathematics textbook for students"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "nameAr": "كتاب الرياضيات",
    "nameEn": "Mathematics Book",
    "description": "Comprehensive mathematics textbook for students",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Educational material created successfully"
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Authentication required
- `500` - Server error

---

### 4. Update Educational Material

Update educational material information (requires authentication).

**Endpoint:** `PUT /api/educational-materials/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "nameAr": "كتاب الرياضيات المتقدم",
  "nameEn": "Advanced Mathematics Book",
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "nameAr": "كتاب الرياضيات المتقدم",
    "nameEn": "Advanced Mathematics Book",
    "description": "Updated description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  },
  "message": "Educational material updated successfully"
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Authentication required
- `404` - Educational material not found
- `500` - Server error

---

### 5. Delete Educational Material

Delete an educational material (requires authentication).

**Endpoint:** `DELETE /api/educational-materials/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Educational material deleted successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Educational material not found
- `500` - Server error

---

## Example cURL Commands for Educational Materials

### Get All Educational Materials
```bash
curl -X GET http://localhost:3000/api/educational-materials \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Educational Material By ID
```bash
curl -X GET http://localhost:3000/api/educational-materials/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>"
```

### Create Educational Material
```bash
curl -X POST http://localhost:3000/api/educational-materials \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "nameAr": "كتاب الرياضيات",
    "nameEn": "Mathematics Book",
    "description": "Comprehensive mathematics textbook for students"
  }'
```

### Update Educational Material
```bash
curl -X PUT http://localhost:3000/api/educational-materials/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "nameAr": "كتاب الرياضيات المتقدم",
    "nameEn": "Advanced Mathematics Book"
  }'
```

### Delete Educational Material
```bash
curl -X DELETE http://localhost:3000/api/educational-materials/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>"
```

## Validation Rules for Educational Materials

### Create Educational Material
- **nameAr**: Required, 2-100 characters (Arabic name)
- **nameEn**: Required, 2-100 characters (English name)
- **description**: Optional, maximum 500 characters

### Update Educational Material
- At least one field must be provided
- **nameAr**: Optional, 2-100 characters (Arabic name)
- **nameEn**: Optional, 2-100 characters (English name)
- **description**: Optional, maximum 500 characters

---

## Quality of Education Endpoints

### 1. Get All Quality of Educations

Get a list of all quality of educations (requires authentication).

**Endpoint:** `GET /api/quality-of-educations`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "nameAr": "جودة عالية",
      "nameEn": "High Quality",
      "description": "Excellent educational quality standards",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "nameAr": "جودة متوسطة",
      "nameEn": "Medium Quality",
      "description": "Average educational quality standards",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Quality of educations retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### 2. Get Quality of Education By ID

Get a specific quality of education by ID (requires authentication).

**Endpoint:** `GET /api/quality-of-educations/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "nameAr": "جودة عالية",
    "nameEn": "High Quality",
    "description": "Excellent educational quality standards",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Quality of education retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Quality of education not found
- `500` - Server error

---

### 3. Create Quality of Education

Create a new quality of education (requires authentication).

**Endpoint:** `POST /api/quality-of-educations`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body:**
```json
{
  "nameAr": "جودة عالية",
  "nameEn": "High Quality",
  "description": "Excellent educational quality standards"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "nameAr": "جودة عالية",
    "nameEn": "High Quality",
    "description": "Excellent educational quality standards",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Quality of education created successfully"
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Authentication required
- `500` - Server error

---

### 4. Update Quality of Education

Update quality of education information (requires authentication).

**Endpoint:** `PUT /api/quality-of-educations/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "nameAr": "جودة ممتازة",
  "nameEn": "Excellent Quality",
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "nameAr": "جودة ممتازة",
    "nameEn": "Excellent Quality",
    "description": "Updated description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  },
  "message": "Quality of education updated successfully"
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Authentication required
- `404` - Quality of education not found
- `500` - Server error

---

### 5. Delete Quality of Education

Delete a quality of education (requires authentication).

**Endpoint:** `DELETE /api/quality-of-educations/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Quality of education deleted successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Quality of education not found
- `500` - Server error

---

## Example cURL Commands for Quality of Educations

### Get All Quality of Educations
```bash
curl -X GET http://localhost:3000/api/quality-of-educations \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Quality of Education By ID
```bash
curl -X GET http://localhost:3000/api/quality-of-educations/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>"
```

### Create Quality of Education
```bash
curl -X POST http://localhost:3000/api/quality-of-educations \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "nameAr": "جودة عالية",
    "nameEn": "High Quality",
    "description": "Excellent educational quality standards"
  }'
```

### Update Quality of Education
```bash
curl -X PUT http://localhost:3000/api/quality-of-educations/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "nameAr": "جودة ممتازة",
    "nameEn": "Excellent Quality"
  }'
```

### Delete Quality of Education
```bash
curl -X DELETE http://localhost:3000/api/quality-of-educations/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>"
```

## Validation Rules for Quality of Educations

### Create Quality of Education
- **nameAr**: Required, 2-100 characters (Arabic name)
- **nameEn**: Required, 2-100 characters (English name)
- **description**: Optional, maximum 500 characters

### Update Quality of Education
- At least one field must be provided
- **nameAr**: Optional, 2-100 characters (Arabic name)
- **nameEn**: Optional, 2-100 characters (English name)
- **description**: Optional, maximum 500 characters

---

## Colors Endpoints

### 1. Get Colors

Get the application colors configuration including main color, second color, text colors, and logo (requires authentication).

**Endpoint:** `GET /api/colors`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "mainColor": "#000000",
    "secondColor": "#ffffff",
    "textMainColor": "#ffffff",
    "textSecondColor": "#000000",
    "sidebarBg": "#f5f5f5",
    "sidebarText": "#000000",
    "logo": "https://example.com/logo.png",
    "logoText": "My App",
    "logoTextColor": "#000000",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Colors retrieved successfully"
}
```

**Note:** If no colors configuration exists in the database, the API will return default values:
- `mainColor`: "#000000"
- `secondColor`: "#ffffff"
- `textMainColor`: "#ffffff"
- `textSecondColor`: "#000000"
- `sidebarBg`: "#f5f5f5"
- `sidebarText`: "#000000"
- `logo`: "" (empty string)
- `logoText`: "" (empty string)
- `logoTextColor`: "#000000"

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### 2. Update Colors

Update the application colors configuration. Accepts formData to upload a logo file (requires authentication).

**Endpoint:** `PUT /api/colors`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: multipart/form-data
```

**Request Body (formData - all fields optional):**
- `mainColor`: Hex color code (e.g., "#000000")
- `secondColor`: Hex color code (e.g., "#ffffff")
- `textMainColor`: Hex color code (e.g., "#ffffff")
- `textSecondColor`: Hex color code (e.g., "#000000")
- `sidebarBg`: Hex color code (e.g., "#f5f5f5")
- `sidebarText`: Hex color code (e.g., "#000000")
- `logo`: Image file (JPEG, PNG, GIF, WEBP, SVG) - max 5MB
- `logo`: String URL (alternative to file upload)
- `logoText`: String text for logo (e.g., "My App")
- `logoTextColor`: Hex color code for logo text (e.g., "#000000")

**Note:** At least one field must be provided. You can either upload a logo file or provide a logo URL string.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "mainColor": "#0066cc",
    "secondColor": "#ffffff",
    "textMainColor": "#ffffff",
    "textSecondColor": "#000000",
    "sidebarBg": "#f5f5f5",
    "sidebarText": "#000000",
    "logo": "/uploads/logos/logo-1234567890-987654321.png",
    "logoText": "My App",
    "logoTextColor": "#000000",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  },
  "message": "Colors updated successfully"
}
```

**Error Responses:**
- `400` - Validation error (invalid hex color, invalid file type, file too large)
- `401` - Authentication required
- `500` - Server error

---

## Example cURL Commands for Colors

### Get Colors
```bash
curl -X GET http://localhost:3000/api/colors \
  -H "Authorization: Bearer <your-token-here>"
```

### Update Colors (with file upload)
```bash
curl -X PUT http://localhost:3000/api/colors \
  -H "Authorization: Bearer <your-token-here>" \
  -F "mainColor=#0066cc" \
  -F "secondColor=#ffffff" \
  -F "textMainColor=#ffffff" \
  -F "textSecondColor=#000000" \
  -F "sidebarBg=#f5f5f5" \
  -F "sidebarText=#000000" \
  -F "logoText=My App" \
  -F "logoTextColor=#000000" \
  -F "logo=@/path/to/logo.png"
```

### Update Colors (without file upload, using URL)
```bash
curl -X PUT http://localhost:3000/api/colors \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "mainColor": "#0066cc",
    "secondColor": "#ffffff",
    "textMainColor": "#ffffff",
    "textSecondColor": "#000000",
    "sidebarBg": "#f5f5f5",
    "sidebarText": "#000000",
    "logoText": "My App",
    "logoTextColor": "#000000",
    "logo": "https://example.com/logo.png"
  }'
```

### Update Colors (only colors, no logo)
```bash
curl -X PUT http://localhost:3000/api/colors \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "mainColor": "#0066cc",
    "secondColor": "#ffffff"
  }'
```

---

## Validation Rules for Colors

### Update Colors
- At least one field must be provided
- **mainColor**: Optional, must be a valid hex color code (e.g., "#000000" or "#fff")
- **secondColor**: Optional, must be a valid hex color code
- **textMainColor**: Optional, must be a valid hex color code
- **textSecondColor**: Optional, must be a valid hex color code
- **sidebarBg**: Optional, must be a valid hex color code
- **sidebarText**: Optional, must be a valid hex color code
- **logo**: Optional, either:
  - Image file: JPEG, PNG, GIF, WEBP, or SVG format, maximum 5MB
  - String: URL or path to the logo
- **logoText**: Optional, string text for the logo
- **logoTextColor**: Optional, must be a valid hex color code for the logo text color

---

## Colors Data Structure

The colors configuration includes:
- **mainColor**: Primary color for the application (hex color code)
- **secondColor**: Secondary color for the application (hex color code)
- **textMainColor**: Text color used with main color background (hex color code)
- **textSecondColor**: Text color used with second color background (hex color code)
- **sidebarBg**: Background color for the sidebar (hex color code)
- **sidebarText**: Text color for the sidebar (hex color code)
- **logo**: URL or path to the application logo (served from `/uploads/logos/` when uploaded as file)
- **logoText**: Text to display as logo (string)
- **logoTextColor**: Color for the logo text (hex color code)

---

## Teacher Endpoints

### 1. Register Teacher

Register a new teacher account. This is a public endpoint that creates a teacher user with all required teacher-specific fields.

**Endpoint:** `POST /api/teachers/register`

**Request Body:**
```json
{
  "name": "Ahmed Ali",
  "email": "ahmed.ali@example.com",
  "phone": "+201234567890",
  "country": "Egypt",
  "countryId": "507f1f77bcf86cd799439011",
  "educationalStageId": "507f1f77bcf86cd799439012",
  "educationalMaterialId": "507f1f77bcf86cd799439013",
  "qualityOfEducationId": "507f1f77bcf86cd799439014",
  "cityId": "507f1f77bcf86cd799439015",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "teacher": {
      "id": "507f1f77bcf86cd799439016",
      "name": "Ahmed Ali",
      "email": "ahmed.ali@example.com",
      "phone": "+201234567890",
      "country": "Egypt",
      "countryId": "507f1f77bcf86cd799439011",
      "educationalStageId": "507f1f77bcf86cd799439012",
      "educationalMaterialId": "507f1f77bcf86cd799439013",
      "qualityOfEducationId": "507f1f77bcf86cd799439014",
      "cityId": "507f1f77bcf86cd799439015",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Teacher registered successfully"
}
```

**Error Responses:**
- `400` - Validation error, teacher already exists, or invalid referenced IDs
- `500` - Server error

---

### 2. Get All Teachers

Get a list of all teachers (requires authentication).

**Endpoint:** `GET /api/teachers`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439016",
      "name": "Ahmed Ali",
      "email": "ahmed.ali@example.com",
      "phone": "+201234567890",
      "country": "Egypt",
      "countryId": "507f1f77bcf86cd799439011",
      "educationalStageId": "507f1f77bcf86cd799439012",
      "educationalMaterialId": "507f1f77bcf86cd799439013",
      "qualityOfEducationId": "507f1f77bcf86cd799439014",
      "cityId": "507f1f77bcf86cd799439015",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439017",
      "name": "Fatima Hassan",
      "email": "fatima.hassan@example.com",
      "phone": "+201234567891",
      "country": "Egypt",
      "countryId": "507f1f77bcf86cd799439011",
      "educationalStageId": "507f1f77bcf86cd799439012",
      "educationalMaterialId": "507f1f77bcf86cd799439018",
      "qualityOfEducationId": "507f1f77bcf86cd799439014",
      "cityId": "507f1f77bcf86cd799439019",
      "createdAt": "2024-01-01T01:00:00.000Z",
      "updatedAt": "2024-01-01T01:00:00.000Z"
    }
  ],
  "message": "Teachers retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### 3. Get Teacher By ID

Get a specific teacher by ID (requires authentication).

**Endpoint:** `GET /api/teachers/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439016",
    "name": "Ahmed Ali",
    "email": "ahmed.ali@example.com",
    "phone": "+201234567890",
    "country": "Egypt",
    "countryId": "507f1f77bcf86cd799439011",
    "educationalStageId": "507f1f77bcf86cd799439012",
    "educationalMaterialId": "507f1f77bcf86cd799439013",
    "qualityOfEducationId": "507f1f77bcf86cd799439014",
    "cityId": "507f1f77bcf86cd799439015",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Teacher retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Teacher not found
- `500` - Server error

---

### 4. Update Teacher

Update teacher information (requires authentication).

**Endpoint:** `PUT /api/teachers/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "name": "Ahmed Ali Updated",
  "email": "ahmed.ali.updated@example.com",
  "phone": "+201234567899",
  "country": "Egypt",
  "countryId": "507f1f77bcf86cd799439011",
  "educationalStageId": "507f1f77bcf86cd799439020",
  "educationalMaterialId": "507f1f77bcf86cd799439013",
  "qualityOfEducationId": "507f1f77bcf86cd799439014",
  "cityId": "507f1f77bcf86cd799439021",
  "password": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439016",
    "name": "Ahmed Ali Updated",
    "email": "ahmed.ali.updated@example.com",
    "phone": "+201234567899",
    "country": "Egypt",
    "countryId": "507f1f77bcf86cd799439011",
    "educationalStageId": "507f1f77bcf86cd799439020",
    "educationalMaterialId": "507f1f77bcf86cd799439013",
    "qualityOfEducationId": "507f1f77bcf86cd799439014",
    "cityId": "507f1f77bcf86cd799439021",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T02:00:00.000Z"
  },
  "message": "Teacher updated successfully"
}
```

**Error Responses:**
- `400` - Validation error, email/phone already taken, or invalid referenced IDs
- `401` - Authentication required
- `404` - Teacher not found
- `500` - Server error

---

### 5. Delete Teacher

Delete a teacher (requires authentication).

**Endpoint:** `DELETE /api/teachers/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Teacher deleted successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Teacher not found
- `500` - Server error

---

## Example cURL Commands for Teachers

### Register Teacher
```bash
curl -X POST http://localhost:3000/api/teachers/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed Ali",
    "email": "ahmed.ali@example.com",
    "phone": "+201234567890",
    "country": "Egypt",
    "countryId": "507f1f77bcf86cd799439011",
    "educationalStageId": "507f1f77bcf86cd799439012",
    "educationalMaterialId": "507f1f77bcf86cd799439013",
    "qualityOfEducationId": "507f1f77bcf86cd799439014",
    "cityId": "507f1f77bcf86cd799439015",
    "password": "password123"
  }'
```

### Get All Teachers
```bash
curl -X GET http://localhost:3000/api/teachers \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Teacher By ID
```bash
curl -X GET http://localhost:3000/api/teachers/507f1f77bcf86cd799439016 \
  -H "Authorization: Bearer <your-token-here>"
```

### Update Teacher
```bash
curl -X PUT http://localhost:3000/api/teachers/507f1f77bcf86cd799439016 \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed Ali Updated",
    "educationalStageId": "507f1f77bcf86cd799439020"
  }'
```

### Delete Teacher
```bash
curl -X DELETE http://localhost:3000/api/teachers/507f1f77bcf86cd799439016 \
  -H "Authorization: Bearer <your-token-here>"
```

---

## Validation Rules for Teachers

### Register Teacher
- **name**: Required, 2-100 characters
- **email**: Required, valid email format, must be unique
- **phone**: Required, minimum 5 characters, must be unique
- **country**: Required, minimum 2 characters
- **countryId**: Required, valid MongoDB ObjectId, must reference an existing country
- **educationalStageId**: Required, valid MongoDB ObjectId, must reference an existing educational stage
- **educationalMaterialId**: Required, valid MongoDB ObjectId, must reference an existing educational material
- **qualityOfEducationId**: Required, valid MongoDB ObjectId, must reference an existing quality of education
- **cityId**: Required, valid MongoDB ObjectId, must reference an existing city
- **password**: Required, minimum 6 characters

### Update Teacher
- At least one field must be provided
- **name**: Optional, 2-100 characters
- **email**: Optional, valid email format, must be unique
- **phone**: Optional, minimum 5 characters, must be unique
- **country**: Optional, minimum 2 characters
- **countryId**: Optional, valid MongoDB ObjectId, must reference an existing country
- **educationalStageId**: Optional, valid MongoDB ObjectId, must reference an existing educational stage
- **educationalMaterialId**: Optional, valid MongoDB ObjectId, must reference an existing educational material
- **qualityOfEducationId**: Optional, valid MongoDB ObjectId, must reference an existing quality of education
- **cityId**: Optional, valid MongoDB ObjectId, must reference an existing city
- **password**: Optional, minimum 6 characters

---

## Teacher Data Structure

A teacher user includes:
- **id**: Unique identifier for the teacher
- **name**: Full name of the teacher
- **email**: Email address (unique)
- **phone**: Phone number (unique)
- **country**: Country name (text field)
- **countryId**: Reference to Country model (ObjectId)
- **educationalStageId**: Reference to EducationalStage model (ObjectId)
- **educationalMaterialId**: Reference to EducationalMaterial model (ObjectId)
- **qualityOfEducationId**: Reference to QualityOfEducation model (ObjectId)
- **cityId**: Reference to City model (ObjectId)
- **createdAt**: Timestamp when the teacher was created
- **updatedAt**: Timestamp when the teacher was last updated

**Note:** All referenced IDs (countryId, educationalStageId, educationalMaterialId, qualityOfEducationId, cityId) must exist in their respective collections before a teacher can be registered or updated.

---

## Student Endpoints

### 1. Register Student

Register a new student account. This is a **public endpoint**: no authentication is required. Do **not** send an `Authorization` header; the API does not use or return a token. Creates a student user with all required student-specific fields. A unique student code (format: ST1234) is automatically generated.

**Endpoint:** `POST /api/students/register`

**Authentication:** None. No token in request or response.

**Content-Type:** `multipart/form-data` (for image upload) or `application/json` (without image)

**Request Body (Form Data):**
- **username** (required): String, 3-50 characters, alphanumeric and underscores only
- **phoneNumber** (required): String, minimum 5 characters
- **birthday** (required): String, ISO date format (YYYY-MM-DD)
- **educationalStageId** (required): String, valid MongoDB ObjectId
- **password** (required): String, minimum 6 characters
- **image** (optional): File, image file (JPEG, PNG, GIF, WEBP, SVG), max 5MB
- **email** (optional): String. If provided, the student code is sent to this email after registration.
- **coupon** (optional): String, a friend's student code (e.g. ST5678). If valid, the owner of that code receives 50 points once (max 20 uses per code) and this student is linked as referred.

**Request example (JSON, no image):**
```
POST /api/students/register
Content-Type: application/json

{
  "username": "john_doe",
  "phoneNumber": "+1234567890",
  "birthday": "2010-05-15",
  "educationalStageId": "507f1f77bcf86cd799439012",
  "password": "password123"
}
```

**Request example (with optional fields):**
```
POST /api/students/register
Content-Type: application/json

{
  "username": "john_doe",
  "phoneNumber": "+1234567890",
  "birthday": "2010-05-15",
  "educationalStageId": "507f1f77bcf86cd799439012",
  "password": "password123",
  "email": "john@example.com",
  "coupon": "ST5678"
}
```
*(For image upload, use multipart/form-data and omit Content-Type; see cURL examples below.)*

**Example – cURL (multipart, no token):**
```bash
# Register a student (no Authorization header)
curl -X POST http://localhost:3000/api/students/register \
  -F "username=john_doe" \
  -F "phoneNumber=+1234567890" \
  -F "birthday=2010-05-15" \
  -F "educationalStageId=507f1f77bcf86cd799439012" \
  -F "password=password123"

# With optional image and coupon
curl -X POST http://localhost:3000/api/students/register \
  -F "username=john_doe" \
  -F "phoneNumber=+1234567890" \
  -F "birthday=2010-05-15" \
  -F "educationalStageId=507f1f77bcf86cd799439012" \
  -F "password=password123" \
  -F "image=@/path/to/image.jpg" \
  -F "coupon=ST5678"
```

**Example – JSON body (no image, no token):**
```bash
curl -X POST http://localhost:3000/api/students/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "phoneNumber": "+1234567890",
    "birthday": "2010-05-15",
    "educationalStageId": "507f1f77bcf86cd799439012",
    "password": "password123",
    "coupon": "ST5678"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "507f1f77bcf86cd799439020",
      "username": "john_doe",
      "phoneNumber": "+1234567890",
      "birthday": "2010-05-15T00:00:00.000Z",
      "educationalStageId": "507f1f77bcf86cd799439012",
      "studentCode": "ST1234",
      "image": "/uploads/students/student-image-1234567890.jpg",
      "level": 10,
      "totalPoints": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Student registered successfully"
}
```

**Error Responses:**
- `400` - Validation error, username/phone already exists, invalid educational stage ID, or invalid date
- `500` - Server error

---

### 2. Get All Students

Get a list of all students, optionally filtered by teacher (requires authentication).

**Endpoint:** `GET /api/students` or `GET /api/students?teacherId=<teacherId>`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Query Parameters:**
- `teacherId` (optional): Filter students by teacher ID. Returns only students that are joined to the specified teacher.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439020",
      "username": "john_doe",
      "phoneNumber": "+1234567890",
      "birthday": "2010-05-15T00:00:00.000Z",
      "educationalStageId": "507f1f77bcf86cd799439012",
      "studentCode": "ST1234",
      "image": "/uploads/students/student-image-1234567890.jpg",
      "level": 10,
      "totalPoints": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439021",
      "username": "jane_smith",
      "phoneNumber": "+1234567891",
      "birthday": "2011-08-20T00:00:00.000Z",
      "educationalStageId": "507f1f77bcf86cd799439012",
      "studentCode": "ST5678",
      "image": null,
      "level": 12,
      "totalPoints": 250,
      "createdAt": "2024-01-01T01:00:00.000Z",
      "updatedAt": "2024-01-01T01:00:00.000Z"
    }
  ],
  "message": "Students retrieved successfully"
}
```

**Error Responses:**
- `400` - Invalid teacher ID format
- `401` - Authentication required
- `404` - Teacher not found (when filtering by teacherId)
- `500` - Server error

**Example with Teacher Filter:**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439020",
      "username": "john_doe",
      "phoneNumber": "+1234567890",
      "birthday": "2010-05-15T00:00:00.000Z",
      "educationalStageId": "507f1f77bcf86cd799439012",
      "studentCode": "ST1234",
      "image": "/uploads/students/student-image-1234567890.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Students retrieved successfully"
}
```

**Note:** When filtering by `teacherId`, only students that have a join relationship with the specified teacher are returned. If no students are joined to the teacher, an empty array is returned.

---

### 3. Get Student By ID

Get a specific student by ID (requires authentication).

**Endpoint:** `GET /api/students/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439020",
    "username": "john_doe",
    "phoneNumber": "+1234567890",
    "birthday": "2010-05-15T00:00:00.000Z",
      "educationalStageId": "507f1f77bcf86cd799439012",
      "studentCode": "ST1234",
      "image": "/uploads/students/student-image-1234567890.jpg",
      "level": 11,
      "totalPoints": 150,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Student retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Student not found
- `500` - Server error

---

### 4. Update Student

Update student information (requires authentication).

**Endpoint:** `PUT /api/students/:id`

**Content-Type:** `multipart/form-data` (if updating image) or `application/json`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Request Body (all fields optional, can use form-data or JSON):**
```json
{
  "username": "john_doe_updated",
  "phoneNumber": "+1234567899",
  "birthday": "2010-05-16",
  "educationalStageId": "507f1f77bcf86cd799439013",
  "password": "newpassword123"
}
```

**Or with image upload (form-data):**
- **username** (optional): String
- **phoneNumber** (optional): String
- **birthday** (optional): String, ISO date format
- **educationalStageId** (optional): String, valid MongoDB ObjectId
- **password** (optional): String
- **image** (optional): File, image file

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439020",
    "username": "john_doe_updated",
    "phoneNumber": "+1234567899",
    "birthday": "2010-05-16T00:00:00.000Z",
      "educationalStageId": "507f1f77bcf86cd799439013",
      "studentCode": "ST1234",
      "image": "/uploads/students/student-image-9876543210.jpg",
      "level": 11,
      "totalPoints": 150,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T02:00:00.000Z"
  },
  "message": "Student updated successfully"
}
```

**Error Responses:**
- `400` - Validation error, username/phone already taken, or invalid educational stage ID
- `401` - Authentication required
- `404` - Student not found
- `500` - Server error

---

### 5. Delete Student

Delete a student (requires authentication).

**Endpoint:** `DELETE /api/students/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Student deleted successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Student not found
- `500` - Server error

---

## Example cURL Commands for Students

### Register Student (with image)
```bash
curl -X POST http://localhost:3000/api/students/register \
  -F "username=john_doe" \
  -F "phoneNumber=+1234567890" \
  -F "birthday=2010-05-15" \
  -F "educationalStageId=507f1f77bcf86cd799439012" \
  -F "password=password123" \
  -F "image=@/path/to/image.jpg"
```

### Register Student (without image)
```bash
curl -X POST http://localhost:3000/api/students/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "phoneNumber": "+1234567890",
    "birthday": "2010-05-15",
    "educationalStageId": "507f1f77bcf86cd799439012",
    "password": "password123"
  }'
```

### Get All Students
```bash
curl -X GET http://localhost:3000/api/students \
  -H "Authorization: Bearer <your-token-here>"
```

### Get All Students (Filtered by Teacher)
```bash
curl -X GET "http://localhost:3000/api/students?teacherId=507f1f77bcf86cd799439016" \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Student By ID
```bash
curl -X GET http://localhost:3000/api/students/507f1f77bcf86cd799439020 \
  -H "Authorization: Bearer <your-token-here>"
```

### Update Student
```bash
curl -X PUT http://localhost:3000/api/students/507f1f77bcf86cd799439020 \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe_updated",
    "educationalStageId": "507f1f77bcf86cd799439013"
  }'
```

### Update Student (with image)
```bash
curl -X PUT http://localhost:3000/api/students/507f1f77bcf86cd799439020 \
  -H "Authorization: Bearer <your-token-here>" \
  -F "username=john_doe_updated" \
  -F "image=@/path/to/new-image.jpg"
```

### Delete Student
```bash
curl -X DELETE http://localhost:3000/api/students/507f1f77bcf86cd799439020 \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Student Exams
```bash
curl -X GET http://localhost:3000/api/students/507f1f77bcf86cd799439020/exams \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Student Mistakes
```bash
curl -X GET http://localhost:3000/api/students/507f1f77bcf86cd799439020/mistakes \
  -H "Authorization: Bearer <your-token-here>"
```

---

### 6. Get Student Exams

Get all exams solved by a specific student (requires authentication).

**Endpoint:** `GET /api/students/:id/exams`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439030",
      "examId": "507f1f77bcf86cd799439011",
      "examTitle": "Mathematics Final Exam",
      "examDescription": "Comprehensive exam covering all mathematics topics",
      "totalScore": 75,
      "totalPoints": 100,
      "percentage": 75.00,
      "submittedAt": "2024-01-15T12:00:00.000Z",
      "createdAt": "2024-01-15T12:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439031",
      "examId": "507f1f77bcf86cd799439012",
      "examTitle": "Science Quiz",
      "examDescription": "Basic science concepts quiz",
      "totalScore": 90,
      "totalPoints": 100,
      "percentage": 90.00,
      "submittedAt": "2024-01-16T10:30:00.000Z",
      "createdAt": "2024-01-16T10:30:00.000Z"
    }
  ],
  "message": "Student exams retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Student not found
- `500` - Server error

---

### 7. Get Student Mistakes

Get all wrong answers (mistakes) made by a specific student (requires authentication).

**Endpoint:** `GET /api/students/:id/mistakes`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439040",
      "examId": "507f1f77bcf86cd799439011",
      "examTitle": "Mathematics Final Exam",
      "examResultId": "507f1f77bcf86cd799439030",
      "questionIndex": 2,
      "question": "What is 5 * 3?",
      "options": ["10", "12", "15", "18"],
      "selectedAnswer": 0,
      "correctAnswer": 2,
      "points": 10,
      "submittedAt": "2024-01-15T12:00:00.000Z",
      "createdAt": "2024-01-15T12:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439041",
      "examId": "507f1f77bcf86cd799439011",
      "examTitle": "Mathematics Final Exam",
      "examResultId": "507f1f77bcf86cd799439030",
      "questionIndex": 3,
      "question": "What is 10 / 2?",
      "options": ["5", "6", "7", "8"],
      "selectedAnswer": 1,
      "correctAnswer": 0,
      "points": 15,
      "submittedAt": "2024-01-15T12:00:00.000Z",
      "createdAt": "2024-01-15T12:00:00.000Z"
    }
  ],
  "message": "Student mistakes retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Student not found
- `500` - Server error

**Note:**
- Only wrong answers are stored (unanswered questions are not stored as mistakes)
- Mistakes are automatically created when a student solves an exam and answers incorrectly
- Each mistake includes the full question text, options, selected answer, and correct answer for review

---

## Validation Rules for Students

### Register Student
- **username**: Required, 3-50 characters, alphanumeric and underscores only, must be unique
- **phoneNumber**: Required, minimum 5 characters, must be unique
- **birthday**: Required, valid ISO date format (YYYY-MM-DD), cannot be in the future
- **educationalStageId**: Required, valid MongoDB ObjectId, must reference an existing educational stage
- **password**: Required, minimum 6 characters
- **image**: Optional, image file (JPEG, PNG, GIF, WEBP, SVG), max 5MB

### Update Student
- At least one field must be provided
- **username**: Optional, 3-50 characters, alphanumeric and underscores only, must be unique
- **phoneNumber**: Optional, minimum 5 characters, must be unique
- **birthday**: Optional, valid ISO date format, cannot be in the future
- **educationalStageId**: Optional, valid MongoDB ObjectId, must reference an existing educational stage
- **password**: Optional, minimum 6 characters
- **image**: Optional, image file (JPEG, PNG, GIF, WEBP, SVG), max 5MB

---

### 8. Get Student Points History

Get all points history (transactions) for a specific student (requires authentication).

**Endpoint:** `GET /api/students/:id/points-history`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439050",
      "sourceType": "exam",
      "sourceId": "507f1f77bcf86cd799439011",
      "sourceTitle": "Mathematics Final Exam",
      "points": 75,
      "levelBefore": 10,
      "levelAfter": 10,
      "leveledUp": false,
      "earnedAt": "2024-01-15T12:00:00.000Z",
      "createdAt": "2024-01-15T12:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439051",
      "sourceType": "exam",
      "sourceId": "507f1f77bcf86cd799439012",
      "sourceTitle": "Science Quiz",
      "points": 90,
      "levelBefore": 10,
      "levelAfter": 9,
      "leveledUp": true,
      "earnedAt": "2024-01-16T10:30:00.000Z",
      "createdAt": "2024-01-16T10:30:00.000Z"
    }
  ],
  "message": "Student points history retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Student not found
- `500` - Server error

**Note:**
- Points history tracks all point transactions from exams and challenges
- Each entry shows the level before and after earning points
- The `leveledUp` flag indicates if the student leveled up from this transaction (level number decreases)
- Points accumulate over time and level is calculated as: `level = 10 - floor(totalPoints / 100)`
- Level decreases as points increase (0 points = Level 10, 100 points = Level 9, 200 points = Level 8)

---

## Student Data Structure

A student user includes:
- **id**: Unique identifier for the student
- **username**: Unique username (3-50 characters, alphanumeric and underscores only)
- **phoneNumber**: Phone number (unique)
- **birthday**: Date of birth (ISO date format)
- **educationalStageId**: Reference to EducationalStage model (ObjectId)
- **studentCode**: Auto-generated unique code in format ST#### (e.g., ST1234)
- **image**: Optional path to student profile image
- **level**: Current student level (starts at 10, increases by 1 every 100 points)
- **totalPoints**: Total lifetime points earned from exams and challenges
- **createdAt**: Timestamp when the student was created
- **updatedAt**: Timestamp when the student was last updated

**Note:** 
- The `studentCode` is automatically generated during registration in the format ST#### (e.g., ST1234, ST5678)
- The `educationalStageId` must reference an existing educational stage in the database
- The `username` must be unique across all users
- The `phoneNumber` must be unique across all users
- **Level System**: Students start at level 10 when they register
- **Points System**: Points are earned from solving exams (points = exam totalScore)
- **Level Calculation**: `level = 10 - Math.floor(totalPoints / 100)`
- **Automatic Updates**: Level and totalPoints are automatically updated when a student solves an exam
- **Note**: Level decreases as points increase (0 points = Level 10, 100 points = Level 9, etc.)

---

## Student-Teacher Join Endpoints

### 1. Create Student-Teacher Join

Create a new join relationship between a student and a teacher (requires authentication).

**Endpoint:** `POST /api/student-teachers`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body:**
```json
{
  "studentId": "507f1f77bcf86cd799439020",
  "teacherId": "507f1f77bcf86cd799439016",
  "status": "pending"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439030",
    "studentId": "507f1f77bcf86cd799439020",
    "teacherId": "507f1f77bcf86cd799439016",
    "student": {
      "id": "507f1f77bcf86cd799439020",
      "username": "john_doe",
      "studentCode": "ST1234",
      "phoneNumber": "+1234567890",
      "image": "/uploads/students/student-image-1234567890.jpg"
    },
    "teacher": {
      "id": "507f1f77bcf86cd799439016",
      "name": "Ahmed Ali",
      "email": "ahmed.ali@example.com",
      "phone": "+201234567890"
    },
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Student joined to teacher successfully"
}
```

**Error Responses:**
- `400` - Validation error, student/teacher not found, or relationship already exists
- `401` - Authentication required
- `404` - Student or teacher not found
- `500` - Server error

---

### 2. Get All Student-Teacher Joins

Get a list of all student-teacher join relationships (requires authentication).

**Endpoint:** `GET /api/student-teachers`

**Query Parameters:**
- `teacherId` (optional): Filter joins by teacher ID. Example: `?teacherId=507f1f77bcf86cd799439016`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Example Request:**
```bash
# Get all student-teacher joins
curl -X GET "http://localhost:3000/api/student-teachers" \
  -H "Authorization: Bearer <your-token-here>"

# Get all joins for a specific teacher
curl -X GET "http://localhost:3000/api/student-teachers?teacherId=507f1f77bcf86cd799439016" \
  -H "Authorization: Bearer <your-token-here>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439030",
      "studentId": "507f1f77bcf86cd799439020",
      "teacherId": "507f1f77bcf86cd799439016",
      "student": {
        "id": "507f1f77bcf86cd799439020",
        "username": "john_doe",
        "studentCode": "ST1234",
        "phoneNumber": "+1234567890",
        "image": "/uploads/students/student-image-1234567890.jpg"
      },
      "teacher": {
        "id": "507f1f77bcf86cd799439016",
        "name": "Ahmed Ali",
        "email": "ahmed.ali@example.com",
        "phone": "+201234567890"
      },
      "status": "approved",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T01:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439031",
      "studentId": "507f1f77bcf86cd799439021",
      "teacherId": "507f1f77bcf86cd799439017",
      "student": {
        "id": "507f1f77bcf86cd799439021",
        "username": "jane_smith",
        "studentCode": "ST5678",
        "phoneNumber": "+1234567891",
        "image": null
      },
      "teacher": {
        "id": "507f1f77bcf86cd799439017",
        "name": "Fatima Hassan",
        "email": "fatima.hassan@example.com",
        "phone": "+201234567891"
      },
      "status": "pending",
      "createdAt": "2024-01-01T02:00:00.000Z",
      "updatedAt": "2024-01-01T02:00:00.000Z"
    }
  ],
  "message": "Student-teacher relationships retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### 3. Get Student-Teacher Join By ID

Get a specific student-teacher join relationship by ID (requires authentication).

**Endpoint:** `GET /api/student-teachers/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439030",
    "studentId": "507f1f77bcf86cd799439020",
    "teacherId": "507f1f77bcf86cd799439016",
    "student": {
      "id": "507f1f77bcf86cd799439020",
      "username": "john_doe",
      "studentCode": "ST1234",
      "phoneNumber": "+1234567890",
      "image": "/uploads/students/student-image-1234567890.jpg"
    },
    "teacher": {
      "id": "507f1f77bcf86cd799439016",
      "name": "Ahmed Ali",
      "email": "ahmed.ali@example.com",
      "phone": "+201234567890"
    },
    "status": "approved",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  },
  "message": "Student-teacher relationship retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Student-teacher relationship not found
- `500` - Server error

---

### 4. Update Student-Teacher Join

Update the status of a student-teacher join relationship (requires authentication).

**Endpoint:** `PUT /api/student-teachers/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "approved"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439030",
    "studentId": "507f1f77bcf86cd799439020",
    "teacherId": "507f1f77bcf86cd799439016",
    "student": {
      "id": "507f1f77bcf86cd799439020",
      "username": "john_doe",
      "studentCode": "ST1234",
      "phoneNumber": "+1234567890",
      "image": "/uploads/students/student-image-1234567890.jpg"
    },
    "teacher": {
      "id": "507f1f77bcf86cd799439016",
      "name": "Ahmed Ali",
      "email": "ahmed.ali@example.com",
      "phone": "+201234567890"
    },
    "status": "approved",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T02:00:00.000Z"
  },
  "message": "Student-teacher relationship updated successfully"
}
```

**Error Responses:**
- `400` - Validation error (invalid status value)
- `401` - Authentication required
- `404` - Student-teacher relationship not found
- `500` - Server error

---

### 5. Delete Student-Teacher Join

Delete a student-teacher join relationship (requires authentication).

**Endpoint:** `DELETE /api/student-teachers/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Student-teacher relationship deleted successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Student-teacher relationship not found
- `500` - Server error

---

## Example cURL Commands for Student-Teacher Joins

### Create Student-Teacher Join
```bash
curl -X POST http://localhost:3000/api/student-teachers \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "507f1f77bcf86cd799439020",
    "teacherId": "507f1f77bcf86cd799439016",
    "status": "pending"
  }'
```

### Get All Student-Teacher Joins
```bash
curl -X GET http://localhost:3000/api/student-teachers \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Student-Teacher Join By ID
```bash
curl -X GET http://localhost:3000/api/student-teachers/507f1f77bcf86cd799439030 \
  -H "Authorization: Bearer <your-token-here>"
```

### Update Student-Teacher Join (Change Status)
```bash
curl -X PUT http://localhost:3000/api/student-teachers/507f1f77bcf86cd799439030 \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved"
  }'
```

### Delete Student-Teacher Join
```bash
curl -X DELETE http://localhost:3000/api/student-teachers/507f1f77bcf86cd799439030 \
  -H "Authorization: Bearer <your-token-here>"
```

---

## Validation Rules for Student-Teacher Joins

### Create Student-Teacher Join
- **studentId**: Required, valid MongoDB ObjectId, must reference an existing student user
- **teacherId**: Required, valid MongoDB ObjectId, must reference an existing teacher user
- **status**: Optional, must be one of: `pending`, `approved`, `rejected` (defaults to `pending`)
- **Note**: A student cannot join the same teacher twice (unique constraint on studentId + teacherId)

### Update Student-Teacher Join
- **status**: Required, must be one of: `pending`, `approved`, `rejected`
- **Note**: Student and teacher IDs cannot be changed after creation, only the status can be updated

---

## Student-Teacher Join Data Structure

A student-teacher join relationship includes:
- **id**: Unique identifier for the join relationship
- **studentId**: Reference to Student (User with userType='student') - ObjectId
- **teacherId**: Reference to Teacher (User with userType='teacher') - ObjectId
- **student**: Populated student object with:
  - **id**: Student ID
  - **username**: Student username
  - **studentCode**: Auto-generated student code (e.g., ST1234)
  - **phoneNumber**: Student phone number
  - **image**: Optional student profile image path
- **teacher**: Populated teacher object with:
  - **id**: Teacher ID
  - **name**: Teacher full name
  - **email**: Teacher email address
  - **phone**: Teacher phone number
- **status**: Join status - `pending`, `approved`, or `rejected` (default: `pending`)
- **createdAt**: Timestamp when the join was created
- **updatedAt**: Timestamp when the join was last updated

**Note:** 
- The relationship between a specific student and teacher is unique (enforced by compound index)
- Only the status can be updated after creation; student and teacher IDs are immutable
- Both student and teacher must exist and have the correct userType before a join can be created
- The API automatically validates that the studentId references a user with `userType='student'` and teacherId references a user with `userType='teacher'`

---

## Lecture Endpoints

### 1. Get All Lectures

Get a list of all lectures with populated educational materials, sub materials, and educational stages (requires authentication).

**Endpoint:** `GET /api/lectures`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439040",
      "name": "Introduction to Mathematics",
      "description": "Basic concepts of mathematics for beginners",
      "startAt": "2024-01-15T10:00:00.000Z",
      "endAt": "2024-01-15T11:30:00.000Z",
      "educationalMaterialId": "507f1f77bcf86cd799439011",
      "educationalMaterial": {
        "id": "507f1f77bcf86cd799439011",
        "nameAr": "كتاب الرياضيات",
        "nameEn": "Mathematics Book"
      },
      "subMaterialId": "507f1f77bcf86cd799439012",
      "subMaterial": {
        "id": "507f1f77bcf86cd799439012",
        "nameAr": "الجبر",
        "nameEn": "Algebra"
      },
      "educationalStageId": "507f1f77bcf86cd799439013",
      "educationalStage": {
        "id": "507f1f77bcf86cd799439013",
        "nameAr": "المرحلة الابتدائية",
        "nameEn": "Elementary School"
      },
      "videoLink": "https://example.com/videos/math-intro.mp4",
      "attachmentFile": "/uploads/lectures/lecture-notes-1234567890.pdf",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439041",
      "name": "Advanced Physics Concepts",
      "description": "Deep dive into quantum mechanics",
      "startAt": "2024-01-16T14:00:00.000Z",
      "endAt": "2024-01-16T16:00:00.000Z",
      "educationalMaterialId": "507f1f77bcf86cd799439014",
      "educationalMaterial": {
        "id": "507f1f77bcf86cd799439014",
        "nameAr": "كتاب العلوم",
        "nameEn": "Science Book"
      },
      "subMaterialId": null,
      "subMaterial": null,
      "educationalStageId": "507f1f77bcf86cd799439015",
      "educationalStage": {
        "id": "507f1f77bcf86cd799439015",
        "nameAr": "المرحلة المتوسطة",
        "nameEn": "Middle School"
      },
      "videoLink": "https://example.com/videos/physics-advanced.mp4",
      "attachmentFile": null,
      "createdAt": "2024-01-01T01:00:00.000Z",
      "updatedAt": "2024-01-01T01:00:00.000Z"
    }
  ],
  "message": "Lectures retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### 2. Get Lectures by Sub-Material ID

Get all lectures for a specific sub-material (requires authentication).

**Endpoint:** `GET /api/sub-materials/:subMaterialId/lectures`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439040",
      "name": "Introduction to Algebra",
      "description": "Basic algebraic concepts",
      "startAt": "2024-01-15T10:00:00.000Z",
      "endAt": "2024-01-15T11:30:00.000Z",
      "educationalMaterialId": "507f1f77bcf86cd799439011",
      "educationalMaterial": {
        "id": "507f1f77bcf86cd799439011",
        "nameAr": "كتاب الرياضيات",
        "nameEn": "Mathematics Book"
      },
      "subMaterialId": "507f1f77bcf86cd799439012",
      "subMaterial": {
        "id": "507f1f77bcf86cd799439012",
        "nameAr": "الجبر",
        "nameEn": "Algebra"
      },
      "educationalStageId": "507f1f77bcf86cd799439013",
      "educationalStage": {
        "id": "507f1f77bcf86cd799439013",
        "nameAr": "المرحلة الابتدائية",
        "nameEn": "Elementary School"
      },
      "videoLink": "https://example.com/videos/algebra-intro.mp4",
      "attachmentFile": "/uploads/lectures/lecture-notes-1234567890.pdf",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Lectures retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Sub material not found
- `500` - Server error

---

### 3. Get Lecture By ID

Get a specific lecture by ID with populated references (requires authentication).

**Endpoint:** `GET /api/lectures/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439040",
    "name": "Introduction to Mathematics",
    "description": "Basic concepts of mathematics for beginners",
    "startAt": "2024-01-15T10:00:00.000Z",
    "endAt": "2024-01-15T11:30:00.000Z",
    "educationalMaterialId": "507f1f77bcf86cd799439011",
    "educationalMaterial": {
      "id": "507f1f77bcf86cd799439011",
      "nameAr": "كتاب الرياضيات",
      "nameEn": "Mathematics Book"
    },
    "subMaterialId": "507f1f77bcf86cd799439012",
    "subMaterial": {
      "id": "507f1f77bcf86cd799439012",
      "nameAr": "الجبر",
      "nameEn": "Algebra"
    },
    "educationalStageId": "507f1f77bcf86cd799439013",
    "educationalStage": {
      "id": "507f1f77bcf86cd799439013",
      "nameAr": "المرحلة الابتدائية",
      "nameEn": "Elementary School"
    },
    "videoLink": "https://example.com/videos/math-intro.mp4",
    "attachmentFile": "/uploads/lectures/lecture-notes-1234567890.pdf",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Lecture retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Lecture not found
- `500` - Server error

---

### 3. Create Lecture

Create a new lecture. Supports file upload for attachments (requires authentication).

**Endpoint:** `POST /api/lectures`

**Content-Type:** `multipart/form-data` (if uploading attachment) or `application/json` (without attachment)

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Request Body (Form Data or JSON):**
- **name** (required): String, 2-200 characters
- **description** (optional): String, maximum 1000 characters
- **startAt** (required): String, ISO date/time format (e.g., "2024-01-15T10:00:00.000Z")
- **endAt** (required): String, ISO date/time format, must be after startAt
- **educationalMaterialId** (required): String, valid MongoDB ObjectId
- **subMaterialId** (optional): String, valid MongoDB ObjectId
- **educationalStageId** (required): String, valid MongoDB ObjectId
- **videoLink** (optional): String, valid URL
- **attachmentFile** (optional): File, allowed types: PDF, Word, Excel, PowerPoint, Images, ZIP, RAR, 7Z, TXT, CSV (max 50MB)

**Example Request (with attachment file):**
```bash
curl -X POST http://localhost:3000/api/lectures \
  -H "Authorization: Bearer <your-token-here>" \
  -F "name=Introduction to Mathematics" \
  -F "description=Basic concepts of mathematics for beginners" \
  -F "startAt=2024-01-15T10:00:00.000Z" \
  -F "endAt=2024-01-15T11:30:00.000Z" \
  -F "educationalMaterialId=507f1f77bcf86cd799439011" \
  -F "subMaterialId=507f1f77bcf86cd799439012" \
  -F "educationalStageId=507f1f77bcf86cd799439013" \
  -F "videoLink=https://example.com/videos/math-intro.mp4" \
  -F "attachmentFile=@/path/to/lecture-notes.pdf"
```

**Example Request (without attachment, JSON):**
```json
{
  "name": "Introduction to Mathematics",
  "description": "Basic concepts of mathematics for beginners",
  "startAt": "2024-01-15T10:00:00.000Z",
  "endAt": "2024-01-15T11:30:00.000Z",
  "educationalMaterialId": "507f1f77bcf86cd799439011",
  "subMaterialId": "507f1f77bcf86cd799439012",
  "educationalStageId": "507f1f77bcf86cd799439013",
  "videoLink": "https://example.com/videos/math-intro.mp4"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439040",
    "name": "Introduction to Mathematics",
    "description": "Basic concepts of mathematics for beginners",
    "startAt": "2024-01-15T10:00:00.000Z",
    "endAt": "2024-01-15T11:30:00.000Z",
    "educationalMaterialId": "507f1f77bcf86cd799439011",
    "educationalMaterial": {
      "id": "507f1f77bcf86cd799439011",
      "nameAr": "كتاب الرياضيات",
      "nameEn": "Mathematics Book"
    },
    "subMaterialId": "507f1f77bcf86cd799439012",
    "subMaterial": {
      "id": "507f1f77bcf86cd799439012",
      "nameAr": "الجبر",
      "nameEn": "Algebra"
    },
    "educationalStageId": "507f1f77bcf86cd799439013",
    "educationalStage": {
      "id": "507f1f77bcf86cd799439013",
      "nameAr": "المرحلة الابتدائية",
      "nameEn": "Elementary School"
    },
    "videoLink": "https://example.com/videos/math-intro.mp4",
    "attachmentFile": "/uploads/lectures/lecture-notes-1234567890.pdf",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Lecture created successfully"
}
```

**Error Responses:**
- `400` - Validation error, invalid date/time, invalid referenced IDs, or endAt not after startAt
- `401` - Authentication required
- `404` - Educational material, sub material, or educational stage not found
- `500` - Server error

---

### 5. Update Lecture

Update lecture information. Supports file upload for attachments (requires authentication).

**Endpoint:** `PUT /api/lectures/:id`

**Content-Type:** `multipart/form-data` (if uploading attachment) or `application/json`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Request Body (all fields optional, can use form-data or JSON):**
- **name**: String, 2-200 characters
- **description**: String, maximum 1000 characters
- **startAt**: String, ISO date/time format
- **endAt**: String, ISO date/time format, must be after startAt
- **educationalMaterialId**: String, valid MongoDB ObjectId
- **subMaterialId**: String, valid MongoDB ObjectId (or empty string to clear)
- **educationalStageId**: String, valid MongoDB ObjectId
- **videoLink**: String, valid URL (or empty string to clear)
- **attachmentFile**: File, allowed types: PDF, Word, Excel, PowerPoint, Images, ZIP, RAR, 7Z, TXT, CSV (max 50MB)

**Example Request (with attachment file):**
```bash
curl -X PUT http://localhost:3000/api/lectures/507f1f77bcf86cd799439040 \
  -H "Authorization: Bearer <your-token-here>" \
  -F "name=Introduction to Advanced Mathematics" \
  -F "description=Updated description" \
  -F "videoLink=https://example.com/videos/math-advanced.mp4" \
  -F "attachmentFile=@/path/to/new-notes.pdf"
```

**Example Request (without attachment, JSON):**
```json
{
  "name": "Introduction to Advanced Mathematics",
  "description": "Updated description",
  "startAt": "2024-01-15T10:00:00.000Z",
  "endAt": "2024-01-15T12:00:00.000Z",
  "videoLink": "https://example.com/videos/math-advanced.mp4"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439040",
    "name": "Introduction to Advanced Mathematics",
    "description": "Updated description",
    "startAt": "2024-01-15T10:00:00.000Z",
    "endAt": "2024-01-15T12:00:00.000Z",
    "educationalMaterialId": "507f1f77bcf86cd799439011",
    "educationalMaterial": {
      "id": "507f1f77bcf86cd799439011",
      "nameAr": "كتاب الرياضيات",
      "nameEn": "Mathematics Book"
    },
    "subMaterialId": "507f1f77bcf86cd799439012",
    "subMaterial": {
      "id": "507f1f77bcf86cd799439012",
      "nameAr": "الجبر",
      "nameEn": "Algebra"
    },
    "educationalStageId": "507f1f77bcf86cd799439013",
    "educationalStage": {
      "id": "507f1f77bcf86cd799439013",
      "nameAr": "المرحلة الابتدائية",
      "nameEn": "Elementary School"
    },
    "videoLink": "https://example.com/videos/math-advanced.mp4",
    "attachmentFile": "/uploads/lectures/lecture-new-notes-9876543210.pdf",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T02:00:00.000Z"
  },
  "message": "Lecture updated successfully"
}
```

**Error Responses:**
- `400` - Validation error, invalid date/time, invalid referenced IDs, or endAt not after startAt
- `401` - Authentication required
- `404` - Lecture, educational material, sub material, or educational stage not found
- `500` - Server error

---

### 6. Delete Lecture

Delete a lecture (requires authentication).

**Endpoint:** `DELETE /api/lectures/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Lecture deleted successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Lecture not found
- `500` - Server error

---

## Example cURL Commands for Lectures

### Get All Lectures
```bash
curl -X GET http://localhost:3000/api/lectures \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Lectures by Sub-Material ID
```bash
curl -X GET http://localhost:3000/api/sub-materials/507f1f77bcf86cd799439012/lectures \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Lecture By ID
```bash
curl -X GET http://localhost:3000/api/lectures/507f1f77bcf86cd799439040 \
  -H "Authorization: Bearer <your-token-here>"
```

### Create Lecture (with attachment)
```bash
curl -X POST http://localhost:3000/api/lectures \
  -H "Authorization: Bearer <your-token-here>" \
  -F "name=Introduction to Mathematics" \
  -F "description=Basic concepts of mathematics" \
  -F "startAt=2024-01-15T10:00:00.000Z" \
  -F "endAt=2024-01-15T11:30:00.000Z" \
  -F "educationalMaterialId=507f1f77bcf86cd799439011" \
  -F "subMaterialId=507f1f77bcf86cd799439012" \
  -F "educationalStageId=507f1f77bcf86cd799439013" \
  -F "videoLink=https://example.com/videos/math-intro.mp4" \
  -F "attachmentFile=@/path/to/notes.pdf"
```

### Create Lecture (without attachment, JSON)
```bash
curl -X POST http://localhost:3000/api/lectures \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Introduction to Mathematics",
    "description": "Basic concepts of mathematics",
    "startAt": "2024-01-15T10:00:00.000Z",
    "endAt": "2024-01-15T11:30:00.000Z",
    "educationalMaterialId": "507f1f77bcf86cd799439011",
    "subMaterialId": "507f1f77bcf86cd799439012",
    "educationalStageId": "507f1f77bcf86cd799439013",
    "videoLink": "https://example.com/videos/math-intro.mp4"
  }'
```

### Update Lecture
```bash
curl -X PUT http://localhost:3000/api/lectures/507f1f77bcf86cd799439040 \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Introduction to Advanced Mathematics",
    "endAt": "2024-01-15T12:00:00.000Z"
  }'
```

### Update Lecture (with new attachment)
```bash
curl -X PUT http://localhost:3000/api/lectures/507f1f77bcf86cd799439040 \
  -H "Authorization: Bearer <your-token-here>" \
  -F "name=Introduction to Advanced Mathematics" \
  -F "attachmentFile=@/path/to/new-notes.pdf"
```

### Delete Lecture
```bash
curl -X DELETE http://localhost:3000/api/lectures/507f1f77bcf86cd799439040 \
  -H "Authorization: Bearer <your-token-here>"
```

---

## Validation Rules for Lectures

### Create Lecture
- **name**: Required, 2-200 characters
- **description**: Optional, maximum 1000 characters
- **startAt**: Required, valid ISO date/time format
- **endAt**: Required, valid ISO date/time format, must be after startAt
- **educationalMaterialId**: Required, valid MongoDB ObjectId, must reference an existing educational material
- **subMaterialId**: Optional, valid MongoDB ObjectId, must reference an existing educational material
- **educationalStageId**: Required, valid MongoDB ObjectId, must reference an existing educational stage
- **videoLink**: Optional, valid URL format
- **attachmentFile**: Optional, file upload (PDF, Word, Excel, PowerPoint, Images, ZIP, RAR, 7Z, TXT, CSV), maximum 50MB

### Update Lecture
- At least one field must be provided
- **name**: Optional, 2-200 characters
- **description**: Optional, maximum 1000 characters
- **startAt**: Optional, valid ISO date/time format
- **endAt**: Optional, valid ISO date/time format, must be after startAt (if both dates are provided)
- **educationalMaterialId**: Optional, valid MongoDB ObjectId, must reference an existing educational material
- **subMaterialId**: Optional, valid MongoDB ObjectId, must reference an existing educational material (or empty string to clear)
- **educationalStageId**: Optional, valid MongoDB ObjectId, must reference an existing educational stage
- **videoLink**: Optional, valid URL format (or empty string to clear)
- **attachmentFile**: Optional, file upload (PDF, Word, Excel, PowerPoint, Images, ZIP, RAR, 7Z, TXT, CSV), maximum 50MB

---

## Lecture Data Structure

A lecture includes:
- **id**: Unique identifier for the lecture
- **name**: Lecture name (2-200 characters)
- **description**: Optional description (maximum 1000 characters)
- **startAt**: Start date and time (ISO date/time format)
- **endAt**: End date and time (ISO date/time format, must be after startAt)
- **educationalMaterialId**: Reference to EducationalMaterial model (ObjectId)
- **educationalMaterial**: Populated educational material object with:
  - **id**: Educational material ID
  - **nameAr**: Arabic name
  - **nameEn**: English name
- **subMaterialId**: Optional reference to EducationalMaterial model (ObjectId) for sub-material
- **subMaterial**: Populated sub-material object (if subMaterialId is provided) with:
  - **id**: Sub-material ID
  - **nameAr**: Arabic name
  - **nameEn**: English name
- **educationalStageId**: Reference to EducationalStage model (ObjectId)
- **educationalStage**: Populated educational stage object with:
  - **id**: Educational stage ID
  - **nameAr**: Arabic name
  - **nameEn**: English name
- **videoLink**: Optional URL to video content
- **attachmentFile**: Optional path to uploaded attachment file (served from `/uploads/lectures/`)
- **createdAt**: Timestamp when the lecture was created
- **updatedAt**: Timestamp when the lecture was last updated

**Note:** 
- All referenced IDs (educationalMaterialId, subMaterialId, educationalStageId) must exist in their respective collections before a lecture can be created or updated
- The `endAt` date/time must always be after the `startAt` date/time
- Attachment files are uploaded to `/uploads/lectures/` directory and can be accessed via the static file server
- Supported attachment file types: PDF, Word documents (.doc, .docx), Excel (.xls, .xlsx), PowerPoint (.ppt, .pptx), Images (JPEG, PNG, GIF, WEBP), Archives (ZIP, RAR, 7Z), Text files (TXT, CSV)
- Maximum attachment file size is 50MB

---

## Sub-Material Endpoints

Sub-materials are sub-categories or sub-topics within educational materials. Each sub-material belongs to a specific educational material.

### 1. Get All Sub-Materials

Get a list of all sub-materials, optionally filtered by educational material (requires authentication).

**Endpoint:** `GET /api/sub-materials` or `GET /api/sub-materials?educationalMaterialId=<educationalMaterialId>`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Query Parameters:**
- `educationalMaterialId` (optional): Filter sub-materials by educational material ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439050",
      "nameAr": "الجبر",
      "nameEn": "Algebra",
      "description": "Basic algebraic concepts",
      "educationalMaterialId": "507f1f77bcf86cd799439011",
      "educationalMaterial": {
        "id": "507f1f77bcf86cd799439011",
        "nameAr": "كتاب الرياضيات",
        "nameEn": "Mathematics Book"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439051",
      "nameAr": "الهندسة",
      "nameEn": "Geometry",
      "description": "Geometric shapes and concepts",
      "educationalMaterialId": "507f1f77bcf86cd799439011",
      "educationalMaterial": {
        "id": "507f1f77bcf86cd799439011",
        "nameAr": "كتاب الرياضيات",
        "nameEn": "Mathematics Book"
      },
      "createdAt": "2024-01-01T01:00:00.000Z",
      "updatedAt": "2024-01-01T01:00:00.000Z"
    }
  ],
  "message": "Sub materials retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### 2. Get Sub-Materials by Educational Material ID (Nested Route)

Get all sub-materials for a specific educational material (requires authentication).

**Endpoint:** `GET /api/educational-materials/:educationalMaterialId/sub-materials`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439050",
      "nameAr": "الجبر",
      "nameEn": "Algebra",
      "description": "Basic algebraic concepts",
      "educationalMaterialId": "507f1f77bcf86cd799439011",
      "educationalMaterial": {
        "id": "507f1f77bcf86cd799439011",
        "nameAr": "كتاب الرياضيات",
        "nameEn": "Mathematics Book"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Sub materials retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### 3. Get Sub-Material By ID

Get a specific sub-material by ID (requires authentication).

**Endpoint:** `GET /api/sub-materials/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439050",
    "nameAr": "الجبر",
    "nameEn": "Algebra",
    "description": "Basic algebraic concepts",
    "educationalMaterialId": "507f1f77bcf86cd799439011",
    "educationalMaterial": {
      "id": "507f1f77bcf86cd799439011",
      "nameAr": "كتاب الرياضيات",
      "nameEn": "Mathematics Book"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Sub material retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Sub material not found
- `500` - Server error

---

### 4. Create Sub-Material

Create a new sub-material (requires authentication).

**Endpoint:** `POST /api/sub-materials`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body:**
```json
{
  "nameAr": "الجبر",
  "nameEn": "Algebra",
  "description": "Basic algebraic concepts",
  "educationalMaterialId": "507f1f77bcf86cd799439011"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439050",
    "nameAr": "الجبر",
    "nameEn": "Algebra",
    "description": "Basic algebraic concepts",
    "educationalMaterialId": "507f1f77bcf86cd799439011",
    "educationalMaterial": {
      "id": "507f1f77bcf86cd799439011",
      "nameAr": "كتاب الرياضيات",
      "nameEn": "Mathematics Book"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Sub material created successfully"
}
```

**Error Responses:**
- `400` - Validation error, educational material not found, or sub-material name already exists for this educational material
- `401` - Authentication required
- `404` - Educational material not found
- `500` - Server error

---

### 5. Create Sub-Material for Educational Material (Nested Route)

Create a new sub-material for a specific educational material (requires authentication).

**Endpoint:** `POST /api/educational-materials/:educationalMaterialId/sub-materials`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body:**
```json
{
  "nameAr": "الجبر",
  "nameEn": "Algebra",
  "description": "Basic algebraic concepts"
}
```

**Note:** The `educationalMaterialId` is taken from the URL parameter, so it doesn't need to be included in the request body.

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439050",
    "nameAr": "الجبر",
    "nameEn": "Algebra",
    "description": "Basic algebraic concepts",
    "educationalMaterialId": "507f1f77bcf86cd799439011",
    "educationalMaterial": {
      "id": "507f1f77bcf86cd799439011",
      "nameAr": "كتاب الرياضيات",
      "nameEn": "Mathematics Book"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Sub material created successfully"
}
```

**Error Responses:**
- `400` - Validation error or sub-material name already exists for this educational material
- `401` - Authentication required
- `404` - Educational material not found
- `500` - Server error

---

### 6. Update Sub-Material

Update sub-material information (requires authentication).

**Endpoint:** `PUT /api/sub-materials/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "nameAr": "الجبر المتقدم",
  "nameEn": "Advanced Algebra",
  "description": "Advanced algebraic concepts",
  "educationalMaterialId": "507f1f77bcf86cd799439011"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439050",
    "nameAr": "الجبر المتقدم",
    "nameEn": "Advanced Algebra",
    "description": "Advanced algebraic concepts",
    "educationalMaterialId": "507f1f77bcf86cd799439011",
    "educationalMaterial": {
      "id": "507f1f77bcf86cd799439011",
      "nameAr": "كتاب الرياضيات",
      "nameEn": "Mathematics Book"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T02:00:00.000Z"
  },
  "message": "Sub material updated successfully"
}
```

**Error Responses:**
- `400` - Validation error, educational material not found, or sub-material name already exists for this educational material
- `401` - Authentication required
- `404` - Sub material or educational material not found
- `500` - Server error

---

### 7. Delete Sub-Material

Delete a sub-material (requires authentication).

**Endpoint:** `DELETE /api/sub-materials/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Sub material deleted successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Sub material not found
- `500` - Server error

---

## Example cURL Commands for Sub-Materials

### Get All Sub-Materials
```bash
curl -X GET http://localhost:3000/api/sub-materials \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Sub-Materials by Educational Material ID (Query Parameter)
```bash
curl -X GET "http://localhost:3000/api/sub-materials?educationalMaterialId=507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Sub-Materials by Educational Material ID (Nested Route)
```bash
curl -X GET http://localhost:3000/api/educational-materials/507f1f77bcf86cd799439011/sub-materials \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Sub-Material By ID
```bash
curl -X GET http://localhost:3000/api/sub-materials/507f1f77bcf86cd799439050 \
  -H "Authorization: Bearer <your-token-here>"
```

### Create Sub-Material
```bash
curl -X POST http://localhost:3000/api/sub-materials \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "nameAr": "الجبر",
    "nameEn": "Algebra",
    "description": "Basic algebraic concepts",
    "educationalMaterialId": "507f1f77bcf86cd799439011"
  }'
```

### Create Sub-Material for Educational Material (Nested Route)
```bash
curl -X POST http://localhost:3000/api/educational-materials/507f1f77bcf86cd799439011/sub-materials \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "nameAr": "الجبر",
    "nameEn": "Algebra",
    "description": "Basic algebraic concepts"
  }'
```

### Update Sub-Material
```bash
curl -X PUT http://localhost:3000/api/sub-materials/507f1f77bcf86cd799439050 \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "nameAr": "الجبر المتقدم",
    "nameEn": "Advanced Algebra",
    "description": "Advanced algebraic concepts"
  }'
```

### Delete Sub-Material
```bash
curl -X DELETE http://localhost:3000/api/sub-materials/507f1f77bcf86cd799439050 \
  -H "Authorization: Bearer <your-token-here>"
```

---

## Validation Rules for Sub-Materials

### Create Sub-Material
- **nameAr**: Required, 2-100 characters (Arabic name)
- **nameEn**: Required, 2-100 characters (English name), must be unique within the same educational material
- **description**: Optional, maximum 500 characters
- **educationalMaterialId**: Required, valid MongoDB ObjectId, must reference an existing educational material

### Update Sub-Material
- At least one field must be provided
- **nameAr**: Optional, 2-100 characters (Arabic name)
- **nameEn**: Optional, 2-100 characters (English name), must be unique within the same educational material
- **description**: Optional, maximum 500 characters
- **educationalMaterialId**: Optional, valid MongoDB ObjectId, must reference an existing educational material

---

## Sub-Material Data Structure

A sub-material includes:
- **id**: Unique identifier for the sub-material
- **nameAr**: Arabic name (2-100 characters)
- **nameEn**: English name (2-100 characters)
- **description**: Optional description (maximum 500 characters)
- **educationalMaterialId**: Reference to EducationalMaterial model (ObjectId)
- **educationalMaterial**: Populated educational material object with:
  - **id**: Educational material ID
  - **nameAr**: Arabic name
  - **nameEn**: English name
- **createdAt**: Timestamp when the sub-material was created
- **updatedAt**: Timestamp when the sub-material was last updated

**Note:** 
- Each sub-material must belong to an educational material
- The combination of `educationalMaterialId` and `nameEn` must be unique (enforced by compound index)
- This means you can have "Algebra" as a sub-material for "Mathematics Book" and "Algebra" as a sub-material for "Science Book", but you cannot have two "Algebra" sub-materials for the same "Mathematics Book"
- The `educationalMaterialId` must reference an existing educational material in the database

---

## Exam Endpoints

### 1. Get All Exams

Get a list of all exams (requires authentication).

**Endpoint:** `GET /api/exams`

**Query Parameters (optional):**
- `planId` (string): Filter exams by plan
- `educationalMaterialId` (string): Filter exams by educational material
- `subMaterialId` (string): Filter exams by sub-material

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Mathematics Final Exam",
      "description": "Comprehensive exam covering all mathematics topics",
      "duration": 120,
      "totalPoints": 100,
      "questions": [
        {
          "question": "What is 2 + 2?",
          "options": ["3", "4", "5", "6"],
          "correctAnswer": 1,
          "points": 10
        }
      ],
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "message": "Exams retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### 2. Get Exam By ID

Get a specific exam by ID (requires authentication).

**Endpoint:** `GET /api/exams/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Mathematics Final Exam",
    "description": "Comprehensive exam covering all mathematics topics",
    "duration": 120,
    "totalPoints": 100,
    "questions": [
      {
        "question": "What is 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "question": "What is the capital of France?",
        "options": ["London", "Paris", "Berlin", "Madrid"],
        "correctAnswer": 1,
        "points": 15
      }
    ],
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "Exam retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Exam not found
- `500` - Server error

---

### 3. Create Exam

Create a new exam (requires authentication).

**Endpoint:** `POST /api/exams`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Mathematics Final Exam",
  "description": "Comprehensive exam covering all mathematics topics",
  "duration": 120,
  "totalPoints": 100,
  "educationalMaterialId": "507f1f77bcf86cd799439012",
  "subMaterialId": "507f1f77bcf86cd799439013",
  "questions": [
    {
      "type": "individual",
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": 1,
      "points": 10,
      "correctAnswerReason": "Addition of 2 and 2 equals 4."
    },
    {
      "type": "individual",
      "question": "What is the square root of 16?",
      "options": ["2", "4", "6", "8"],
      "correctAnswer": 1,
      "points": 15,
      "correctAnswerReason": "4 × 4 = 16, so the square root of 16 is 4."
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Mathematics Final Exam",
    "description": "Comprehensive exam covering all mathematics topics",
    "duration": 120,
    "totalPoints": 100,
    "questions": [
      {
        "type": "individual",
        "question": "What is 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "correctAnswer": 1,
        "points": 10,
        "correctAnswerReason": "Addition of 2 and 2 equals 4."
      },
      {
        "type": "individual",
        "question": "What is the square root of 16?",
        "options": ["2", "4", "6", "8"],
        "correctAnswer": 1,
        "points": 15,
        "correctAnswerReason": "4 × 4 = 16, so the square root of 16 is 4."
      }
    ],
    "educationalMaterialId": "507f1f77bcf86cd799439012",
    "subMaterialId": "507f1f77bcf86cd799439013",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "Exam created successfully"
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Authentication required
- `500` - Server error

---

### 3a. Create Exam from PDF or Word Document (One-Time Import)

Create an exam by uploading a single PDF or Word (.doc/.docx) file. The server extracts text from the document and parses it into multiple-choice questions, then creates the exam in MongoDB in one request.

**Endpoint:** `POST /api/exams/from-document`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: multipart/form-data
```

**Request (multipart form):**
- **file** (required): PDF or Word document (.pdf, .doc, .docx). Max 15MB.
- **title** (required): Exam title, 2–200 characters.
- **duration** (required): Exam duration in minutes (1–600).
- **educationalMaterialId** (required): Valid MongoDB ObjectId.
- **subMaterialId** (required): Valid MongoDB ObjectId.
- **description** (optional): Exam description, max 1000 characters.
- **planId** (optional): Plan ObjectId if exam is tied to a plan.
- **isPaid** (optional): `true` if the exam is paid.
- **price** (optional): Required if `isPaid` is true; must be > 0.
- **pointsPerQuestion** (optional): Points per parsed question (1–100). Default: 10.

**Document format:** Use blocks like: `1. Question text?` then `A) opt1` `B) opt2` … and `Answer: A` (or `Correct: B`, `Key: 1`). The parser splits by question markers and option lines, then detects the answer line.

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/exams/from-document \
  -H "Authorization: Bearer <your-token>" \
  -F "file=@/path/to/exam.pdf" \
  -F "title=Geography Quiz" \
  -F "duration=30" \
  -F "educationalMaterialId=507f1f77bcf86cd799439012" \
  -F "subMaterialId=507f1f77bcf86cd799439013" \
  -F "pointsPerQuestion=10"
```

**Response (201 Created):** Same shape as Create Exam (exam with id, title, duration, totalPoints, questions, etc.). `totalPoints` = sum of question points from parsing.

**Error Responses:**
- `400` - Missing/invalid file, unsupported format, or no questions extracted.
- `401` - Authentication required
- `500` - Server error

---

### 4. Update Exam

Update an existing exam (requires authentication).

**Endpoint:** `PUT /api/exams/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Mathematics Final Exam",
  "duration": 90
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Updated Mathematics Final Exam",
    "description": "Comprehensive exam covering all mathematics topics",
    "duration": 90,
    "totalPoints": 100,
    "questions": [
      {
        "question": "What is 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "correctAnswer": 1,
        "points": 10
      }
    ],
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "Exam updated successfully"
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Authentication required
- `404` - Exam not found
- `500` - Server error

---

### 5. Delete Exam

Delete an exam (requires authentication).

**Endpoint:** `DELETE /api/exams/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Exam deleted successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Exam not found
- `500` - Server error

---

### 6. Solve Exam

Submit answers for an exam and get results (requires authentication).

**Note:** For paid exams, the student must have an approved purchase request to solve the exam. Free exams are accessible to all authenticated students. If a student tries to solve a paid exam without approval, they will receive a 403 Forbidden error.

**Endpoint:** `POST /api/exams/:id/solve`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body:**
```json
{
  "answers": [1, 1, 0, -1]
}
```

**Note:** 
- `answers` is an array of selected answer indices (0-based)
- Use `-1` for unanswered questions
- Array length must match the number of questions in the exam

**Result:** Each item in `result.answers` may include **correctAnswerReason** (if set on the question). Use it when `isCorrect` is false to show the student why their answer was wrong, e.g. "The correct answer is [options[correctAnswer]] because [correctAnswerReason]."

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "result": {
      "id": "507f1f77bcf86cd799439020",
      "examId": "507f1f77bcf86cd799439011",
      "studentId": "507f1f77bcf86cd799439015",
      "totalScore": 75,
      "totalPoints": 100,
      "percentage": 75.00,
      "answers": [
        {
          "questionIndex": 0,
          "selectedAnswer": 1,
          "isCorrect": true,
          "pointsEarned": 10,
          "correctAnswer": 1,
          "question": "What is 2 + 2?",
          "options": ["3", "4", "5", "6"]
        },
        {
          "questionIndex": 1,
          "selectedAnswer": 1,
          "isCorrect": true,
          "pointsEarned": 15,
          "correctAnswer": 1,
          "question": "What is the square root of 16?",
          "options": ["2", "4", "6", "8"]
        },
        {
          "questionIndex": 2,
          "selectedAnswer": 0,
          "isCorrect": false,
          "pointsEarned": 0,
          "correctAnswer": 2,
          "question": "What is 5 * 3?",
          "options": ["10", "12", "15", "18"],
          "correctAnswerReason": "5 × 3 = 15, so the correct answer is 15."
        },
        {
          "questionIndex": 3,
          "selectedAnswer": -1,
          "isCorrect": false,
          "pointsEarned": 0,
          "correctAnswer": 0,
          "question": "What is 10 / 2?",
          "options": ["5", "6", "7", "8"],
          "correctAnswerReason": "10 ÷ 2 = 5."
        }
      ],
      "submittedAt": "2024-01-15T12:00:00.000Z",
      "createdAt": "2024-01-15T12:00:00.000Z"
    } 
  },
  "message": "Exam submitted successfully"
}
```

**Error Responses:**
- `400` - Validation error (invalid answers array, wrong length, etc.)
- `401` - Authentication required
- `403` - Access denied (for paid exams, student must have approved purchase)
- `404` - Exam not found
- `500` - Server error

---

## Example cURL Commands for Exams

### Get All Exams
```bash
curl -X GET http://localhost:3000/api/exams \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Exam By ID
```bash
curl -X GET http://localhost:3000/api/exams/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>"
```

### Create Exam
```bash
curl -X POST http://localhost:3000/api/exams \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mathematics Final Exam",
    "description": "Comprehensive exam covering all mathematics topics",
    "duration": 120,
    "totalPoints": 100,
    "educationalMaterialId": "507f1f77bcf86cd799439012",
    "subMaterialId": "507f1f77bcf86cd799439013",
    "questions": [
      {
        "type": "individual",
        "question": "What is 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "correctAnswer": 1,
        "points": 10,
        "correctAnswerReason": "Addition of 2 and 2 equals 4."
      },
      {
        "type": "individual",
        "question": "What is the square root of 16?",
        "options": ["2", "4", "6", "8"],
        "correctAnswer": 1,
        "points": 15,
        "correctAnswerReason": "4 × 4 = 16, so the square root of 16 is 4."
      }
    ]
  }'
```

### Update Exam
```bash
curl -X PUT http://localhost:3000/api/exams/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Mathematics Final Exam",
    "duration": 90
  }'
```

### Delete Exam
```bash
curl -X DELETE http://localhost:3000/api/exams/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>"
```

### Solve Exam
```bash
curl -X POST http://localhost:3000/api/exams/507f1f77bcf86cd799439011/solve \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [1, 1, 0, -1]
  }'
```

---

## Validation Rules for Exams

### Create Exam
- **title**: Required, 2-200 characters
- **description**: Optional, maximum 1000 characters
- **duration**: Required, 1-600 minutes
- **totalPoints**: Required, must be at least 1, must equal sum of question points
- **questions**: Required, array with at least one question
- **isPaid**: Optional, boolean (default: false). If true, exam is paid
- **price**: Optional, number. Required if isPaid is true, must be > 0. Should not be set for free exams
  - Each question must have:
    - **type**: `individual` or `partial` (partial has `passage` and `subQuestions`)
    - **question**: Required for individual, 3-500 characters
    - **options**: Required, array with 2-10 non-empty strings
    - **correctAnswer**: Required, valid index (0 to options.length - 1)
    - **points**: Required, 1-100 points
    - **correctAnswerReason**: Optional, string up to 1000 characters. Shown in solve result when the student answers wrong.

### Update Exam
- At least one field must be provided
- **title**: Optional, 2-200 characters
- **description**: Optional, maximum 1000 characters
- **duration**: Optional, 1-600 minutes
- **totalPoints**: Optional, must be at least 1, must equal sum of question points (if questions are updated)
- **questions**: Optional, array with at least one question
- **isPaid**: Optional, boolean. If set to true, price must be provided and > 0. If set to false, price will be removed
- **price**: Optional, number. If > 0, isPaid will be set to true. If 0 or null, isPaid will be set to false (same validation as create)

### Solve Exam
- **answers**: Required, array of numbers
  - Each answer must be a number
  - Use `-1` for unanswered questions
  - Valid answer indices are 0 or greater (must be within valid option range)
  - Array length must match the number of questions in the exam

---

## Exam Data Structure

An exam includes:
- **id**: Unique identifier for the exam
- **title**: Exam title (2-200 characters)
- **description**: Optional description (maximum 1000 characters)
- **duration**: Duration in minutes (1-600)
- **totalPoints**: Total points for the exam (must equal sum of question points)
- **questions**: Array of question objects, each containing:
  - **type**: `individual` or `partial`
  - **question**: Question text (3-500 characters)
  - **options**: Array of answer options (2-10 options, each non-empty)
  - **correctAnswer**: Index of the correct answer (0-based)
  - **points**: Points awarded for correct answer (1-100)
  - **correctAnswerReason**: Optional. Why the correct option is correct; shown in results when the student is wrong.
- **isPaid**: Boolean indicating if the exam is paid (default: false)
- **price**: Optional price in currency units (required if isPaid is true, must be > 0)
- **createdAt**: Timestamp when the exam was created
- **updatedAt**: Timestamp when the exam was last updated

**Note:**
- If `isPaid` is `true`, `price` must be provided and must be greater than 0
- If `isPaid` is `false`, `price` should not be set (or can be omitted)

## Exam Result Data Structure

An exam result includes:
- **id**: Unique identifier for the result
- **examId**: Reference to the exam (ObjectId)
- **studentId**: Reference to the student/user (ObjectId)
- **totalScore**: Total points earned
- **totalPoints**: Total points possible
- **percentage**: Percentage score (0-100)
- **answers**: Array of answer results, each containing:
  - **questionIndex**: Index of the question (0-based)
  - **selectedAnswer**: Selected answer index (-1 if unanswered)
  - **isCorrect**: Boolean indicating if answer is correct
  - **pointsEarned**: Points earned for this question
  - **correctAnswer**: Correct answer index
  - **question**: Question text
  - **options**: Array of options
  - **correctAnswerReason**: Optional. Reason why the correct option is correct; use when `isCorrect` is false to show e.g. "The correct answer is X because [reason]."
- **submittedAt**: Timestamp when the exam was submitted
- **createdAt**: Timestamp when the result was created

**Note:**
- Each exam result is linked to a specific exam and student
- The result is automatically calculated based on the submitted answers
- Unanswered questions (indicated by -1) receive 0 points
- The percentage is calculated as (totalScore / totalPoints) * 100

---

## Common Exam Mistakes Endpoints (الأخطاء الشائعة في امتحانات الثانوية العامة)

CRUD for common mistakes content in Thanaweya Amma (الثانوية العامة) exams. All endpoints require authentication.

**Base path:** `GET|POST|PUT|DELETE /api/common-exam-mistakes`

**Headers:** `Authorization: Bearer <token>` required for all requests.

---

### 1. Get All Common Exam Mistakes

**Endpoint:** `GET /api/common-exam-mistakes`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439091",
      "title": "الخطأ في تمييز الفاعل من نائب الفاعل",
      "content": "كثير من الطلاب يخلطون بين الفاعل ونائب الفاعل في الجملة المبنية للمجهول. الفاعل يأتي بعد الفعل المبني للمعلوم، ونائب الفاعل يحل محل الفاعل في الجملة المبنية للمجهول.",
      "subject": "نحو",
      "order": 0,
      "published": true,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439092",
      "title": "خطأ في إعراب إن وأخواتها",
      "content": "إن وأخواتها ترفع الاسم وتنصب الخبر. يخطئ الطلاب أحياناً في تعيين الاسم أو الخبر أو في نوع الإعراب.",
      "subject": "نحو",
      "order": 1,
      "published": true,
      "createdAt": "2024-01-15T10:05:00.000Z",
      "updatedAt": "2024-01-15T10:05:00.000Z"
    }
  ],
  "message": "Common exam mistakes retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### 2. Get Common Exam Mistake By ID

**Endpoint:** `GET /api/common-exam-mistakes/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439091",
    "title": "الخطأ في تمييز الفاعل من نائب الفاعل",
    "content": "كثير من الطلاب يخلطون بين الفاعل ونائب الفاعل في الجملة المبنية للمجهول.",
    "subject": "نحو",
    "order": 0,
    "published": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "Common exam mistake retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Common exam mistake not found
- `500` - Server error

---

### 3. Create Common Exam Mistake

**Endpoint:** `POST /api/common-exam-mistakes`

**Request Body:**
```json
{
  "title": "الخطأ في تمييز الفاعل من نائب الفاعل",
  "content": "كثير من الطلاب يخلطون بين الفاعل ونائب الفاعل في الجملة المبنية للمجهول. الفاعل يأتي بعد الفعل المبني للمعلوم، ونائب الفاعل يحل محل الفاعل في الجملة المبنية للمجهول.",
  "subject": "نحو",
  "order": 0,
  "published": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439091",
    "title": "الخطأ في تمييز الفاعل من نائب الفاعل",
    "content": "كثير من الطلاب يخلطون بين الفاعل ونائب الفاعل في الجملة المبنية للمجهول. الفاعل يأتي بعد الفعل المبني للمعلوم، ونائب الفاعل يحل محل الفاعل في الجملة المبنية للمجهول.",
    "subject": "نحو",
    "order": 0,
    "published": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "Common exam mistake created successfully"
}
```

**Error Responses:**
- `400` - Validation error (title/content required, length limits)
- `401` - Authentication required
- `500` - Server error

**Validation Rules:**
- **title**: Required, 2–500 characters
- **content**: Required, non-empty
- **subject**: Optional, max 200 characters
- **order**: Optional, integer (default 0)
- **published**: Optional, boolean (default true)

---

### 4. Update Common Exam Mistake

**Endpoint:** `PUT /api/common-exam-mistakes/:id`

**Request Body (all fields optional):**
```json
{
  "title": "الخطأ في تمييز الفاعل من نائب الفاعل (محدث)",
  "content": "محتوى محدث يوضح الفرق بين الفاعل ونائب الفاعل.",
  "subject": "نحو",
  "order": 1,
  "published": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439091",
    "title": "الخطأ في تمييز الفاعل من نائب الفاعل (محدث)",
    "content": "محتوى محدث يوضح الفرق بين الفاعل ونائب الفاعل.",
    "subject": "نحو",
    "order": 1,
    "published": false,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T14:00:00.000Z"
  },
  "message": "Common exam mistake updated successfully"
}
```

**Error Responses:**
- `400` - Validation error or no fields provided
- `401` - Authentication required
- `404` - Common exam mistake not found
- `500` - Server error

---

### 5. Delete Common Exam Mistake

**Endpoint:** `DELETE /api/common-exam-mistakes/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Common exam mistake deleted successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Common exam mistake not found
- `500` - Server error

---

## Example cURL Commands for Common Exam Mistakes

### Get All
```bash
curl -X GET "http://localhost:3000/api/common-exam-mistakes" \
  -H "Authorization: Bearer <your-token-here>"
```

### Get By ID
```bash
curl -X GET "http://localhost:3000/api/common-exam-mistakes/507f1f77bcf86cd799439091" \
  -H "Authorization: Bearer <your-token-here>"
```

### Create
```bash
curl -X POST "http://localhost:3000/api/common-exam-mistakes" \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "الخطأ في تمييز الفاعل من نائب الفاعل",
    "content": "كثير من الطلاب يخلطون بين الفاعل ونائب الفاعل في الجملة المبنية للمجهول.",
    "subject": "نحو",
    "order": 0,
    "published": true
  }'
```

### Update
```bash
curl -X PUT "http://localhost:3000/api/common-exam-mistakes/507f1f77bcf86cd799439091" \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "الخطأ في تمييز الفاعل من نائب الفاعل (محدث)",
    "published": true
  }'
```

### Delete
```bash
curl -X DELETE "http://localhost:3000/api/common-exam-mistakes/507f1f77bcf86cd799439091" \
  -H "Authorization: Bearer <your-token-here>"
```

---

## Common Exam Mistake Data Structure

A common exam mistake item includes:
- **id**: Unique identifier
- **title**: Title (2–500 characters), e.g. "الخطأ في تمييز الفاعل من نائب الفاعل"
- **content**: Full explanation content (required)
- **subject**: Optional subject/category (e.g. نحو، بلاغة), max 200 characters
- **order**: Display order (integer, default 0). Items are returned sorted by order then createdAt.
- **published**: Boolean (default true). Can be used to hide from public listing.
- **createdAt**: Timestamp when created
- **updatedAt**: Timestamp when last updated

**Note:** This content is intended for "الأخطاء الشائعة في امتحانات الثانوية العامة" (common mistakes in Thanaweya Amma exams) and can be consumed by the dashboard or mobile app.

---

## Referral Uses (استخدامات الكوبون) – CRUD & data

Each student's code can be used as a **coupon** at most **20 times**. The coupon is used at **registration** (POST /api/students/register), not at login. When a friend registers with that code, the owner gets 50 points and one **referral use** record is created. This API lets you list and manage those records (who used which code).

**Base path:** `GET|DELETE /api/referral-uses`  
**Headers:** `Authorization: Bearer <token>` required.

---

### 1. List referral uses (with optional filter by referrer)

**Endpoint:** `GET /api/referral-uses`

**Query params:**
- `page` (optional): page number, default 1
- `limit` (optional): page size, default 20, max 100
- `referrerStudentId` (optional): filter by owner of the code (student ID)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "507f1f77bcf86cd7994390a1",
        "referrerStudentId": "507f1f77bcf86cd799439011",
        "referrerStudentCode": "ST1234",
        "referrerUsername": "ahmed",
        "referredStudentId": "507f1f77bcf86cd799439022",
        "referredStudentCode": "ST5678",
        "referredUsername": "sara",
        "pointsGranted": 50,
        "usedAt": "2024-01-15T12:00:00.000Z",
        "createdAt": "2024-01-15T12:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "maxUsesPerReferrer": 20
  },
  "message": "Referral uses retrieved successfully"
}
```

---

### 2. Get referral use by ID

**Endpoint:** `GET /api/referral-uses/:id`

**Response (200 OK):** Same shape as one element of `items` above.

---

### 3. Get referral stats for a referrer (count / max)

**Endpoint:** `GET /api/referral-uses/stats/referrer/:studentId`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "count": 5,
    "max": 20
  },
  "message": "Referral stats retrieved successfully"
}
```

---

### 4. Delete referral use (admin)

**Endpoint:** `DELETE /api/referral-uses/:id`

**Response (200 OK):** `{ "success": true, "data": null, "message": "Referral use deleted successfully" }`

**Note:** Deleting a record does not reverse the 50 points already granted to the referrer.

---

## Exam Build & Build Request Endpoints

The Exam Build API provides templates for generating exams from the question bank. The **Build Request** flow allows students to submit a request with full exam config (title, duration, material, sub-materials, number of questions, paid/free, price) **plus a transfer screenshot**. Once an admin approves, an exam is generated from that config and the student can solve it from **My Built Exams**.

**Base path:** `/api/exam-builds`

All endpoints require `Authorization: Bearer <token>` unless noted.

---

### 1. Request Build Exam (Student)

Submit a build request with full exam configuration and transfer screenshot. Student must be authenticated.

**Endpoint:** `POST /api/exam-builds/requests`

**Content-Type:** `multipart/form-data`

**Form fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | 2–200 chars |
| description | string | No | Max 1000 chars |
| duration | number | Yes | 1–600 minutes |
| educationalMaterialId | string | Yes | ObjectId of material |
| subMaterialIds | string | Yes | JSON array of ObjectIds, e.g. `["id1","id2"]`; at least one |
| numberOfQuestions | number | Yes | 1–200 |
| isPaid | string | No | `"true"` or `"false"` (default `"false"`) |
| price | number | If isPaid | Required and > 0 when isPaid is true |
| transferScreenshot | file | Yes | Image file (transfer proof) |

**Example Request (curl):**
```bash
curl -X POST "http://localhost:3000/api/exam-builds/requests" \
  -H "Authorization: Bearer <your-token>" \
  -F "title=Math Quiz Ch1" \
  -F "description=Chapter 1 review" \
  -F "duration=45" \
  -F "educationalMaterialId=507f1f77bcf86cd799439011" \
  -F 'subMaterialIds=["507f1f77bcf86cd799439012","507f1f77bcf86cd799439013"]' \
  -F "numberOfQuestions=20" \
  -F "isPaid=false" \
  -F "transferScreenshot=@/path/to/screenshot.png"
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439080",
    "studentId": "507f1f77bcf86cd799439020",
    "title": "Math Quiz Ch1",
    "description": "Chapter 1 review",
    "duration": 45,
    "educationalMaterialId": "507f1f77bcf86cd799439011",
    "subMaterialIds": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
    "numberOfQuestions": 20,
    "isPaid": false,
    "transferScreenshot": "/uploads/transfers/abc123.png",
    "status": "pending",
    "requestedAt": "2024-01-15T14:00:00.000Z",
    "createdAt": "2024-01-15T14:00:00.000Z",
    "updatedAt": "2024-01-15T14:00:00.000Z"
  },
  "message": "Build exam request submitted successfully"
}
```

**Error Responses:** `400` (validation, e.g. missing transfer), `401` (auth required)

---

### 2. Request Build Exam For Student (Admin)

Submit a build request on behalf of a student. Same form fields as above, plus:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| studentId | string | Yes | ObjectId of the student |

**Endpoint:** `POST /api/exam-builds/requests-for`

**Example Request (curl):**
```bash
curl -X POST "http://localhost:3000/api/exam-builds/requests-for" \
  -H "Authorization: Bearer <your-token>" \
  -F "studentId=507f1f77bcf86cd799439020" \
  -F "title=Physics Unit 2" \
  -F "duration=60" \
  -F "educationalMaterialId=507f1f77bcf86cd799439014" \
  -F 'subMaterialIds=["507f1f77bcf86cd799439015"]' \
  -F "numberOfQuestions=25" \
  -F "isPaid=true" \
  -F "price=10" \
  -F "transferScreenshot=@/path/to/screenshot.png"
```

**Response (201):** Same shape as **Request Build Exam (Student)**.

---

### 3. Get My Build Requests (Student)

**Endpoint:** `GET /api/exam-builds/my-requests`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439080",
      "studentId": "507f1f77bcf86cd799439020",
      "title": "Math Quiz Ch1",
      "duration": 45,
      "educationalMaterialId": "507f1f77bcf86cd799439011",
      "subMaterialIds": ["507f1f77bcf86cd799439012"],
      "numberOfQuestions": 20,
      "isPaid": false,
      "status": "pending",
      "requestedAt": "2024-01-15T14:00:00.000Z",
      "transferScreenshot": "/uploads/transfers/abc123.png",
      "educationalMaterial": { "id": "...", "nameAr": "...", "nameEn": "..." },
      "subMaterials": [{ "id": "...", "nameAr": "...", "nameEn": "..." }]
    }
  ],
  "message": "Your build exam requests retrieved successfully"
}
```

---

### 4. Get My Built Exams (Student)

Returns exams from approved build requests. These are the exams the student can solve.

**Endpoint:** `GET /api/exam-builds/my-built-exams`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439090",
      "title": "Math Quiz Ch1",
      "duration": 45,
      "totalPoints": 200
    }
  ],
  "message": "Your built exams retrieved successfully"
}
```

Use `id` to solve: `GET /api/exams/:id` and `POST /api/exams/:id/solve` (or your solve flow).

---

### 5. Get All Build Requests (Admin)

**Endpoint:** `GET /api/exam-builds/requests`

**Query:** `?status=pending` | `?status=approved` | `?status=rejected` (optional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439080",
      "studentId": "507f1f77bcf86cd799439020",
      "studentName": "Ahmed",
      "studentUsername": "ahmed_s",
      "title": "Math Quiz Ch1",
      "duration": 45,
      "educationalMaterialId": "507f1f77bcf86cd799439011",
      "subMaterialIds": ["507f1f77bcf86cd799439012"],
      "numberOfQuestions": 20,
      "isPaid": false,
      "status": "pending",
      "requestedAt": "2024-01-15T14:00:00.000Z",
      "transferScreenshot": "/uploads/transfers/abc123.png",
      "educationalMaterial": { "id": "...", "nameAr": "...", "nameEn": "..." },
      "subMaterials": [{ "id": "...", "nameAr": "...", "nameEn": "..." }]
    }
  ],
  "message": "Build exam requests retrieved successfully"
}
```

---

### 6. Get Build Request By ID

**Endpoint:** `GET /api/exam-builds/requests/:id`

**Response (200 OK):** Single build request object (same fields as in list).

**Error Responses:** `400` (invalid id), `404` (not found)

---

### 7. Approve Build Request (Admin)

Generates an exam from the request config, creates an `ExamPurchase` (approved) so the student has access, and sets `examId` on the request. The exam appears in **My Built Exams** for the student.

**Endpoint:** `PUT /api/exam-builds/requests/:id/approve`

**Example (curl):**
```bash
curl -X PUT "http://localhost:3000/api/exam-builds/requests/507f1f77bcf86cd799439080/approve" \
  -H "Authorization: Bearer <your-token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439080",
    "studentId": "507f1f77bcf86cd799439020",
    "title": "Math Quiz Ch1",
    "status": "approved",
    "examId": "507f1f77bcf86cd799439090",
    "approvedAt": "2024-01-15T15:00:00.000Z",
    "approvedBy": "507f1f77bcf86cd799439001"
  },
  "message": "Build exam request approved successfully"
}
```

**Error Responses:** `400` (invalid id, already approved/rejected, or not enough questions in bank), `404` (request not found)

---

### 8. Reject Build Request (Admin)

**Endpoint:** `PUT /api/exam-builds/requests/:id/reject`

**Request Body (JSON):**
```json
{
  "rejectionReason": "Insufficient transfer proof."
}
```

**Example (curl):**
```bash
curl -X PUT "http://localhost:3000/api/exam-builds/requests/507f1f77bcf86cd799439080/reject" \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"rejectionReason": "Insufficient transfer proof."}'
```

**Response (200 OK):** Updated request with `status: "rejected"` and `rejectedAt`, `rejectionReason`.

**Error Responses:** `400` (invalid id or status), `404` (not found)

---

### 9. Exam Build CRUD (Templates, Admin)

Templates used for generating exams (e.g. from admin UI). Build **requests** use inline config, not these templates.

- **GET /api/exam-builds** — List all builds  
- **GET /api/exam-builds/:id** — Get one build  
- **POST /api/exam-builds** — Create (JSON: `title`, `description?`, `duration`, `educationalMaterialId`, `subMaterialIds[]`, `numberOfQuestions`, `isPaid?`, `price?`)  
- **PUT /api/exam-builds/:id** — Update  
- **DELETE /api/exam-builds/:id** — Delete  
- **POST /api/exam-builds/:id/generate** — Generate an exam from this template (returns `{ id, title }`)

---

## Example cURL Commands for Exam Build Requests

### Request Build Exam (Student)
```bash
curl -X POST "http://localhost:3000/api/exam-builds/requests" \
  -H "Authorization: Bearer <your-token>" \
  -F "title=Math Quiz Ch1" \
  -F "duration=45" \
  -F "educationalMaterialId=507f1f77bcf86cd799439011" \
  -F 'subMaterialIds=["507f1f77bcf86cd799439012"]' \
  -F "numberOfQuestions=20" \
  -F "isPaid=false" \
  -F "transferScreenshot=@./screenshot.png"
```

### Request Build Exam For Student (Admin)
```bash
curl -X POST "http://localhost:3000/api/exam-builds/requests-for" \
  -H "Authorization: Bearer <your-token>" \
  -F "studentId=507f1f77bcf86cd799439020" \
  -F "title=Physics Unit 2" \
  -F "duration=60" \
  -F "educationalMaterialId=507f1f77bcf86cd799439014" \
  -F 'subMaterialIds=["507f1f77bcf86cd799439015"]' \
  -F "numberOfQuestions=25" \
  -F "isPaid=true" \
  -F "price=10" \
  -F "transferScreenshot=@./screenshot.png"
```

### Get My Build Requests
```bash
curl -X GET "http://localhost:3000/api/exam-builds/my-requests" \
  -H "Authorization: Bearer <your-token>"
```

### Get My Built Exams
```bash
curl -X GET "http://localhost:3000/api/exam-builds/my-built-exams" \
  -H "Authorization: Bearer <your-token>"
```

### Get All Build Requests (Admin, optional status filter)
```bash
curl -X GET "http://localhost:3000/api/exam-builds/requests" \
  -H "Authorization: Bearer <your-token>"

curl -X GET "http://localhost:3000/api/exam-builds/requests?status=pending" \
  -H "Authorization: Bearer <your-token>"
```

### Get Build Request By ID
```bash
curl -X GET "http://localhost:3000/api/exam-builds/requests/507f1f77bcf86cd799439080" \
  -H "Authorization: Bearer <your-token>"
```

### Approve Build Request
```bash
curl -X PUT "http://localhost:3000/api/exam-builds/requests/507f1f77bcf86cd799439080/approve" \
  -H "Authorization: Bearer <your-token>"
```

### Reject Build Request
```bash
curl -X PUT "http://localhost:3000/api/exam-builds/requests/507f1f77bcf86cd799439080/reject" \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"rejectionReason": "Insufficient transfer proof."}'
```

---

## Exam Purchase Endpoints

The Exam Purchase API allows students to request purchases for paid exams. Administrators/Teachers can approve or reject these requests. Once approved, students gain access to solve the paid exam.

### 1. Request Exam Purchase

Request to purchase a paid exam (requires authentication, student only).

**Endpoint:** `POST /api/exam-purchases/request`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body:**
```json
{
  "examId": "507f1f77bcf86cd799439011"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439050",
    "studentId": "507f1f77bcf86cd799439020",
    "examId": "507f1f77bcf86cd799439011",
    "examTitle": "Advanced Mathematics Exam",
    "studentName": "John Doe",
    "studentUsername": "john_doe",
    "status": "pending",
    "price": 29.99,
    "requestedAt": "2024-01-15T12:00:00.000Z",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  },
  "message": "Purchase request created successfully"
}
```

**Error Responses:**
- `400` - Invalid exam ID, exam is not paid, purchase already exists, or validation error
- `401` - Authentication required
- `404` - Exam or student not found
- `500` - Server error

**Note:**
- Only students can request purchases
- Cannot request purchase for free exams
- Cannot create duplicate pending requests for the same exam
- Cannot request if already approved for the same exam

---

### 2. Get All Purchase Requests

Get all exam purchase requests with optional filtering (requires authentication, admin/teacher).

**Endpoint:** `GET /api/exam-purchases`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Query Parameters (all optional):**
- `status` - Filter by status: `pending`, `approved`, or `rejected`
- `studentId` - Filter by student ID
- `examId` - Filter by exam ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439050",
      "studentId": "507f1f77bcf86cd799439020",
      "examId": "507f1f77bcf86cd799439011",
      "examTitle": "Advanced Mathematics Exam",
      "studentName": "John Doe",
      "studentUsername": "john_doe",
      "status": "pending",
      "price": 29.99,
      "requestedAt": "2024-01-15T12:00:00.000Z",
      "createdAt": "2024-01-15T12:00:00.000Z",
      "updatedAt": "2024-01-15T12:00:00.000Z"
    }
  ],
  "message": "Purchases retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### 3. Get Purchase Request By ID

Get a specific purchase request by ID (requires authentication).

**Endpoint:** `GET /api/exam-purchases/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439050",
    "studentId": "507f1f77bcf86cd799439020",
    "examId": "507f1f77bcf86cd799439011",
    "examTitle": "Advanced Mathematics Exam",
    "studentName": "John Doe",
    "studentUsername": "john_doe",
    "status": "pending",
    "price": 29.99,
    "requestedAt": "2024-01-15T12:00:00.000Z",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  },
  "message": "Purchase retrieved successfully"
}
```

**Error Responses:**
- `400` - Invalid purchase ID format
- `401` - Authentication required
- `404` - Purchase not found
- `500` - Server error

---

### 4. Approve Purchase Request

Approve a pending purchase request (requires authentication, admin/teacher).

**Endpoint:** `PUT /api/exam-purchases/:id/approve`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439050",
    "studentId": "507f1f77bcf86cd799439020",
    "examId": "507f1f77bcf86cd799439011",
    "examTitle": "Advanced Mathematics Exam",
    "studentName": "John Doe",
    "studentUsername": "john_doe",
    "status": "approved",
    "price": 29.99,
    "requestedAt": "2024-01-15T12:00:00.000Z",
    "approvedAt": "2024-01-15T13:00:00.000Z",
    "approvedBy": "507f1f77bcf86cd799439016",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z"
  },
  "message": "Purchase approved successfully"
}
```

**Error Responses:**
- `400` - Invalid purchase ID format or purchase is not pending
- `401` - Authentication required
- `404` - Purchase not found
- `500` - Server error

**Note:**
- Once approved, the student gains access to solve the exam
- Only pending purchases can be approved

---

### 5. Reject Purchase Request

Reject a pending purchase request (requires authentication, admin/teacher).

**Endpoint:** `PUT /api/exam-purchases/:id/reject`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body (optional):**
```json
{
  "rejectionReason": "Payment verification failed"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439050",
    "studentId": "507f1f77bcf86cd799439020",
    "examId": "507f1f77bcf86cd799439011",
    "examTitle": "Advanced Mathematics Exam",
    "studentName": "John Doe",
    "studentUsername": "john_doe",
    "status": "rejected",
    "price": 29.99,
    "requestedAt": "2024-01-15T12:00:00.000Z",
    "rejectedAt": "2024-01-15T13:00:00.000Z",
    "rejectionReason": "Payment verification failed",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z"
  },
  "message": "Purchase rejected successfully"
}
```

**Error Responses:**
- `400` - Invalid purchase ID format, purchase is not pending, or validation error
- `401` - Authentication required
- `404` - Purchase not found
- `500` - Server error

**Note:**
- Only pending purchases can be rejected
- Rejection reason is optional but recommended

---

### 6. Get Student's Purchase Requests

Get all purchase requests for the authenticated student (requires authentication, student only).

**Endpoint:** `GET /api/exam-purchases/my-purchases`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439050",
      "studentId": "507f1f77bcf86cd799439020",
      "examId": "507f1f77bcf86cd799439011",
      "examTitle": "Advanced Mathematics Exam",
      "studentName": "John Doe",
      "studentUsername": "john_doe",
      "status": "approved",
      "price": 29.99,
      "requestedAt": "2024-01-15T12:00:00.000Z",
      "approvedAt": "2024-01-15T13:00:00.000Z",
      "createdAt": "2024-01-15T12:00:00.000Z",
      "updatedAt": "2024-01-15T13:00:00.000Z"
    }
  ],
  "message": "Student purchases retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

## Example cURL Commands for Exam Purchases

### Request Purchase
```bash
curl -X POST http://localhost:3000/api/exam-purchases/request \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "examId": "507f1f77bcf86cd799439011"
  }'
```

### Get All Purchases
```bash
curl -X GET "http://localhost:3000/api/exam-purchases?status=pending" \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Purchase By ID
```bash
curl -X GET http://localhost:3000/api/exam-purchases/507f1f77bcf86cd799439050 \
  -H "Authorization: Bearer <your-token-here>"
```

### Approve Purchase
```bash
curl -X PUT http://localhost:3000/api/exam-purchases/507f1f77bcf86cd799439050/approve \
  -H "Authorization: Bearer <your-token-here>"
```

### Reject Purchase
```bash
curl -X PUT http://localhost:3000/api/exam-purchases/507f1f77bcf86cd799439050/reject \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "rejectionReason": "Payment verification failed"
  }'
```

### Get Student's Purchases
```bash
curl -X GET http://localhost:3000/api/exam-purchases/my-purchases \
  -H "Authorization: Bearer <your-token-here>"
```

---

## Exam Purchase Data Structure

An exam purchase includes:
- **id**: Unique identifier for the purchase
- **studentId**: Reference to the student/user (ObjectId)
- **examId**: Reference to the exam (ObjectId)
- **examTitle**: Title of the exam (populated)
- **studentName**: Name of the student (populated)
- **studentUsername**: Username of the student (populated, optional)
- **status**: Purchase status: `pending`, `approved`, or `rejected`
- **price**: Price of the exam at time of request
- **requestedAt**: Timestamp when the purchase was requested
- **approvedAt**: Timestamp when the purchase was approved (if approved)
- **rejectedAt**: Timestamp when the purchase was rejected (if rejected)
- **approvedBy**: Reference to the admin/teacher who approved (ObjectId, optional)
- **rejectionReason**: Reason for rejection (optional, max 500 characters)
- **createdAt**: Timestamp when the purchase was created
- **updatedAt**: Timestamp when the purchase was last updated

**Note:**
- Once a purchase is approved, the student gains access to solve the paid exam
- Free exams are accessible to all students without purchase
- The system prevents duplicate pending requests for the same exam
- When solving a paid exam, the system checks if the student has an approved purchase

---

## Question Bank Endpoints

The Question Bank API allows you to create, read, update, and delete questions. Questions are stored in Arabic and can be used to build exams.

### 1. Get All Questions

Get a paginated list of all questions with optional filtering (requires authentication).

**Endpoint:** `GET /api/questions`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Query Parameters (all optional):**
- `category` - Filter by category (string)
- `difficulty` - Filter by difficulty: `easy`, `medium`, or `hard`
- `search` - Search in question text (string)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "507f1f77bcf86cd799439011",
        "question": "ما هي عاصمة مصر؟",
        "options": ["القاهرة", "الإسكندرية", "الجيزة", "أسوان"],
        "correctAnswer": 0,
        "points": 10,
        "category": "الجغرافيا",
        "difficulty": "easy",
        "createdAt": "2024-01-15T12:00:00.000Z",
        "updatedAt": "2024-01-15T12:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  },
  "message": "Questions retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### 2. Get Question By ID

Get a specific question by ID (requires authentication).

**Endpoint:** `GET /api/questions/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "question": "ما هي عاصمة مصر؟",
    "options": ["القاهرة", "الإسكندرية", "الجيزة", "أسوان"],
    "correctAnswer": 0,
    "points": 10,
    "category": "الجغرافيا",
    "difficulty": "easy",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  },
  "message": "Question retrieved successfully"
}
```

**Error Responses:**
- `400` - Invalid question ID format
- `401` - Authentication required
- `404` - Question not found
- `500` - Server error

---

### 3. Create Question

Create a new question (requires authentication).

**Endpoint:** `POST /api/questions`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body:**
```json
{
  "question": "ما هي عاصمة مصر؟",
  "options": ["القاهرة", "الإسكندرية", "الجيزة", "أسوان"],
  "correctAnswer": 0,
  "points": 10,
  "correctAnswerReason": "القاهرة هي العاصمة الرسمية لجمهورية مصر العربية منذ تأسيس الدولة الحديثة.",
  "category": "الجغرافيا",
  "difficulty": "easy",
  "educationalMaterialId": "507f1f77bcf86cd799439012",
  "subMaterialId": "507f1f77bcf86cd799439013"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "type": "individual",
    "question": "ما هي عاصمة مصر؟",
    "options": ["القاهرة", "الإسكندرية", "الجيزة", "أسوان"],
    "correctAnswer": 0,
    "points": 10,
    "correctAnswerReason": "القاهرة هي العاصمة الرسمية لجمهورية مصر العربية منذ تأسيس الدولة الحديثة.",
    "category": "الجغرافيا",
    "difficulty": "easy",
    "educationalMaterialId": "507f1f77bcf86cd799439012",
    "subMaterialId": "507f1f77bcf86cd799439013",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  },
  "message": "Question created successfully"
}
```

**Error Responses:**
- `400` - Validation error (invalid question, options, correctAnswer, or points)
- `401` - Authentication required
- `500` - Server error

**Validation Rules:**
- **question**: Required, 3-1000 characters
- **options**: Required, array with 2-10 non-empty strings
- **correctAnswer**: Required, integer between 0 and (options.length - 1)
- **points**: Optional, integer between 1-100 (default: 10)
- **correctAnswerReason**: Optional, string up to 1000 characters. Shown in exam results when the student answers incorrectly.
- **category**: Optional, string up to 100 characters
- **difficulty**: Optional, one of: `easy`, `medium`, `hard`
- **educationalMaterialId**: Required, valid ObjectId
- **subMaterialId**: Required, valid ObjectId

---

### 4. Update Question

Update an existing question (requires authentication).

**Endpoint:** `PUT /api/questions/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "question": "ما هي عاصمة مصر؟ (محدث)",
  "options": ["القاهرة", "الإسكندرية", "الجيزة", "أسوان", "الأقصر"],
  "correctAnswer": 0,
  "points": 15,
  "correctAnswerReason": "القاهرة هي العاصمة الرسمية لجمهورية مصر العربية.",
  "category": "الجغرافيا المصرية",
  "difficulty": "medium"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "type": "individual",
    "question": "ما هي عاصمة مصر؟ (محدث)",
    "options": ["القاهرة", "الإسكندرية", "الجيزة", "أسوان", "الأقصر"],
    "correctAnswer": 0,
    "points": 15,
    "correctAnswerReason": "القاهرة هي العاصمة الرسمية لجمهورية مصر العربية.",
    "category": "الجغرافيا المصرية",
    "difficulty": "medium",
    "educationalMaterialId": "507f1f77bcf86cd799439012",
    "subMaterialId": "507f1f77bcf86cd799439013",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T14:00:00.000Z"
  },
  "message": "Question updated successfully"
}
```

**Error Responses:**
- `400` - Validation error or invalid question ID format
- `401` - Authentication required
- `404` - Question not found
- `500` - Server error

---

### 5. Delete Question

Delete a question (requires authentication).

**Endpoint:** `DELETE /api/questions/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Question deleted successfully"
}
```

**Error Responses:**
- `400` - Invalid question ID format
- `401` - Authentication required
- `404` - Question not found
- `500` - Server error

---

## Example cURL Commands for Questions

### Get All Questions
```bash
curl -X GET "http://localhost:3000/api/questions?page=1&limit=20" \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Questions with Filters
```bash
curl -X GET "http://localhost:3000/api/questions?category=الجغرافيا&difficulty=easy&search=مصر" \
  -H "Authorization: Bearer <your-token-here>"
```

### Get Question By ID
```bash
curl -X GET http://localhost:3000/api/questions/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>"
```

### Create Question
```bash
curl -X POST http://localhost:3000/api/questions \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "ما هي عاصمة مصر؟",
    "options": ["القاهرة", "الإسكندرية", "الجيزة", "أسوان"],
    "correctAnswer": 0,
    "points": 10,
    "correctAnswerReason": "القاهرة هي العاصمة الرسمية لجمهورية مصر العربية منذ تأسيس الدولة الحديثة.",
    "category": "الجغرافيا",
    "difficulty": "easy",
    "educationalMaterialId": "507f1f77bcf86cd799439012",
    "subMaterialId": "507f1f77bcf86cd799439013"
  }'
```

### Update Question
```bash
curl -X PUT http://localhost:3000/api/questions/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "points": 15,
    "difficulty": "medium"
  }'
```

### Delete Question
```bash
curl -X DELETE http://localhost:3000/api/questions/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your-token-here>"
```

---

## Question Data Structure

A question includes:
- **id**: Unique identifier for the question
- **type**: `individual` or `partial` (passage + sub-questions)
- **question**: Question text in Arabic (3-1000 characters)
- **options**: Array of answer options in Arabic (2-10 options, each non-empty)
- **correctAnswer**: Index of the correct answer (0-based, must be valid for options array)
- **points**: Points awarded for correct answer (1-100, default: 10)
- **correctAnswerReason**: Optional. Why this option is correct; shown in exam results when the student answers wrong (e.g. "The correct answer is X because [reason]").
- **category**: Optional category/topic (up to 100 characters)
- **difficulty**: Optional difficulty level: `easy`, `medium`, or `hard`
- **educationalMaterialId**: Required. Reference to educational material
- **subMaterialId**: Required. Reference to sub-material
- **createdAt**: Timestamp when the question was created
- **updatedAt**: Timestamp when the question was last updated

**Note:**
- Questions are stored in Arabic and support full Unicode characters
- The question bank can be used to build exams by selecting questions
- **correctAnswerReason** is copied into the exam snapshot and returned in solve result so the UI can show "Wrong. The correct answer is X because [reason]."
- Questions support text search for finding specific content
- Filtering by category and difficulty helps organize questions

---

## Parent Endpoints

The Parent API allows parents to register using their child's student code, login with a parent code, and access their child's information.

### 1. Register Parent

Register a new parent account using a student code. Each student can only have one registered parent.

**Endpoint:** `POST /api/parents/register`

**Request Body:**
```json
{
  "name": "أحمد محمد",
  "phone": "+201234567890",
  "studentCode": "ST1234",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "parent": {
      "id": "507f1f77bcf86cd799439060",
      "name": "أحمد محمد",
      "phone": "+201234567890",
      "parentCode": "PR1234",
      "userType": "parent",
      "createdAt": "2024-01-15T12:00:00.000Z",
      "updatedAt": "2024-01-15T12:00:00.000Z"
    },
    "student": {
      "id": "507f1f77bcf86cd799439020",
      "name": "john_doe",
      "username": "john_doe",
      "studentCode": "ST1234"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Parent registered successfully"
}
```

**Error Responses:**
- `400` - Validation error, student code not found, student already has a parent, or phone already registered
- `404` - Student code not found
- `500` - Server error

**Note:**
- The student code must exist and be in format ST####
- Each student can only have one registered parent
- A unique parent code (PR####) is automatically generated
- Phone number must be unique for parents

---

### 2. Parent Login

Authenticate a parent using their parent code and password.

**Endpoint:** `POST /api/parents/login`

**Request Body:**
```json
{
  "code": "PR1234",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "parent": {
      "id": "507f1f77bcf86cd799439060",
      "name": "أحمد محمد",
      "phone": "+201234567890",
      "parentCode": "PR1234",
      "userType": "parent",
      "createdAt": "2024-01-15T12:00:00.000Z",
      "updatedAt": "2024-01-15T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Parent logged in successfully"
}
```

**Error Responses:**
- `400` - Validation error (invalid code format)
- `401` - Invalid parent code or password
- `500` - Server error

**Note:**
- Parent code must be in format PR####
- Code is automatically converted to uppercase

---

### 3. Get Student Information

Get all information about the student linked to the authenticated parent (requires authentication).

**Endpoint:** `GET /api/parents/student`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439020",
    "name": "john_doe",
    "email": "john_doe.1234567890@student.app",
    "phone": "+1234567890",
    "username": "john_doe",
    "studentCode": "ST1234",
    "image": "/uploads/students/student-image-1234567890.jpg",
    "birthday": "2010-05-15T00:00:00.000Z",
    "educationalStageId": "507f1f77bcf86cd799439012",
    "level": 11,
    "totalPoints": 150,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Student information retrieved successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - No student linked to this parent
- `500` - Server error

**Note:**
- Only authenticated parents can access this endpoint
- Returns complete student information including level, points, and educational stage

---

## Example cURL Commands for Parents

### Register Parent
```bash
curl -X POST http://localhost:3000/api/parents/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد",
    "phone": "+201234567890",
    "studentCode": "ST1234",
    "password": "password123"
  }'
```

### Parent Login
```bash
curl -X POST http://localhost:3000/api/parents/login \
  -H "Content-Type: application/json" \
  -d '{
    "code": "PR1234",
    "password": "password123"
  }'
```

### Get Student Information
```bash
curl -X GET http://localhost:3000/api/parents/student \
  -H "Authorization: Bearer <your-token-here>"
```

---

## Validation Rules for Parents

### Register Parent
- **name**: Required, 2-100 characters
- **phone**: Required, minimum 5 characters, must be unique for parents
- **studentCode**: Required, valid student code format (ST####), must reference an existing student
- **password**: Required, minimum 6 characters

### Parent Login
- **code**: Required, valid parent code format (PR####)
- **password**: Required, minimum 6 characters

---

## Parent Data Structure

A parent user includes:
- **id**: Unique identifier for the parent
- **name**: Full name of the parent
- **phone**: Phone number (unique for parents)
- **parentCode**: Auto-generated unique code in format PR#### (e.g., PR1234, PR5678)
- **userType**: Always "parent"
- **createdAt**: Timestamp when the parent was created
- **updatedAt**: Timestamp when the parent was last updated

**Note:**
- The `parentCode` is automatically generated during registration in the format PR#### (e.g., PR1234, PR5678)
- Each student can only have one registered parent
- The parent-student relationship is stored in the `ParentStudent` collection
- Parents can access their child's information after authentication

---

## Parent-Student Relationship

The relationship between a parent and student is stored in the `ParentStudent` model:
- **parentId**: Reference to the parent (User with userType='parent') - ObjectId
- **studentId**: Reference to the student (User with userType='student') - ObjectId
- **createdAt**: Timestamp when the relationship was created
- **updatedAt**: Timestamp when the relationship was last updated

**Note:**
- The relationship between a specific parent and student is unique (enforced by compound index)
- This relationship is automatically created when a parent registers with a student code
