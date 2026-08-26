# CupFlow ERP

A full-stack ERP system designed for disposable cup manufacturing industries.

CupFlow ERP manages the complete production lifecycle — from raw material inventory and manufacturing stages to order management and dispatch tracking.

The project demonstrates a real-world manufacturing workflow using modern backend architecture, secure authentication, database design, and production deployment.

---

## Live Demo

Frontend:
```
https://your-frontend-url.onrender.com
```

Backend API:
```
https://cupflow-erp.onrender.com
```

> Replace the frontend URL with your actual Render URL.

---

# Features

## Authentication & Authorization

- JWT-based authentication
- Role-based access control
- Secure API endpoints
- User management

Supported roles:

- Admin
- Manager
- HR Manager
- Floor Supervisor
- Worker

---

# Production Workflow

CupFlow ERP follows a complete manufacturing pipeline:

```
ORDER_RECEIVED

        ↓

RAW_MATERIAL_ISSUED

        ↓

SHEET_MAKING_IN_PROGRESS

        ↓

SHEET_READY

        ↓

CUP_MOLDING_IN_PROGRESS

        ↓

CUPS_READY_FOR_PRINTING

        ↓

PRINTING_IN_PROGRESS

        ↓

READY_TO_DISPATCH

        ↓

DISPATCHED
```

The system validates stage transitions to prevent invalid production flows.

---

# Core Modules

## Orders

- Create production orders
- Track order status
- Monitor production progress
- Maintain order history


## Inventory

- Material stock management
- Stock ledger tracking
- Stock reservation system
- Low stock detection


## Materials

- Raw material management
- Material details
- BOM integration


## Cups

- Cup specification management
- Cup dimensions
- Cup-BOM mapping


## BOM (Bill of Materials)

- Define material requirements for each cup type
- Maintain production requirements


## Production

- Track manufacturing stages
- Maintain production logs


## Dispatch

- Manage completed orders
- Dispatch tracking
- Inventory consumption handling


---

# System Architecture

```
                    User

                     |

                     ↓

            React Frontend

                     |

              REST API Calls

                     |

                     ↓

          Spring Boot Backend

                     |

                     ↓

          PostgreSQL Database

                     |

                     ↓

              Supabase Cloud
```

---

# Technology Stack

## Backend

- Java
- Spring Boot 4
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- PostgreSQL
- Maven


## Frontend

- React
- Vite
- JavaScript
- React Router
- Context API
- CSS Modules


## Database

- PostgreSQL
- Supabase


## Deployment

- Render
- Docker

---

# Database Design

The application uses a relational database design focused on manufacturing workflows.

Main entities:

```
User

Material

Cup

BOM Entry

Stock Ledger

Stock Reservation

Order

Production Stage Log

Dispatch Record
```

Inventory follows:

```
STOCK_IN
    +
RESERVED
    -
CONSUMED
```

This ensures accurate stock tracking throughout production.

---

# Project Structure

```
CupFlow-ERP

│

├── backend

│   ├── Spring Boot Application

│   ├── REST Controllers

│   ├── Services

│   ├── Repositories

│   └── Security Layer


├── frontend

│   ├── React Application

│   ├── Components

│   ├── Modules

│   ├── Hooks

│   └── Context


├── SQL

│   └── Database Scripts


└── Documentation
```

---

# Running Locally

## Backend Setup

Navigate to backend:

```bash
cd backend
```

Run:

```bash
./mvnw spring-boot:run
```

Windows:

```bash
mvnw.cmd spring-boot:run
```

Required environment variables:

```
DB_URL=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
```

---

## Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run:

```bash
npm run dev
```

---

# Deployment

Production deployment:

```
React Frontend
        |
        |
        ↓
Render Static Site


Spring Boot Backend
        |
        |
        ↓
Render Web Service


PostgreSQL Database
        |
        |
        ↓
Supabase
```

---

# Security

Implemented:

- JWT authentication
- Password encryption
- Protected routes
- Role-based authorization
- Environment-based secrets

Sensitive information is managed through deployment environment variables.

---

# Development Highlights

This project focuses on:

- Clean backend architecture
- Database-first design
- Transaction management
- Inventory consistency
- Production workflow automation
- Scalable REST API design

---

# Future Improvements

Possible enhancements:

- Dashboard analytics
- Production reports
- Machine monitoring
- Employee attendance integration
- Notifications
- Advanced forecasting

---

# Author

Yash Sinha

GitHub:
https://github.com/YashSinha23