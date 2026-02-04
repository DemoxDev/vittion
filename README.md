# Vittion

Vittion is a comprehensive full-stack administration platform designed for the optical industry. It enables seamless management of specialized product catalogs and provides high-fidelity, immersive lens demonstration experiences.

## 🚀 Key Features

- **Dynamic Catalog Management**: Full CRUD operations for lens designs, materials, treatments, and visual assets.
- **Immersive Demonstrator**: A selection-based hub (`/lenses`) that launches interactive demonstrations of lens compositions.
- **Intelligent Linking**: Explicitly associate visual assets from a central library with specific product identifiers.
- **Real-time Analytics**: Dashboard overview showing catalog volume and distribution using dynamic database queries.
- **Persistent Backend**: Powered by Python Flask and PostgreSQL, providing stable storage for complex optical data relationships.

## 🛠 Technical Specifications

### Frontend

- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Router**: React Router 7

### Backend

- **Framework**: Python Flask
- **ORM**: SQLAlchemy
- **Database**: PostgreSQL 16
- **Containerization**: Docker & Docker Compose

## 📖 Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js (v18+) & npm

### Installation & Startup

1. **Clone the repository**
2. **Launch the Backend & Database**
   ```bash
   docker-compose up --build -d
   ```
3. **Seed the Database** (Required for initial data)
   ```bash
   docker exec vittion-backend python seed.py
   ```
4. **Launch the Frontend**
   ```bash
   npm install
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

### Environment Variables

The backend automatically connects to PostgreSQL via the `DATABASE_URL` defined in `.env`. Default: `postgresql://vittion:vittion@db:5432/vittion`.

Default values are provided in `example.env`.

## 📂 Project Structure

- `src/app/dashboard/`: Administrative pages for designs, materials, treatments, and images.
- `src/app/lenses/`: The immersive catalog selection and demonstration pages.
- `src/lib/api.ts`: Centralized frontend API client.
- `backend/app.py`: Main Flask application and REST endpoints.
- `backend/models.py`: SQLAlchemy database schema definitions.
- `backend/seed.py`: Utility script for migrating JSON data to PostgreSQL.

## 🔧 Maintenance Operations

### How to link an image to a product?

In the **Images Dashboard**, select an image to open the detail modal. Use the "Link to Product" feature to associate it with a specific Design, Treatment, or Material.

### How to add new equipment to the Demonstrator?

Use the **Lenses** management dashboard (or API) to create a new Lens record. Link it to an existing Design, Material, and Treatment to automatically generate the enriched demonstration view.

---

_Vittion — Immersive Optical Engineering_
