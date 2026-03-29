<div align="center">

# NexusCare AI — Next-Generation Clinic Management SaaS

### Premium UI • AI-Integrated • Role-Based • Production-Ready

A high-fidelity healthcare SaaS platform built for modern medical excellence — featuring intelligent AI diagnosis tools, premium glassmorphic dashboards, appointment scheduling, and automated prescription management.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)
![Google Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=flat-square&logo=google)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?style=flat-square&logo=tailwindcss)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Premium UI/UX Features](#premium-uiux-features)
- [AI Intelligence Layer](#ai-intelligence-layer)
- [Tech Stack](#tech-stack)
- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Demo Accounts](#demo-accounts)
- [Acknowledgements](#acknowledgements)

---

## 🏥 Overview

**NexusCare AI** is a professional-grade MERN stack SaaS platform designed to modernize clinical workflows. Unlike traditional management systems, NexusCare AI combines a **premium glassmorphic interface** with **Google Gemini AI** to provide doctors and patients with more than just records — it provides insights.

This project was developed as a **Final Hackathon Project** at **Saylani Mass IT Training (SMIT)**, showcasing an industry-standard full-stack implementation including token rotation, advanced caching with RTK Query, and a tailored CSS v4 design system.

---

## ✨ Premium UI/UX Features

- **Glassmorphism Design System** — Sophisticated use of backdrop blurs and semi-transparent layers for a "modern tech" feel.
- **Teal & Emerald Aesthetic** — A curated medical color palette using advanced CSS v4 variables.
- **Micro-Animations** — Smooth state transitions, loading skeletons, and hover scaling for a high-end feel.
- **Responsive Navigation** — Desktop sidebar + Mobile bottom navigation bar for a native app-like experience on phones.
- **Actionable Dashboards** — Role-specific statistics, quick-action tiles, and visual appointment timelines.

---

## 🤖 AI Intelligence Layer (Powered by Gemini)

NexusCare AI integrates state-of-the-art AI to assist both medical professionals and patients:
- **AI Symptom Checker** — Predictive analysis of patient symptoms with urgency levels.
- **AI Prescription Explainer** — Simplifies complex medical jargon into plain language for patients.
- **AI Risk Flagging** — Analyzes patient history to flag potential health risks early (Available for Pro users).
- **Intelligent Diagnosis Logs** — Tracks every AI interaction for clinical audit and history tracking.

---

## 🛠️ Tech Stack

### Frontend
- **React 19 & Vite 7:** For lightning-fast development and optimized builds.
- **Redux Toolkit & RTK Query:** Advanced state management and efficient API data caching.
- **Tailwind CSS v4:** Next-generation utility-first styling with modern CSS features.
- **Lucide React:** A consistent, high-quality iconography set.
- **jsPDF:** Client-side professional medical document generation.

### Backend
- **Node.js & Express 5 (Alpha):** High-performance RESTful API architecture.
- **MongoDB & Mongoose:** Scalable NoSQL database with strict schema modeling.
- **JWT Authentication:** Dual-token strategy (Access + Refresh) with rotation and HttpOnly cookie security.
- **Google Generative AI:** Direct integration with Gemini Pro for medical text processing.
- **Cloudinary:** Cloud storage for patient avatars and medical images.

---

## 🔐 Role-Based Access Control (RBAC)

| Feature | Admin | Doctor | Receptionist | Patient |
|---|:---:|:---:|:---:|:---:|
| Full System Analytics | ✅ | ❌ | ❌ | ❌ |
| Manage Staff Accounts | ✅ | ❌ | ❌ | ❌ |
| Create Prescriptions | ❌ | ✅ | ❌ | ❌ |
| Book Appointments | ✅ | ❌ | ✅ | ❌ |
| View Own Medical History | ❌ | ❌ | ❌ | ✅ |
| AI Risk Assessment | ❌ | ✅ | ❌ | ❌ |
| Download PDF Rx | ✅ | ✅ | ✅ | ✅ |

---

## 📂 Project Structure

```text
nexuscare-ai/
├── frontend/                      # React + Vite Frontend
│   ├── src/
│   │   ├── app/                   # Store and API Base Query
│   │   ├── components/            # UI Components & Dashboard Layouts
│   │   ├── features/              # API Slices per module (AI, Users, etc.)
│   │   ├── pages/                 # Full Page Views (Marketing & Dashboards)
│   │   ├── router/                # RBAC Protected Routing Logic
│   │   └── utils/                 # PDF Generators & Constants
│
└── backend/                       # Node.js + Express Backend
    ├── src/
    │   ├── controllers/           # Request/Response Logics
    │   ├── models/                # Database Schemas (Mongoose)
    │   ├── routes/                # Endpoint Registry
    │   ├── services/              # Business Logic & AI Integrations
    │   └── scripts/seed.js        # Initial Database Population Data

```

# 🚀 Getting Started
## 1. Prerequisites
Node.js v18+

MongoDB Atlas Account

Google Gemini API Key

Cloudinary Credentials

## 2. Implementation
bash
# Clone the repository
git clone https://github.com/umerakhlaq/aicliinic-final-hackathon
# Setup Backend
cd backend

npm install

npm run seed

npm run dev

# Setup Frontend
cd ../frontend

npm install

npm run dev
