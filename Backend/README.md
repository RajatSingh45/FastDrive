# FastDrive Backend API Documentation
# User Authentication
## User Registration

### Endpoint

`POST /users/register`

### Description

Registers a new user. Validates input, checks for existing users, hashes the password, creates the user, and returns a JWT token with user data.

### Request Body

```json
{
  "fullname": {
    "firstname": "string (min 3 characters, required)",
    "lastname": "string (optional)"
  },
  "email": "string (valid email, required)",
  "password": "string (min 6 characters, required)"
}
```

### Status Codes

- **201 Created**: Registration successful.
- **400 Bad Request**: Registration failed due to server error.
- **200 OK**: Validation or existence errors (e.g., missing fields, user already exists).

### Example Request

```json
{
  "fullname": {
    "firstname": "Alice",
    "lastname": "Smith"
  },
  "email": "alice.smith@example.com",
  "password": "strongPassword123"
}
```

### Example Successful Response

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60c72b2f9b1e8a001c8e4b8a",
    "fullname": {
      "firstname": "Alice",
      "lastname": "Smith"
    },
    "email": "alice.smith@example.com",
    "password": "$2b$10$...",
    "socketId": null,
    "__v": 0
  }
}
```

### Example Error Responses

**Missing Fields**
```json
{ "message": "All fields are required" }
```
**Validation Error**
```json
{
  "message": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```
**User Already Exists**
```json
{ "message": "user already exists!" }
```

---

## User Login

### Endpoint

`POST /users/login`

### Description

Logs in a user by validating credentials and returns a JWT token on success.

### Request Body

```json
{
  "email": "string (valid email, required)",
  "password": "string (min 6 characters, required)"
}
```

### Status Codes

- **201 Created**: Login successful.
- **401 Unauthorized**: Invalid email or password.
- **200 OK**: Validation errors.

### Example Request

```json
{
  "email": "alice.smith@example.com",
  "password": "strongPassword123"
}
```

### Example Successful Response

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Example Error Responses

**Invalid Credentials**
```json
{ "message": "Invalid email or password" }
```
**Validation Error**
```json
{
  "message": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

## User Profile

### Endpoint

`GET /users/profile`

### Description

Returns the authenticated user's profile data. Requires a valid JWT token in the `Authorization` header or as a cookie.

### Headers

- `Authorization: Bearer <token>` (or use the `token` cookie)

### Status Codes

- **200 OK**: Returns user profile.
- **401 Unauthorized**: If token is missing, invalid, or blacklisted.

### Example Successful Response

```json
{
  "_id": "60c72b2f9b1e8a001c8e4b8a",
  "fullname": {
    "firstname": "Alice",
    "lastname": "Smith"
  },
  "email": "alice.smith@example.com",
  "socketId": null
}
```

### Example Error Response

```json
{ "message": "Unotherized" }
```

---

## User Logout

### Endpoint

`GET /users/logout`

### Description

Logs out the authenticated user by blacklisting the JWT token and clearing the cookie.

### Headers

- `Authorization: Bearer <token>` (or use the `token` cookie)

### Status Codes

- **200 OK**: Logout successful.
- **401 Unauthorized**: If token is missing or invalid.

### Example Successful Response

```json
{ "message": "Logout Succesfully" }
```

### Example Error Response

```json
{ "message": "Unotherized" }
```
# Captain Authentication

---

## Captain Registration

### Endpoint

`POST /captains/register`

### Description

Registers a new captain. Validates input, checks for existing captains, hashes the password, creates the captain, and returns a JWT token with captain data.

### Request Body

```json
{
  "fullname": {
    "firstname": "string (min 3 characters, required)",
    "lastname": "string (optional)"
  },
  "email": "string (valid email, required)",
  "password": "string (min 6 characters, required)",
  "veichle": {
    "color": "string (min 3 characters, required)",
    "plate": "string (min 3 characters, required)",
    "capacity": "integer (min 1, required)",
    "veichleType": "string (car|motorcycle|auto, required)"
  }
}
```

### Status Codes

- **201 Created**: Registration successful.
- **400 Bad Request**: Registration failed due to server error.
- **200 OK**: Validation or existence errors (e.g., missing fields, captain already exists).

### Example Request

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePass123",
  "veichle": {
    "color": "Red",
    "plate": "XYZ123",
    "capacity": 4,
    "veichleType": "car"
  }
}
```

### Example Successful Response

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "60c72b2f9b1e8a001c8e4b8b",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "veichle": {
      "color": "Red",
      "plate": "XYZ123",
      "capacity": 4,
      "veichleType": "car"
    },
    "status": "inactive",
    "socketId": null,
    "location": {
      "lat": null,
      "lon": null
    }
  }
}
```

### Example Error Responses

**Missing Fields**
```json
{ "message": "All fields are required" }
```
**Validation Error**
```json
{
  "success": false,
  "message": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```
**Captain Already Exists**
```json
{ "message": "captain already exists!" }
```

---

## Captain Login

### Endpoint

`POST /captains/login`

### Description

Logs in a captain by validating credentials and returns a JWT token on success.

### Request Body

```json
{
  "email": "string (valid email, required)",
  "password": "string (min 6 characters, required)"
}
```

### Status Codes

- **201 Created**: Login successful.
- **401 Unauthorized**: Invalid email or password.
- **200 OK**: Validation errors.

### Example Request

```json
{
  "email": "john.doe@example.com",
  "password": "securePass123"
}
```

### Example Successful Response

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Example Error Responses

**Invalid Credentials**
```json
{ "message": "Invalid email or password" }
```
**Validation Error**
```json
{
  "success": false,
  "message": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

## Captain Profile

### Endpoint

`GET /captains/profile`

### Description

Returns the authenticated captain's profile data. Requires a valid JWT token in the `Authorization` header or as a cookie.

### Headers

- `Authorization: Bearer <token>` (or use the `token` cookie)

### Status Codes

- **200 OK**: Returns captain profile.
- **401 Unauthorized**: If token is missing, invalid, or blacklisted.

### Example Successful Response

```json
{
  "_id": "60c72b2f9b1e8a001c8e4b8b",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "veichle": {
    "color": "Red",
    "plate": "XYZ123",
    "capacity": 4,
    "veichleType": "car"
  },
  "status": "inactive",
  "socketId": null,
  "location": {
    "lat": null,
    "lon": null
  }
}
```

### Example Error Response

```json
{ "message": "Unotherized" }
```

---

## Captain Logout

### Endpoint

`GET /captains/logout`

### Description

Logs out the authenticated captain by blacklisting the JWT token and clearing the cookie.

### Headers

- `Authorization: Bearer <token>` (or use the `token` cookie)

### Status Codes

- **200 OK**: Logout successful.
- **401 Unauthorized**: If token is missing or invalid.

### Example Successful Response

```json
{ "message": "Logout Succesfully" }
```

### Example Error Response

```json
{ "message": "Unotherized" }
```