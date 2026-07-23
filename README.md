# API Vault — Premium Developer API Discovery & AI Architect Studio

> **API Vault** is a high-performance developer portal and AI-powered system design platform. It combines a curated discovery directory of 630+ verified public APIs with an **AI Architect Studio** that designs, reviews, and exports custom REST, GraphQL, and gRPC endpoint specifications.

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18.2-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v5.4-646CFF.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-v4.19-000000.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/cloud/atlas)
[![AI Engine](https://img.shields.io/badge/AI_Engine-Nemotron--3_Ultra-76B900.svg)](https://openrouter.ai/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌐 2. Live Demo & Deployment

* **Live Web App**: [https://api-vault-ochre.vercel.app/]
* **Backend API Service**: [https://api-vault-j5vj.onrender.com/]
* **Cloud Database**: MongoDB Atlas Cluster
* **Access Mode**: Guest Developer Login (No setup required) or GitHub OAuth Authentication

---

## 🖼️ 3. Screenshots & Preview

| Studio & Endpoint Canvas | AI Bulk Schema Architect |
| :---: | :---: |
| ![API Studio Workspace](client/src/assets/tech.png) | ![AI Schema Review](client/src/assets/tech.png) |
| *Interactive REST / GraphQL / gRPC Design Canvas* | *Human-in-the-Loop Bulk Schema Review Modal* |

---

## 📜 4. Table of Contents

1. [Title & Description](#api-vault--premium-developer-api-discovery--ai-architect-studio)
2. [Live Demo & Deployment](#-2-live-demo--deployment)
3. [Screenshots & Preview](#-3-screenshots--preview)
4. [Table of Contents](#-4-table-of-contents)
5. [Features](#-5-features)
6. [Tech Stack](#-6-tech-stack)
7. [Architecture & System Design](#-7-architecture--system-design)
8. [Getting Started & Installation](#-8-getting-started--installation)
9. [Environment Variables](#-9-environment-variables)
10. [API Reference](#-10-api-reference)
11. [Folder Structure](#-11-folder-structure)
12. [Deployment](#-12-deployment)
13. [Testing](#-13-testing)
14. [Roadmap & Future Improvements](#-14-roadmap--future-improvements)
15. [Contributing](#-15-contributing)
16. [License](#-16-license)
17. [Contact & Author](#-17-contact--author)

---

## ✨ 5. Features

* **🔍 630+ Verified API Directory**: Search, filter, and inspect public APIs requiring API Keys with zero-latency pagination and CORS/HTTPS verification tags.
* **🤖 AI Stack Curation**: Describe your application in plain English and let Nemotron AI recommend a tailored stack of public APIs from the database.
* **🛠️ API Architect Studio**: Create projects and design custom endpoints across **REST**, **GraphQL**, and **gRPC** protocols.
* **⚡ Bulk AI Schema Generation**: Architect complete multi-endpoint system requirements in one request using OpenRouter (`nvidia/nemotron-3-ultra-550b-a55b:free`).
* **👤 Human-in-the-Loop Review**: Interactively inspect, toggle, edit, and approve AI-generated schemas before committing them to your database.
* **📥 Multi-Format Specification Exporter**:
  * **OpenAPI 3.0 (JSON)**: For REST APIs (compatible with Postman, Swagger, and SDK generators).
  * **GraphQL SDL (.graphql)**: Complete Schema Definition Language with queries, mutations, and subscriptions.
  * **Protobuf v3 (.proto)**: Ready-to-compile gRPC service and payload message definitions.
* **📱 Responsive Split Workspace**: Adaptive dual-pane panel layout with mobile view toggles and auto-collapsing sidebar drawers.
* **🔒 Secure Authentication**: Integrated GitHub OAuth session authentication alongside quick developer guest access.

---

## 🛠️ 6. Tech Stack

### Frontend
* **Core**: React 18, Vite 5, JavaScript (ES6+)
* **Styling**: Tailwind CSS, Custom Monochromatic Design System
* **Animations**: Framer Motion
* **Icons & State**: Lucide React, Zustand, React Query

### Backend
* **Runtime**: Node.js (v18+), Express.js
* **Authentication**: Passport.js (GitHub Strategy), Express-Session
* **Database Driver**: Mongoose ODM
* **HTTP Client**: Axios

### Database & External Services
* **Database**: MongoDB Atlas (Cloud Cluster)
* **AI Engine**: OpenRouter API (`nvidia/nemotron-3-ultra-550b-a55b:free`)
* **Hosting**: Vercel (Client Edge) + Railway (Server Container)

---

## 🏗️ 7. Architecture & System Design

```
+-----------------------------------------------------------------------------------+
|                                   USER BROWSER                                    |
|  +-----------------------------------------------------------------------------+  |
|  |                            React 18 / Vite Client                           |  |
|  |   (API Vault Directory, Architect Studio Canvas, Human-in-the-Loop Modal)    |  |
|  +-------------------------------------+---------------------------------------+  |
+----------------------------------------|------------------------------------------+
                                         | HTTPS (Axios withCredentials)
                                         v
+-----------------------------------------------------------------------------------+
|                                RAILWAY BACKEND                                    |
|  +-----------------------------------------------------------------------------+  |
|  |                           Express.js API Server                             |  |
|  |  - Auth Middleware (Passport GitHub & Session)                               |  |
|  |  - API Filtering & Health Monitoring Routes                                 |  |
|  |  - Projects & Endpoints Controller                                          |  |
|  |  - OpenAPI / GraphQL / Protobuf Specification Compiler                      |  |
|  +-------------------+-------------------------------------+-------------------+  |
+----------------------|-------------------------------------|----------------------+
                       |                                     |
                       v                                     v
       +-------------------------------+     +-------------------------------+
       |       MONGODB ATLAS CLOUD     |     |     OPENROUTER AI ENGINE      |
       |  - API Items (630+ Keyed)      |     |  - nvidia/nemotron-3-ultra    |
       |  - User Projects & Endpoints  |     |  - Bulk Schema Architect      |
       +-------------------------------+     +-------------------------------+
```

---

## 🚀 8. Getting Started & Installation

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)
* **MongoDB Atlas Account** (or local MongoDB v6.0+)
* **OpenRouter API Key** ([Get free key](https://openrouter.ai/))
* **GitHub OAuth Credentials** *(Optional for local auth)*

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/PrathamR015/API_Vault.git
   cd API_Vault
   ```

2. **Configure & Start the Backend**:
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file inside the `server/` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/api-vault
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   CALLBACK_URL=http://localhost:5000/api/auth/github/callback
   CLIENT_URL=http://localhost:5173
   SESSION_SECRET=supersecret_session_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   OPENROUTER_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free
   ```
   Seed the cloud database with 630+ APIs (Optional):
   ```bash
   node seed.js
   ```
   Start the server:
   ```bash
   npm start
   ```

3. **Configure & Start the Frontend**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Access the App**: Open your browser at `http://localhost:5173`.

---

## 🔑 9. Environment Variables

| Variable Name | Required | Default / Example Value | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | No | `5000` | Port for the Express server to listen on |
| `MONGO_URI` | **Yes** | `mongodb+srv://user:pass@cluster.mongodb.net/api-vault` | MongoDB Atlas database connection string |
| `GITHUB_CLIENT_ID` | No | `Ov23li...` | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | No | `af3d53...` | GitHub OAuth App Client Secret |
| `CALLBACK_URL` | **Yes** | `http://localhost:5000/api/auth/github/callback` | OAuth redirect callback URL |
| `CLIENT_URL` | **Yes** | `http://localhost:5173` | Allowed frontend origin for CORS |
| `SESSION_SECRET` | **Yes** | `random_session_secret` | Key used to sign session cookies |
| `OPENROUTER_API_KEY` | **Yes** | `sk-or-v1-...` | API Key from OpenRouter for AI generation |
| `OPENROUTER_MODEL` | No | `nvidia/nemotron-3-ultra-550b-a55b:free` | Target LLM model for AI curation & schema design |

---

## 📡 10. API Reference

### Public API Directory
* `GET /api/apis` — Fetch paginated APIs. Supports `category`, `authType`, `search`, `ids`, `page`, `limit`.
* `POST /api/apis` — Add a new API entry to the vault.
* `PUT /api/apis/:id/upvote` — Upvote an API entry.

### AI Stack Curation
* `POST /api/curate` — Curate a stack of APIs matching user requirements.

### API Architect Studio
* `GET /api/projects` — Fetch all design projects owned by the logged-in user.
* `POST /api/projects` — Create a new API design project.
* `GET /api/projects/:id` — Fetch project details and designed endpoints.
* `POST /api/projects/:id/endpoints/generate-bulk` — AI bulk schema generation for REST, GraphQL, or gRPC.
* `POST /api/projects/:id/endpoints/bulk` — Save approved schemas to database.
* `GET /api/projects/:id/export?format=openapi|proto|graphql` — Compile and download project specifications.

---

## 📁 11. Folder Structure

```
API_Vault/
├── API_List.md                 # Raw markdown dataset (630+ verified APIs)
├── README.md                   # Project documentation
├── client/                     # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Images and logos
│   │   ├── components/         # Navbar, Sidebar, AIChatDrawer, APICard, etc.
│   │   ├── pages/              # Vault, Projects, ProjectStudio, KnowMore, About, Login
│   │   ├── services/           # Axios API configuration & request helpers
│   │   ├── store/              # Zustand global state
│   │   ├── App.jsx             # Main Router setup
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
└── server/                     # Node.js + Express Backend
    ├── config/                 # DB & Passport configuration
    ├── middleware/             # Auth verification middleware
    ├── models/                 # Mongoose schemas (API, Project, Endpoint, User)
    ├── routes/                 # Express route handlers (apis, projects, curate, auth)
    ├── seed.js                 # Database seeder script
    ├── server.js               # Entry point
    └── package.json
```

---

## ☁️ 12. Deployment

* **Frontend (Vercel)**:
  1. Import `client/` folder in Vercel.
  2. Set environment variable `VITE_API_URL` to your Railway backend URL.
  3. Deploy (`npm run build` -> `dist`).

* **Backend (Railway)**:
  1. Import `server/` folder in Railway.
  2. Add environment variables (`MONGO_URI`, `OPENROUTER_API_KEY`, `CLIENT_URL`, etc.).
  3. Railway auto-detects `package.json` and runs `npm start`.

* **Database (MongoDB Atlas)**:
  1. Create M0 Free Tier Cluster.
  2. Add IP access `0.0.0.0/0` in Network Access.
  3. Connect via Mongoose connection string.

---

## 🧪 13. Testing

* **Production Build Validation**:
  ```bash
  cd client
  npm run build
  ```
  *Verifies zero syntax errors, type exceptions, or broken imports.*

* **AI OpenRouter Integration Test**:
  ```bash
  cd server
  node -e "require('./routes/projects')"
  ```

---

## 🛣️ 14. Roadmap & Future Improvements

- [ ] **Postman Collection Exporter (v2.1)** for 1-click import into Postman desktop.
- [ ] **OpenAPI 3.1 Importer** to parse existing Swagger JSON files into studio projects.
- [ ] **Interactive Mock Server Sandbox** to execute live test pings against designed endpoints.
- [ ] **Multi-Model Selector** allowing users to switch between Nemotron, Llama 3, and Claude models.

---

## 🤝 15. Contributing

Contributions are welcome!
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 16. License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 17. Contact & Author

**Pratham Raval**
* **Role**: Full-Stack Developer & AI Engineer
* **GitHub**: [@PrathamR015](https://github.com/PrathamR015)
* **Repository**: [https://github.com/PrathamR015/API_Vault](https://github.com/PrathamR015/API_Vault)
