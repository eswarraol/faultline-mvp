# ⚡ FAULTLINE: Autonomous API-Change Remediation Engine

> **The AI that fixes the code your API changes break.**

[![Featherless AI](https://img.shields.io/badge/AI-Featherless%20(Qwen2.5--Coder--32B)-58a6ff?style=for-the-badge&logo=openai)](https://featherless.ai)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20v2.0-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb?style=for-the-badge&logo=react)](https://vitejs.dev)
[![Pytest](https://img.shields.io/badge/Testing-Pytest%20Self--Repair-0A9EDC?style=for-the-badge&logo=pytest)](https://docs.pytest.org)

---

## 📌 Overview

When an upstream API changes a payload schema (for example, renaming `user_id` to `account_id`), existing tooling only tells developers that something broke. **Faultline goes further**: it autonomously investigates the codebase, traces the blast radius, generates a backward-compatible patch, verifies it with real unit tests, and retries when tests fail — keeping a human operator in control before anything is applied to production.

---

## 🔁 Closed-Loop Remediation Architecture

```mermaid
graph TD
    A["1. Detect Contract Change<br/>(API v1 vs v2 Structural Diff)"] --> B["2. Trace Blast Radius<br/>(Tool Calling: search_code, read_file, AST)"]
    B --> C["3. Generate Patch<br/>(Featherless AI: Qwen/Qwen2.5-Coder-32B)"]
    C --> D["4. Execute Real Tests<br/>(Pytest Suite Runner)"]
    D -->|Test Failed| E["Bounded Self-Repair Loop<br/>(Diagnose Error Trace & Retry)"]
    E --> C
    D -->|Test Passed| F["5. Human Operator Gateway"]
    F -->|Approve Local| G["Apply Patch to Disk"]
    F -->|Approve PR| H["Create GitHub Pull Request<br/>(faultline/api-remediation-xxx)"]
```

---

## ✨ Key Features

- **🔍 Deterministic Contract Diffing**: Detects breaking API payload changes (e.g. field renames, removals, type mismatches).
- **🕸️ AST Blast Radius Engine**: Uses agentic tool calls (`search_code`, `read_file`, `analyze_dependency`) to construct an evidence-backed impact tree down to exact line numbers.
- **🤖 Featherless AI Patch Generator**: Powered by `Qwen/Qwen2.5-Coder-32B-Instruct` to generate backward-compatible patches retaining legacy field fallbacks.
- **🧪 Bounded Pytest Retry Loop**: Runs real unit tests in an isolated sub-process with automated failure diagnosis and retry loops.
- **🔒 Human-in-the-Loop Gateway**: Enforces human operator review before code is applied or committed.
- **🐙 Automated GitHub PR Integration**: Creates clean GitHub Pull Requests complete with branch management, blast radius summaries, and test evidence.
- **🛡️ Security-Hardened Architecture**: Prepared with `debug=False`, `slowapi` rate limiting (5 req/min), CORS origin locking, and Pydantic POST payload validation.

---

## 🚀 Quick Start

### 1. Repository Setup

Clone the repository:
```bash
git clone https://github.com/eswarraol/faultline-mvp.git
cd faultline-mvp
```

### 2. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

Create a `backend/.env` file:
```env
FEATHERLESS_API_KEY=your_featherless_api_key_here
GITHUB_TOKEN=optional_github_personal_access_token
```

Start the FastAPI backend server:
```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### 3. Frontend Setup (React + Vite)

In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🌐 Vercel Cloud Deployment

The frontend includes a **Vercel Cloud Simulation Engine** allowing judges to run full 1-click interactive demonstrations on any device:

1. Import `eswarraol/faultline-mvp` into [Vercel](https://vercel.com/new).
2. Set Build Command: `cd frontend && npm install && npm run build`
3. Output Directory: `frontend/dist`
4. Click **Deploy**.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, WebSocket Telemetry |
| **Backend** | Python 3.11+, FastAPI, Pydantic v2, Slowapi, Uvicorn |
| **LLM Provider** | [Featherless AI](https://featherless.ai) (`Qwen/Qwen2.5-Coder-32B-Instruct`) |
| **Testing** | Pytest, Subprocess Isolation |
| **VCS** | Git Operations, GitHub REST API v3 Integration |

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for details.
