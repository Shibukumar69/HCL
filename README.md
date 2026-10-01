# 📦 Retail Inventory Management System (Agile Capstone Case Study - P_022)

> A modern, enterprise-grade, full-stack **Retail Inventory Management System** built with **Java Spring Boot 3, Spring Data JPA, Spring Security, MySQL 8, Angular 19, and Docker**. Designed following **Agile/Scrum principles across 8 Epics & 15 Sprints**.

---

### 📑 Project Reports & Academic Documentation
- 📄 **SRS Document (Word Format)**: [Download/View SRS Document (`documents/P_022_SRS_ABES_Format_v3_8pagesnew.docx`)](./documents/P_022_SRS_ABES_Format_v3_8pagesnew.docx)
- 🎓 **Capstone Viva & Presentation Guide**: [View Viva Cheatsheet (`CAPSTONE_VIVA_GUIDE.md`)](./CAPSTONE_VIVA_GUIDE.md)

---

## 🏛️ System Architecture

```
                                  +---------------------------------------+
                                  |      Angular 19 Frontend (SPA)        |
                                  |      (Port 4200 / Port 80 via Nginx)  |
                                  +-------------------+-------------------+
                                                      |
                                             REST API | (HTTP/JSON + JWT)
                                                      v
                                  +-------------------+-------------------+
                                  |    Java Spring Boot Backend API       |
                                  |    (Port 5000 / Controller-Service)   |
                                  +-------------------+-------------------+
                                                      |
                                     Spring Data JPA  | (ACID Transactions)
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
| **Epic 1** | **System Architecture & Database Design** | 3-Tier MVC architecture, MySQL Connection Pool, Parameterized Queries (Anti-SQL Injection), Global Error Handling. |
| **Epic 2** | **Product & Category Catalog Management** | SKU generation, selling price, cost price, profit margin calculation, category filtering, product deletion. |
| **Epic 3** | **Multi-Warehouse Inventory Control** | Multi-location stock matrix, Low-stock alerts (`min_threshold`), Real-time synchronized quantity view. |
| **Epic 4** | **Inter-Warehouse Stock Transfers** | **ACID Database Transactions** (`BEGIN`, `COMMIT`, `ROLLBACK`) for atomic stock transfers between godowns. |
| **Epic 5** | **Order Fulfillment & Sales Lifecycle** | Customer sales orders, automatic inventory deduction, status transitions (`PENDING` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`). |
| **Epic 6** | **Supplier & Vendor Management** | Supplier directory, procurement lead-time tracking (in days), vendor contact profiles. |
| **Epic 7** | **Real-Time Analytics & Dashboard** | Consolidated KPI metrics (Products, Warehouses, Total Units in Stock, Low Stock count, Total Revenue, Recent Orders). |
| **Epic 8** | **Security & DevOps / Containerization** | JWT Authentication, Role-Based Access Control (`ADMIN`, `WAREHOUSE_MANAGER`, `STAFF`), Docker, Docker Compose, Jenkins CI/CD. |

---

## 🗄️ Database Schema (MySQL 8.0)

```sql
-- 1. Warehouses (Locations)
warehouses (id, code, name, location, capacity, created_at)

-- 2. Product Catalog
products (id, sku, name, category, price, cost_price, created_at, updated_at)

-- 3. Multi-Warehouse Stock Mapping
inventory (id, product_id, warehouse_id, quantity, min_threshold)

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

| Module | Method | Endpoint | Description |
| :--- | :---: | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Register user with Bcrypt hashed password |
| **Auth** | `POST` | `/api/auth/login` | Login and obtain signed JWT Bearer Token |
| **Products** | `GET` | `/api/products` | Get all catalog products |
| **Products** | `POST` | `/api/products` | Create new retail product |
| **Products** | `DELETE` | `/api/products/:id` | Remove product from catalog |
| **Warehouses** | `GET` | `/api/warehouses` | List all storage warehouses |
| **Inventory** | `GET` | `/api/warehouses/inventory/overview` | Multi-warehouse stock level table |
| **Inventory** | `GET` | `/api/warehouses/inventory/low-stock` | Low-stock items below threshold |
| **Inventory** | `POST` | `/api/warehouses/inventory/transfer` | Atomic inter-warehouse stock transfer |
| **Orders** | `GET` | `/api/orders` | List customer orders |
| **Orders** | `POST` | `/api/orders` | Place order with auto stock deduction |
| **Orders** | `PATCH` | `/api/orders/:id/status` | Update fulfillment status |
| **Suppliers** | `GET` | `/api/suppliers` | List registered suppliers |
| **Suppliers** | `POST` | `/api/suppliers` | Add new supplier |
| **Dashboard** | `GET` | `/api/dashboard/stats` | Consolidated KPI analytics |

---

## 💻 Running the Project Locally

### Prerequisites:
- **Node.js**: v18+ or v20+
- **MySQL**: Running on port 3306 (`retail` database created)

### 1. Spring Boot Backend:
```bash
cd backend
# Windows:
.\mvnw.cmd spring-boot:run

# Linux / Mac:
./mvnw spring-boot:run
# Server runs on http://localhost:5000
```

### 2. Angular Frontend App:
```bash
cd frontend
npm install
npm start
# Application runs on http://localhost:4200
```

---

## 🐳 Running via Docker Compose (Single Command)

```bash
# Build and run MySQL, Backend API, and Frontend Nginx in containers
docker-compose up --build -d
```
- **Frontend UI**: `http://localhost`
- **Backend API**: `http://localhost:5000`
- **MySQL DB**: `localhost:3306`

---

## 🛠️ Tech Stack & Tools

- **Frontend:** Angular 19 (Standalone Components, Signals, Reactive RxJS, Modern CSS3)
- **Backend:** Node.js, Express.js 5.x (3-Tier Layered Architecture)
- **Database:** MySQL 8.0 (Connection Pool, ACID Transactions)
- **Authentication:** JSON Web Tokens (JWT) + Bcrypt.js password hashing
- **DevOps:** Docker, Multi-stage Dockerfile, Nginx, Docker Compose, Jenkins CI/CD Pipeline
- **Methodology:** Agile / Scrum (8 Epics, 15 Sprints)
