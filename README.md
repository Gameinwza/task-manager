# Task Manager

Full Stack Task Management App พร้อม CI/CD Pipeline

## Tech Stack

**Backend:** NestJS + TypeORM + PostgreSQL  
**Frontend:** Next.js + Tailwind CSS  
**Infrastructure:** Docker + Docker Compose  
**CI/CD:** GitHub Actions + Docker Hub

---

## Features

- Register / Login ด้วย JWT Authentication
- เพิ่ม / ลบ / แก้ไข Task
- Mark as Done
- Search Task
- Dark Mode UI

---

## Project Structure

```
task-manager/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── auth/             # Authentication (JWT)
│   │   ├── tasks/            # Task CRUD
│   │   ├── users/            # User management
│   │   └── main.ts
│   └── Dockerfile
├── frontend/                 # Next.js App
│   ├── app/
│   │   ├── page.tsx          # Login
│   │   ├── register/         # Register
│   │   └── tasks/            # Task Manager
│   ├── lib/api.ts            # API Client
│   └── Dockerfile
├── .github/
│   └── workflows/
│       └── deploy.yml        # CI/CD Pipeline
├── docker-compose.yml        # Base
├── docker-compose.dev.yml    # Development
├── docker-compose.prod.yml   # Production
└── .env                      # Environment Variables (ไม่ขึ้น Git)
```

---

## Getting Started

### Prerequisites

- Docker + Docker Compose
- Node.js 20+
- Git

### 1. Clone Repository

```bash
git clone https://github.com/Gameinwza/task-manager.git
cd task-manager
```

### 2. สร้างไฟล์ .env

```bash
cp .env.example .env
```

แก้ไขค่าใน `.env` ครับ

```env
POSTGRES_USER=taskuser
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=taskdb
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. รัน Development

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
```

เปิดเบราว์เซอร์ที่ http://localhost:3000

### 4. รัน Production

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

---

## Development Workflow

```
1. สร้าง Feature Branch
   git checkout -b feature/your-feature

2. เขียนโค้ดและทดสอบใน Docker Dev
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

3. รัน Unit Test
   cd backend && npm run test

4. Push และเปิด Pull Request
   git push origin feature/your-feature

5. GitHub Actions รัน Test อัตโนมัติ
   ถ้าผ่าน → Merge เข้า main ได้

6. Merge แล้ว CI/CD Build + Push Docker Hub อัตโนมัติ
```

---

## CI/CD Pipeline

Pipeline มี 2 Jobs ครับ

**Job 1: test** (รันทุก Push และ PR)
- ติดตั้ง Dependencies
- รัน Unit Test 15 Tests

**Job 2: build-and-push** (รันเฉพาะ main branch)
- Build Docker Image Backend + Frontend
- Push ขึ้น Docker Hub

```
Push โค้ด
    ↓
รัน Unit Test อัตโนมัติ
    ↓ ผ่าน
Build Docker Image
    ↓
Push ขึ้น Docker Hub
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | สมัครสมาชิก |
| POST | /auth/login | เข้าสู่ระบบ |

### Tasks (ต้อง Login ก่อน)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tasks | ดึง Task ทั้งหมด |
| GET | /tasks?search=xxx | ค้นหา Task |
| POST | /tasks | สร้าง Task ใหม่ |
| PATCH | /tasks/:id | Toggle Done |
| DELETE | /tasks/:id | ลบ Task |

---

## Security

- JWT Authentication
- Password Hashing ด้วย bcrypt
- Rate Limiting (20 requests/นาที)
- Input Validation ด้วย class-validator
- CORS Protection
- Environment Variables สำหรับ Secrets ทั้งหมด

---

## Running Tests

```bash
cd backend
npm run test
```

ผลลัพธ์ที่คาดหวัง

```
Test Suites: 6 passed, 6 total
Tests:       15 passed, 15 total
```

---

## Docker Hub

Images พร้อมใช้งานที่

- `godgameinwza/task-manager-backend:latest`
- `godgameinwza/task-manager-frontend:latest`

---
