#  NEXORA - AI-Powered Multichain Fintech SaaS Platform

NEXORA is a next-generation, production-ready Web3 financial SaaS platform that integrates cross-chain asset management, real-time AI-driven threat intelligence, and browser extension security.

---

##  Tech Stack & Architecture

### **Frontend**
* **Framework:** React / Vite / TypeScript
* **Styling:** Tailwind CSS, Lucide Icons
* **Routing:** React Router DOM
* **Web3 Integration:** Ethers.js (EVM), @solana/web3.js (Solana), Blockstream API (Bitcoin)

### **Backend**
* **Framework:** Python, Django, Django REST Framework (DRF)
* **Database:** PostgreSQL / SQLite (Local)
* **Testing:** Django TestCase (REST API Unit Tests)

### **Browser Extension**
* **Standard:** Manifest V3
* **Scripts:** Background Service Worker, Content Script Injection

---

##  Project Structure

```text
nexora/
├── apps/
│   └── extension/       # Browser Extension (Manifest V3, Popup, Content/Background Scripts)
├── backend/             # Django REST API Backend
│   ├── ai_analytics/    # AI Threat Intelligence logs & risk evaluations
│   ├── subscriptions/   # SaaS Pricing & Plan Management
│   ├── users/           # User authentication & profiles
│   ├── wallets_metadata/# Multi-chain wallet tracking & metadata
│   └── config/          # Django settings & URL routing
└── frontend/            # React + Vite Client Application
    ├── src/
    │   ├── components/  # Reusable UI components (Navbar, etc.)
    │   ├── pages/       # Dedicated pages (Home, Features, Multichain, AI Intelligence, Pricing, Dashboard, Login)
    │   └── services/    # Blockchain & API service integrations
    └── package.json