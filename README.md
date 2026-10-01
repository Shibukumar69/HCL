# 📦 Retail Inventory Management System (Agile Capstone Case Study - P_022)

[![Java](https://img.shields.io/badge/Java-21%20%7C%2025-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-19.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![CI/CD](https://img.shields.io/badge/GitHub%20Actions-Automated%20Pipeline-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/Shibukumar69/HCL/actions)

> An enterprise-grade, full-stack **Retail Inventory Management System** built with **Java Spring Boot 3, Spring Data JPA, Spring Security (JWT), MySQL 8, Angular 19, and Docker**. Designed and delivered following **Agile / Scrum methodology across 8 Epics & 15 Sprints**.

---

### 📑 Project Reports & Academic Documentation
- 📄 **SRS Document (Word Format)**: [Download/View SRS Document (`documents/P_022_SRS_ABES_Format_v3_8pagesnew.docx`)](./documents/P_022_SRS_ABES_Format_v3_8pagesnew.docx)
- 🎓 **Capstone Viva & Presentation Guide**: [View Viva Cheatsheet (`CAPSTONE_VIVA_GUIDE.md`)](./CAPSTONE_VIVA_GUIDE.md)
- ⚙️ **CI/CD Pipeline Workflow**: [View GitHub Actions Workflow (`.github/workflows/ci-cd.yml`)](./.github/workflows/ci-cd.yml)

---

## 🏛️ System Architecture

```
                                  +---------------------------------------+
                                  |      Angular 19 Frontend (SPA)        |
                                  |      (Port 4200 / Port 80 via Nginx)  |
                                  +-------------------+-------------------+
                                                      |
                                             REST API | (HTTP/JSON + Bearer JWT)
                                                      v
                                  +-------------------+-------------------+
                                  |    Java Spring Boot Backend API       |
                                  |    (Port 5000 / Controller-Service)   |
                                  +-------------------+-------------------+
                                                      |
                                      Spring Data JPA | (ACID Transactions & Locking)
                                                      v
                                  +-------------------+-------------------+
                                  |         MySQL 8.0 Database            |
                                  |         (Port 3306)                   |
                                  +---------------------------------------+
```

---

## 🚀 Key Features by Agile Epics (8 Epics & 15 Sprints)

| Epic # | Epic Name | Key Sprint Deliverables & Implementation |
| :---: | :--- | :--- |
| **Epic 1** | **Core Architecture & Error Handling** | Controller-Service-Repository 3-tier layering, HikariCP Connection Pool, Global `@RestControllerAdvice` error handler. |
| **Epic 2** | **Product & Category Catalog Management** | SKU auto-validation, selling price vs cost price margin calculation, category filtering, deletion safeguards. |
| **Epic 3** | **Multi-Warehouse Inventory Control** | Multi-godown stock matrix (Product × Warehouse), Low-stock alerts (`min_threshold`), real-time stock sync. |
| **Epic 4** | **Inter-Warehouse Stock Transfers** | **ACID SQL Transactions** (`@Transactional` + `@Lock(LockModeType.PESSIMISTIC_WRITE)`) for safe inter-godown transfers. |
| **Epic 5** | **Order Fulfillment & Sales Lifecycle** | Customer sales orders, automated stock deduction, status transitions (`PENDING` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`). |
| **Epic 6** | **Supplier & Vendor Management** | Supplier directory, procurement lead-time tracking (in days), contact profiles, vendor safeguards. |
| **Epic 7** | **Real-Time Analytics & Dashboard** | Live KPI aggregations (Products, Warehouses, Total Units in Stock, Low Stock count, Total Revenue, Recent Orders). |
| **Epic 8** | **Security & DevOps / Containerization** | JWT Authentication, Role-Based Access Control (`ADMIN`, `WAREHOUSE_MANAGER`, `STAFF`), Multi-stage Docker, GitHub Actions, Jenkins CI/CD. |

---

## 🗄️ Database Schema (MySQL 8.0)

```sql
-- 1. Warehouses (Locations)
warehouses (id, code, name, location, capacity, created_at)

-- 2. Product Catalog
products (id, sku, name, category, price, cost_price, created_at, updated_at)

-- 3. Multi-Warehouse Stock Mapping
inventory (id, product_id, warehouse_id, quantity, min_threshold) [UNIQUE(product_id, warehouse_id)]

-- 4. Suppliers / Vendors
suppliers (id, name, contact_person, email, phone, address, lead_time_days, created_at)

-- 5. Customer Sales Orders
orders (id, order_number, customer_name, customer_email, warehouse_id, total_amount, status, created_at)

-- 6. Order Line Items
order_items (id, order_id, product_id, quantity, unit_price, subtotal)

-- 7. User Authentication & RBAC
users (id, name, email, password, role, created_at)
```

---

## 📡 REST API Reference

| Module | Method | Endpoint | Access | Description |
| :--- | :---: | :--- | :---: | :--- |
| **Health** | `GET` | `/` | Public | System status and API health check |
| **Auth** | `POST` | `/api/auth/register` | Public | Register user with BCrypt hashed password |
| **Auth** | `POST` | `/api/auth/login` | Public | Login and obtain signed JWT Bearer Token |
| **Auth** | `GET` | `/api/auth/profile` | Authenticated | Retrieve current user profile |
| **Auth** | `GET` | `/api/auth/users` | `ADMIN` Only | Retrieve list of all registered users |
| **Products** | `GET` | `/api/products` | Public | Get all catalog products |
| **Products** | `GET` | `/api/products/:id` | Public | Get single product by ID |
| **Products** | `POST` | `/api/products` | Public | Create new retail product |
| **Products** | `DELETE` | `/api/products/:id` | Public | Remove product from catalog |
| **Warehouses** | `GET` | `/api/warehouses` | Public | List all storage warehouses |
| **Warehouses** | `POST` | `/api/warehouses` | Public | Register a new warehouse location |
| **Inventory** | `GET` | `/api/warehouses/inventory/overview` | Public | Multi-warehouse stock level table |
| **Inventory** | `GET` | `/api/warehouses/inventory/low-stock` | Public | Low-stock items below threshold |
| **Inventory** | `POST` | `/api/warehouses/inventory/transfer` | Public | Atomic inter-warehouse stock transfer |
| **Orders** | `GET` | `/api/orders` | Public | List customer orders |
| **Orders** | `GET` | `/api/orders/:id` | Public | Get order details with line items |
| **Orders** | `POST` | `/api/orders` | Public | Place order with auto stock deduction |
| **Orders** | `PATCH` | `/api/orders/:id/status` | Public | Update order fulfillment status |
| **Suppliers** | `GET` | `/api/suppliers` | Public | List registered suppliers |
| **Suppliers** | `POST` | `/api/suppliers` | Public | Add new supplier |
| **Suppliers** | `DELETE` | `/api/suppliers/:id` | Public | Remove supplier profile |
| **Dashboard** | `GET` | `/api/dashboard/stats` | Public | Consolidated real-time KPI analytics |

---

## 💻 Running the Project Locally

### Prerequisites:
- **Java**: JDK 21+ or JDK 25
- **Node.js**: v18+ or v20+
- **MySQL**: Running on port 3306 with `retail` database created

```sql
CREATE DATABASE IF NOT EXISTS retail;
```

### 1. Spring Boot Backend:
```bash
cd backend

# Windows:
.\mvnw.cmd spring-boot:run

# Linux / Mac:
./mvnw spring-boot:run

# Server runs on http://localhost:5000
```

### 2. Angular Frontend:
```bash
cd frontend
npm install
npm start

# Application runs on http://localhost:4200
```

---

## 🐳 Running via Docker Compose (Single Command)

```bash
# Build and run MySQL, Spring Boot Backend API, and Frontend Nginx in containers
docker-compose up --build -d
```
- **Frontend UI**: `http://localhost`
- **Backend API**: `http://localhost:5000`
- **MySQL DB**: `localhost:3306`

---

## 🛠️ Tech Stack & Tools

- **Frontend:** Angular 19, Standalone Components, Angular Signals, RxJS, Modern CSS3
- **Backend:** Java 21/25, Spring Boot 3.4.x, Spring Data JPA, Spring Security 6
- **Database:** MySQL 8.0 (InnoDB Engine, HikariCP Connection Pool, Pessimistic Write Locking)
- **Security:** JWT (JSON Web Tokens) with HMAC-SHA + BCrypt Password Encoder
- **DevOps & CI/CD:** Docker Multi-stage Builds, Docker Compose, Nginx, GitHub Actions Workflow, Jenkinsfile
- **Methodology:** Agile / Scrum (8 Epics, 15 Sprints)

---

## 👥 Contributors & Capstone Details
- **Project ID**: P_022
- **Institution**: ABES Engineering College / University Capstone Project
- **Module**: Retail Inventory Management System (Agile Capstone Study)
