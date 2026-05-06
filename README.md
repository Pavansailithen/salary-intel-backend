# Salary Intel — Backend API

> Production-grade compensation intelligence API for Indian tech salaries

**Live API URL:** [https://salary-intel-backend.onrender.com](https://salary-intel-backend.onrender.com)

---

## 🛠 Tech Stack

- **Runtime Environment:** Node.js
- **Language:** TypeScript
- **Web Framework:** Express
- **Database ORM:** Prisma
- **Database:** PostgreSQL (Supabase)
- **Deployment:** Render

---

## 🚀 API Endpoints

### `GET /health`
Health check endpoint to ensure the API is running correctly.

### `POST /api/ingest-salary`
Ingests a new salary record into the database.

**Example Request Body:**
```json
{
  "company": "Google",
  "role": "Software Engineer",
  "level": "L4",
  "location": "Bengaluru",
  "base_salary": 4500000,
  "stock_grants": 2000000,
  "bonus": 500000,
  "yoe": 4
}
```

### `GET /api/salaries`
Retrieves a list of salary records. Supports query parameters for filtering.

**Query Parameters:**
- `company` (string, optional)
- `role` (string, optional)
- `level` (string, optional)
- `location` (string, optional)

### `GET /api/company/:company`
Retrieves aggregated statistical analysis and data for a specific company.

### `GET /api/compare`
Compares two specific salary records.

**Query Parameters:**
- `salaryId1` (string, required)
- `salaryId2` (string, required)

---

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and configure your Supabase connection strings:
   ```env
   DATABASE_URL="your-supabase-connection-pooler-url"
   DIRECT_URL="your-supabase-direct-connection-url"
   ```

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Push schema to Database:**
   ```bash
   npx prisma db push
   ```

6. **Start Development Server:**
   ```bash
   npm run dev
   ```

---

## 🗄️ Database Schema

The primary data entity is the `Salary` table. Key fields include:

- `id` (UUID, Primary Key)
- `company` (String)
- `role` (String)
- `level` (String)
- `location` (String)
- `base_salary` (Float/Int)
- `stock_grants` (Float/Int)
- `bonus` (Float/Int)
- `total_compensation` (Float/Int, auto-computed)
- `yoe` (Float/Int)
- `created_at` (DateTime)

---

## ✅ Validation Rules

- **Valid Levels:** `L3`, `L4`, `L5`, `SDE1`, `SDE2`, `Senior`
- **Company Normalization:** Company names are automatically converted and normalized to lowercase.
- **Computed Fields:** `total_compensation` is automatically computed based on base salary, stock grants, and bonus.

---

## 🔗 Links

- **Frontend Repository:** [Salary Intel Frontend](https://github.com/Pavansailithen/salary-intel-Frontend)
