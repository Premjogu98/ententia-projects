# Ententia - Insight Management System

A full-stack application for managing organizational "Insights" (short notes/analyses). Built with FastAPI (Backend), React + Vite (Frontend), and MongoDB.

## 🚀 Features

### Core Functionality
-   **Authentication**: Secure JWT-based Login and Registration.
-   **Insight Management**:
    -   **Create/Edit/Delete**: Full CRUD operations for insights.
    -   **Shared Workspace**: All users can view and collaborate on all insights.
-   **Dashboard**:
    -   **Filtering**: Filter by Category, Status (Draft, Published, etc.), and Complexity.
    -   **Search**: Full-text search on Title and Content.
    -   **Pagination**: Server-side pagination handling large datasets (1000+ records).
-   **Bulk Operations**:
    -   **Seed API**: Generate thousands of dummy insights instantly for testing.
    -   **Bulk Delete**: Select and delete multiple insights at once.
-   **UI/UX**:
    -   **Theme**: Toggle between Light and Dark modes.
    -   **Responsive Design**: optimized for various screen sizes.
-   **Performance & Scalability**:
    -   **Database Indexing**: Optimized Compound Indexes designed to handle **10 Million+ (1 Cr+)** records efficiently.
    -   **Efficient Pagination**: Uses index-covered queries for sorting and filtering to prevent performance degradation at scale.

---

## 🛠️ Tech Stack
-   **Backend**: Python, FastAPI, MongoEngine (ODM), **Faker** (Data Generation)
-   **Database**: MongoDB
-   **Frontend**: React, Vite, Vanilla CSS (Variables & Utility classes), Axios
-   **Containerization**: Docker, Docker Compose

---

## 🐳 Quick Start (Docker)

The easiest way to run the application is using Docker Compose. This starts the Database, Backend, and Frontend services together.

1.  **Clone/Open** the repository.
2.  **Run** the following command in the root directory:

    ```bash
    docker-compose up --build -d
    ```

3.  **Access the App**:
    -   **Frontend**: [http://localhost:3000](http://localhost:3000)
    -   **Backend API**: [http://localhost:8000/api/v1/insights/docs](http://localhost:8000/api/v1/insights/docs) (Swagger UI)

---

## 🔧 Manual Setup

If you prefer to run services individually:

### 1. Database
Ensure you have **MongoDB** running locally on port `27017`.

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
python run.py
```
*Server runs at: http://localhost:8000*

### 3. Frontend
```bash
cd frontend/vite-project
npm install
npm run dev
```
*App runs at: http://localhost:5173 (Note: You may need to update `API_URL` in `src/services/api.js` if port differs)*

---

## ⚡ API Usage & Seeding Data

### Generate Dummy Data (/seed)
To quickly populate the database with insights (useful for testing pagination and performance), use the **Seed API**.
This uses the **Faker** library to generate realistic titles, content, categories, and metadata.

1.  Go to the **API Documentation**: [http://localhost:8000/api/v1/insights/docs](http://localhost:8000/api/v1/insights/docs)
2.  Find the `POST /api/v1/insights/seed` endpoint.
3.  Click **Try it out**.
4.  Enter the number of insights to generate (default: 5000).
5.  Click **Execute**.

**curl example:**
```bash
curl -X 'POST' \
  'http://localhost:8000/api/v1/insights/seed?count=5000' \
  -H 'accept: application/json' \
  -d ''
```

This will create 5000 randomized insights in the database using **Faker**.

---

## 🔒 Default Access
-   **Registration**: You can register a new user at `/register`.
-   **Permissions**: The application is currently configured as an open workspace where **all registered users** can view, edit, and delete **all insights**.
