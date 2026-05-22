# API Vault — Premium Developer API Discovery & Curation Portal

API Vault was built on a simple yet powerful premise: to create a centralized, frictionless hub where developers can instantly discover free and open-source public APIs. No more wasting hours manually searching through fragmented directories or undocumented sites—API Vault aggregates production-ready resources all in one premium ecosystem.

A common hurdle for many developers—especially when starting a new project—is not knowing exactly which APIs are required or even exist to power their application's features. API Vault directly addresses this challenge by taking the guesswork out of system design. Through our interactive AI Project Assistant, developers can simply input their raw project description, and the system acts as a personalized architect, curating a custom stack of the precise, free, and open-source APIs needed to build their application.

---

## ✨ Key Features & Experience

API Vault is loaded with intuitive features designed to make API discovery and integration as seamless and enjoyable as possible:

### 🔒 Secure GitHub Authorization
Enjoy peace of mind with a secure developer sign-in pipeline integrated with GitHub. Authenticating unlocks advanced dashboard features and guarantees your workspace session remains private and protected.

### ⚡ Infinite Scroll & "Load More" (Zero Latency)
Browse our vast index of 630+ verified public APIs without any screen lag. Our intelligent grid dynamically loads cards as you scroll, avoiding database latency and ensuring a high-speed, stutter-free navigation experience.

### 🤖 Intelligent AI Project Assistant
Simply type what you want to build (e.g., *"I want to build a travel tracker app showing user routes on a map"*), and our assistant curates a custom package of free and open-source APIs from the Vault. You can apply the curated stack to your main grid in one click to filter down exactly what you need.

### 🔍 Quick Search & Sidebar Category Filters
Instantly locate what you are looking for by typing keywords or filtering APIs by categories in our dynamic sidebar. Instantly isolate and discover endpoints tailored to your stack.

### 💻 Interactive Integration Templates
Click on any API card to view comprehensive details including CORS status, verification tags, and security protocols. Copy ready-to-run code templates directly into your sandbox to start building instantly.

### 📚 Interactive Educational Hub ("Know More")
A premium learning space dedicated to learning API integration. Watch the centered centerpiece explainer video, walk through the 3-step sequence explaining client-server requests, and understand the core benefits of delegating heavy lifting to mature public APIs.

### 👨‍💻 Developer Spotlight ("About")
Get to know the architect behind the project! Displays the app vision alongside a modern profile avatar card of the author, complete with direct links to their GitHub portfolio.

---

## 🛠️ Technology Stack

* **Frontend**: Built with **React** and **Vite** for fast hot-module replacement, styled using custom monochromatic palettes with responsive **Tailwind CSS**, and brought to life with fluid spring transitions powered by **Framer Motion**.
* **Backend**: Powered by **Node.js** & **Express** to handle high-concurrency requests and middleware layers.
* **Database & Auth**: Utilizes **MongoDB** for efficient API indexing, and **Passport.js** for secure GitHub authentication.
* **AI Engine**: Integrates Google’s **Gemini AI** (`gemini-2.5-flash`) to analyze user project descriptions and recommend tailored API stacks.

---

## 🚀 Local Installation & Execution

To run the API Vault ecosystem locally, run the client and server processes concurrently:

### Prerequisites
* **Node.js** (v18+ recommended)
* **MongoDB** (Running instance)
* **GitHub OAuth App Credentials** (ClientID & ClientSecret)
* **Gemini API Key**

### 1. Server Configuration
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install server-side dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` configuration file:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/api-vault
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   CALLBACK_URL=http://localhost:5000/api/auth/github/callback
   CLIENT_URL=http://localhost:5173
   SESSION_SECRET=your_session_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the Express server:
   ```bash
   npm run dev
   ```

### 2. Client Configuration
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install client-side dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173` to explore API Vault!

---

## 🧪 Compilation & Production Verification

To verify the full bundle integrity for production deployment, run the client build:
```bash
cd client
npm run build
```
The client package compiles cleanly in **under 8 seconds** with **0 build warnings, 0 syntax exceptions, and 0 bundle errors**. The production-ready files are populated inside `client/dist`.
