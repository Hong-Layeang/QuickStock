# QuickStock API Documentation

## Base URL
- Production: `https://quickstock-v0iv.onrender.com/api`
- Development: `http://localhost:5001/api`

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Routes Overview

### Health Check
- `GET /health` - Check API status

### Authentication
- `POST /login` - User login

### Users
- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user (Admin only)
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user (Admin only)

### Products
- `GET /products` - Get all products (Admin/Supplier)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product (Supplier only)
- `PUT /products/:id` - Update product (Owner only)
- `DELETE /products/:id` - Delete product (Owner only)

### Admin Routes
- `GET /admin/dashboard` - Get admin dashboard data
- `GET /admin/orders` - Get admin orders (placeholder)

### Supplier Routes
- `GET /supplier/dashboard` - Get supplier dashboard data
- `GET /supplier/products` - Get supplier's products
- `GET /supplier/activity-log` - Get supplier activity log

## Detailed Endpoints

### Authentication

#### POST /login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "supplier"
  }
}
```

### Users

#### GET /users
Get all users (Admin only).

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "supplier",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /users
Create new user (Admin only).

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "supplier"
}
```

### Products

#### GET /products
Get all products (Admin/Supplier).

**Response:**
```json
[
  {
    "id": 1,
    "name": "Wireless Mouse",
    "category": "Accessories",
    "unitprice": 19.99,
    "stock": 50,
    "status": "in stock",
    "supplierId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /products
Create new product (Supplier only).

**Request Body:**
```json
{
  "name": "New Product",
  "category": "Electronics",
  "unitprice": 99.99,
  "stock": 10,
  "status": "in stock"
}
```

### Admin Dashboard

#### GET /admin/dashboard
Get admin dashboard data.

**Response:**
```json
{
  "success": true,
  "data": {
    "cards": [...],
    "activities": [...],
    "metrics": [...],
    "summary": {
      "totalProducts": 100,
      "totalUsers": 50,
      "lowStockProducts": 5,
      "outOfStockProducts": 2
    }
  }
}
```

### Supplier Dashboard

#### GET /supplier/dashboard
Get supplier dashboard data.

**Response:**
```json
{
  "success": true,
  "data": {
    "cards": [...],
    "activities": [...],
    "metrics": [...],
    "summary": {
      "totalProducts": 25,
      "lowStockProducts": 3,
      "outOfStockProducts": 1,
      "recentProducts": 2
    }
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "status": 400
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

## Security Features

- JWT-based authentication
- Role-based access control
- Input validation
- SQL injection protection (via Sequelize)
- CORS enabled
- Request logging
- Error handling 