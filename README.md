# Finance Tracker - Backend

A NestJS REST API backend for the Finance Tracker application, providing authentication, transaction management, budget tracking, and financial analytics.

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: PostgreSQL (via TypeORM)
- **Authentication**: JWT (Passport)
- **Validation**: class-validator, class-transformer
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js 20+ (required)
- PostgreSQL database (local or cloud-hosted)
- npm or yarn

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env` file in the root of the backend directory:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/finance_tracker

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=3000
```

> **Note**: The `.env` file is gitignored. Never commit sensitive credentials.

### Database Setup

The application uses PostgreSQL. You can use:

- **Local PostgreSQL**: Install and run PostgreSQL locally
- **Cloud Database**: Use services like Neon, Supabase, or AWS RDS

Example connection string format:
```
postgresql://username:password@host:port/database
```

For cloud databases (like Neon), the connection string typically includes SSL parameters:
```
postgresql://user:pass@host.neon.tech/dbname?sslmode=require
```

## Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run start:dev
```

The server will start on `http://localhost:3000` (or the port specified in `PORT` environment variable).

### Production Mode

Build and run the production server:

```bash
# Build the application
npm run build

# Run production server
npm run start:prod
```

### Debug Mode

Run with debugging enabled:

```bash
npm run start:debug
```

## API Endpoints

The API is prefixed with `/api`. All endpoints require authentication unless specified.

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Transactions

- `GET /api/transactions` - Get user's transactions (paginated)
- `GET /api/transactions/:id` - Get a specific transaction
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction
- `GET /api/transactions/summary` - Get financial summary (requires `startDate` and `endDate` query params)

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Budgets

- `GET /api/budgets` - Get user's budgets
- `POST /api/budgets` - Create a budget
- `PUT /api/budgets/:id` - Update a budget
- `DELETE /api/budgets/:id` - Delete a budget

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Register or login to receive an access token
2. Include the token in the `Authorization` header for protected routes:
   ```
   Authorization: Bearer <your-token>
   ```

## Project Structure

```
backend/
├── src/
│   ├── auth/              # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   └── dto/
│   │       └── auth.dto.ts
│   ├── transactions/      # Transaction management
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   ├── transactions.module.ts
│   │   ├── transaction.entity.ts
│   │   └── dto/
│   │       └── transaction.dto.ts
│   ├── categories/        # Category management
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts
│   │   ├── categories.module.ts
│   │   ├── category.entity.ts
│   │   └── dto/
│   │       └── category.dto.ts
│   ├── budgets/           # Budget management
│   │   ├── budgets.controller.ts
│   │   ├── budgets.service.ts
│   │   ├── budgets.module.ts
│   │   ├── budget.entity.ts
│   │   └── dto/
│   │       └── budget.dto.ts
│   ├── users/             # User entity
│   │   └── user.entity.ts
│   ├── common/            # Shared utilities
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   └── guards/
│   │       └── jwt-auth.guard.ts
│   ├── config/            # Configuration
│   │   └── database.config.ts
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── test/                  # E2E tests
└── dist/                  # Compiled output (generated)
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT token signing | Yes | - |
| `JWT_EXPIRES_IN` | JWT token expiration time | No | `7d` |
| `PORT` | Server port | No | `3000` |

## Database Schema

The application uses TypeORM entities:

- **User**: User accounts with email, password (hashed), name, and currency preference
- **Transaction**: Financial transactions with amount, type, date, category, and notes
- **Category**: Transaction categories with name, icon, color, and type
- **Budget**: Budgets for categories with amount, period, and tracking

> **Note**: `synchronize: true` is enabled in development. **Disable this in production** and use migrations instead.

## Validation

The API uses `class-validator` for request validation. All DTOs include validation decorators:

- `@IsEmail()` - Email validation
- `@IsString()`, `@IsNumber()` - Type validation
- `@IsEnum()` - Enum validation
- `@IsOptional()` - Optional fields
- `@Min()`, `@Max()` - Range validation

Invalid requests return `400 Bad Request` with validation error details.

## CORS

CORS is enabled for all origins in development. Configure CORS settings in `main.ts` for production.

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Production Considerations

1. **Database Synchronization**: Disable `synchronize: true` in `app.module.ts` and use migrations
2. **Environment Variables**: Use secure secret management (AWS Secrets Manager, etc.)
3. **CORS**: Configure specific allowed origins instead of allowing all
4. **Rate Limiting**: Consider adding rate limiting for API endpoints
5. **Logging**: Implement proper logging (Winston, Pino, etc.)
6. **Error Handling**: Customize error responses for production
7. **HTTPS**: Always use HTTPS in production
8. **JWT Secret**: Use a strong, randomly generated secret

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check network connectivity for cloud databases
- Verify SSL settings match your database provider

### JWT Errors

- Ensure `JWT_SECRET` is set and not empty
- Verify token expiration settings
- Check that tokens are being sent in the `Authorization` header

### Port Already in Use

- Change the `PORT` environment variable
- Or kill the process using port 3000: `lsof -ti:3000 | xargs kill`

## License

Private project.

