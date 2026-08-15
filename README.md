# Expense Tracker

A simple expense tracking app — a Spring Boot REST API backend with a React + TypeScript frontend used to test it.

## Tech Stack

**Backend**
- Java / Spring Boot
- Spring Data JPA
- Spring Security (auth not yet implemented — currently open, see Known Limitations)
- Lombok

**Frontend**
- React + TypeScript
- Vite

## Getting Started

### Backend

cd backend
./mvnw spring-boot:run

Runs on http://localhost:8080 by default.

### Frontend

cd frontend
npm install\
npm run dev

Runs on http://localhost:5173 by default (Vite's default port). If it starts on a different port, update allowedOrigins in WebConfig to match.

Once both are running, open the frontend, confirm the Base URL field points at your backend, and click Test connection.

## API Endpoints

| Method | Path                                       | Description                     |
|--------|---------------------------------------------|----------------------------------|
| GET    | /expense-lists                            | Get all expense lists           |
| POST   | /expense-lists                            | Create an expense list          |
| DELETE | /expense-lists/{id}                       | Delete an expense list          |
| GET    | /expense-lists/{listId}/expenses          | Get all expenses in a list      |
| GET    | /expense-lists/{listId}/expenses/{id}     | Get a single expense            |
| POST   | /expense-lists/{listId}/expenses          | Add an expense to a list        |
| DELETE | /expense-lists/{listId}/expenses/{id}     | Delete an expense               |

Example request body — create expense list:
{ "title": "Groceries", "description": "Monthly grocery spending" }

Example request body — create expense:
{ "expenseName": "Coffee", "amount": 4.5 }

## Spring Security - to be implemented

## Frontend Notes

The frontend is a test client, 
not a polished end-user product — it exists to exercise the backend endpoints directly. 
No routing, no state management library, no auth flow, by design, 
since none of that exists on the backend yet either.