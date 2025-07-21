# TaskFlow System Architecture

## Services:

- **User Service**: Authentication, user management (Node.js + PostgreSQL)
- **Task Service**: Task CRUD, assignments, status (Node.js + MongoDB)
- **Notification Service**: Email/push notifications (Python FastAPI)
- **Frontend**: React dashboard with TypeScript
- **API Gateway**: Route requests, handle auth

## Communication:

- REST APIs between services
- JWT tokens for authentication
- Event-driven notifications
