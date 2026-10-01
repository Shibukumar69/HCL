# 🎓 Capstone Project Viva & Presentation Cheatsheet (P_022)
## Retail Inventory Management System (Agile Capstone Case Study)

> Yeh guide aapko **Project Presentation**, **Examiner Viva**, aur **Technical Interview Questions** mein top score karne ke liye complete answers aur architecture explanations deti hai.

---

## 🎯 1. Project Introduction (30-Second Elevator Pitch)
> *"Hamara project ek enterprise-level **Retail Inventory Management System** hai jo Agile/Scrum methodology ke 8 Epics aur 15 Sprints mein build kiya gaya hai. Isme multi-warehouse stock tracking, real-time catalog management, automated order fulfillment with stock deduction, aur vendor procurement ko **Java Spring Boot 3, Spring Data JPA, Spring Security (JWT), MySQL 8, aur Angular 19** par implement kiya gaya hai. System ko **Docker** containerization aur **Jenkins CI/CD** pipeline ke sath production-ready banaya gaya hai."*

---

## 💡 2. Top Technical Viva Questions & Best Answers

### Q1: Why did you choose MySQL instead of MongoDB for an Inventory System?
- **Answer:** *"Inventory aur Retail systems mein **ACID properties (Atomicity, Consistency, Isolation, Durability)** aur **Data Integrity** critical hoti hain. Stock transfer aur order fulfillment ke dauran transactions use hote hain taaki stock kabhi mismatch na ho. Is relational structure (Products ➔ Warehouses ➔ Orders) ke liye SQL/MySQL best rehta hai."*

### Q2: How did you implement Inter-Warehouse Stock Transfer safely?
- **Answer:** *"Humne Spring Boot `@Transactional` aur JPA Pessimistic Locking (`@Lock(LockModeType.PESSIMISTIC_WRITE)`) use kiya hai. Jab Source Warehouse se stock minus hota hai aur Destination mein add hota hai, agar beech mein koi error aaye, toh pura operation automatically rollback ho jata hai, jisse concurrency conflict ya inventory data kabhi corrupt nahi hota."*

### Q3: What is the Controller-Service-Repository Architecture in your Spring Boot Backend?
- **Answer:**
  1. **Controller Layer (`controller/`):** REST API endpoints (`@RestController`), request validation (`@Valid`), aur HTTP response mapping.
  2. **Service Layer (`service/`):** Core business logic, stock verification, price calculation, aur `@Transactional` boundaries.
  3. **Repository Layer (`repository/`):** Spring Data JPA repositories with query methods and JPQL/Pessimistic locking.
  4. **Entity Layer (`entity/`):** JPA Object-Relational Mapping (`@Entity`, `@Table`) for MySQL database schema.

### Q4: How is Role-Based Access Control (RBAC) implemented?
- **Answer:** *"Humne **Spring Security 6**, **JWT (JSON Web Tokens)** aur **BCryptPasswordEncoder** use kiya hai. Users ke 3 roles hain: `ADMIN` (Full control), `WAREHOUSE_MANAGER` (Stock transfers & inventory), aur `STAFF` (Orders & Catalog). Hamara `JwtAuthenticationFilter` incoming bearer token validate karke `SecurityContext` set karta hai."*

### Q5: What is the role of Angular Standalone Components & HTTP Interceptors?
- **Answer:** *"Angular 19 Standalone components modules ke boilerplate code ko khatam karke fast client-side rendering provide karte hain. `authInterceptor` har outgoing HTTP request ke sath `Authorization: Bearer <token>` automatically attach karta hai aur 401 token expire hone par auto-logout karta hai."*

---

## 🗺️ 3. Agile / Scrum Mapping Reference (8 Epics & 15 Sprints)

| Sprint # | Epic Covered | Deliverable |
| :---: | :--- | :--- |
| **Sprint 1 - 2** | Epic 1: Core Architecture | Express setup, MySQL Connection Pool, 3-Tier Layering, Error Middleware |
| **Sprint 3 - 4** | Epic 2: Product Catalog | Products CRUD, SKU generator, Price & Margin calculations |
| **Sprint 5 - 6** | Epic 3: Multi-Warehouse | Warehouses CRUD, Multi-location stock matrix, Low stock alerts |
| **Sprint 7 - 8** | Epic 4: Stock Transfers | Atomic Inter-warehouse transfers with ACID transactions |
| **Sprint 9 - 10** | Epic 5: Order Fulfillment | Customer sales orders, automatic inventory deduction, status updates |
| **Sprint 11 - 12**| Epic 6: Supplier Management| Vendor profiles, lead-time tracking, supplier directory |
| **Sprint 13** | Epic 7: Real-Time Analytics | Dashboard KPI metrics (Total products, stock, revenue, recent orders) |
| **Sprint 14** | Epic 8: Authentication | JWT login, password hashing, RBAC permissions, Auth interceptor |
| **Sprint 15** | Epic 8: DevOps & Delivery | Docker multi-stage builds, Docker Compose, Jenkins CI/CD pipeline |

---

## 💻 4. Live Demo Flow (How to Demonstrate in Front of Evaluators)
1. **Step 1:** Open `http://localhost:4200` ➔ Show the **Real-Time Dashboard** (KPI cards, Revenue $249.95, Low stock alerts).
2. **Step 2:** Go to **Product Catalog** ➔ Live search by SKU, filter by category, click "+ Add New Product".
3. **Step 3:** Go to **Multi-Warehouse** ➔ Click "🔄 Inter-Warehouse Stock Transfer" (e.g. transfer 10 units from Delhi to Bangalore) ➔ Show updated quantities.
4. **Step 4:** Go to **Order Fulfillment** ➔ Click "+ Place Customer Order" (select items & warehouse) ➔ Submit ➔ Show how stock is automatically reduced in the warehouse table!
5. **Step 5:** Show **Suppliers & Vendors** directory with procurement lead times.
6. **Step 6:** Click **Logout** ➔ Show smooth toast alert and Login / Register screen with 1-click Demo Login.
